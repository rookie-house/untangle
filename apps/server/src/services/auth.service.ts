import type { Context } from 'hono';
import { sign, verify } from 'hono/jwt';
import { compare, hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { initializeDatabase, validateEnvironment } from '@/lib/utils/helper';
import { users } from '@/lib/db/schema';
import type { IJwtUserPayload } from '@/types/jwt';
import GoogleAuth from '@/lib/google';
import { RedisClient } from '@/lib/redis';

export class AuthService {
	public static readonly signup = async ({
		ctx,
		email,
		password,
		sessionId,
	}: {
		ctx: Context;
		email: string;
		password: string;
		sessionId?: string;
	}) => {
		const validateEnv = validateEnvironment(ctx);

		if (!validateEnv) {
			throw new Error('Environment variables are not properly configured.');
		}

		const { db, error: dbError } = await initializeDatabase(ctx);

		if (dbError || !db) {
			throw new Error(dbError);
		}

		// Check if user already exists
		const existingUser = await db.select().from(users).where(eq(users.email, email)).get();

		if (existingUser) {
			throw new Error('A user with this email address already exists.');
		}

		const hashedPassword = await this._hashPass({
			password,
			salt: ctx.env.SALT,
		});

		let phoneNumber: string | null = null;
		let redis: RedisClient | undefined;

		if (sessionId) {
			redis = RedisClient.getInstance({
				url: ctx.env.REDIS_URL,
				token: ctx.env.REDIS_TOKEN,
			});
			const session = await redis.getSession({ sessionId });
			if (!session || !session.phoneNumber) {
				throw new Error('Session not found or phone number missing');
			}
			phoneNumber = session.phoneNumber;
		}

		// Insert new user into the database
		const insertValues: any = { email, password: hashedPassword };
		if (phoneNumber) {
			insertValues.phoneNumber = phoneNumber;
		}

		const newUser = await db.insert(users).values(insertValues).returning().get();

		if (!newUser) {
			throw new Error('Failed to create user.');
		}

		const token = await this._signToken({
			secret: ctx.env.JWT_SECRET,
			user: { id: newUser.id },
		});

		if (phoneNumber && redis && sessionId) {
			await this._upsertUserToken({ redis, phoneNumber: phoneNumber, token });
			await redis.deleteSession({ sessionId });
		}

		return { token, user: { id: newUser.id, email: newUser.email, name: newUser.name, profilePic: newUser.profilePic } };
	};

	public static readonly signin = async ({
		ctx,
		email,
		password,
		sessionId,
	}: {
		ctx: Context;
		email: string;
		password: string;
		sessionId?: string;
	}) => {
		const validateEnv = validateEnvironment(ctx);

		if (!validateEnv) {
			throw new Error('Environment variables are not properly configured.');
		}

		const { db, error: dbError } = await initializeDatabase(ctx);

		if (dbError || !db) {
			throw new Error(dbError);
		}

		// Find user by email
		const user = await db.select().from(users).where(eq(users.email, email)).get();

		if (!user) {
			throw new Error('User with this email address not found');
		}

		if (!user.password) {
			throw new Error('User has no password set. Please use Google Sign-In.');
		}

		let sessionPhoneNumber: string | undefined;
		let redis: RedisClient | undefined;

		// Validate phone number first if sessionId is provided (before password check)
		if (sessionId) {
			redis = RedisClient.getInstance({
				url: ctx.env.REDIS_URL,
				token: ctx.env.REDIS_TOKEN,
			});
			const session = await redis.getSession({ sessionId });
			if (!session || !session.phoneNumber) {
				throw new Error('Session not found or phone number missing');
			}

			// Check if the user's phone number matches the session phone number
			if (user.phoneNumber && user.phoneNumber !== session.phoneNumber) {
				throw new Error('Phone number mismatch. Please verify your phone number.');
			}

			sessionPhoneNumber = session.phoneNumber;
		}

		// Verify password only after phone number validation passes
		const isPasswordValid = await this._verifyPass({
			password,
			hash: user.password,
		});

		if (!isPasswordValid) {
			throw new Error('Invalid password');
		}

		// Update user's phone number if not set and clean up session
		if (sessionId && redis && sessionPhoneNumber) {
			if (!user.phoneNumber) {
				await db.update(users).set({ phoneNumber: sessionPhoneNumber }).where(eq(users.id, user.id)).run();
			}

			await redis.deleteSession({ sessionId });
		}

		// Generate token only after all validations pass
		const token = await this._signToken({
			user: { id: user.id },
			secret: ctx.env.JWT_SECRET,
		});

		// Update Redis with token if sessionId was provided (reuse existing redis instance)
		if (sessionId && sessionPhoneNumber && redis) {
			await this._upsertUserToken({ redis, phoneNumber: sessionPhoneNumber, token });
		}

		return { token, user: { id: user.id, email: user.email, name: user.name, profilePic: user.profilePic } };
	};

	public static readonly googleAuthUrl = async ({ ctx, sessionId }: { ctx: Context; sessionId?: string }) => {
		const validateEnv = validateEnvironment(ctx);

		if (!validateEnv) {
			throw new Error('Environment variables are not properly configured.');
		}

		const googleAuthUrl = GoogleAuth.getInstance({
			googleClientId: ctx.env.GOOGLE_CLIENT_ID || '',
			googleClientSecret: ctx.env.GOOGLE_CLIENT_SECRET || '',
			googleRedirectUri: ctx.env.GOOGLE_REDIRECT_URI || '',
		}).getAuthUrl(sessionId);

		if (!googleAuthUrl) {
			throw new Error('Failed to generate Google authentication URL.');
		}

		// Only create session in Redis if sessionId is provided
		if (sessionId) {
			await RedisClient.getInstance({
				url: ctx.env.REDIS_URL,
				token: ctx.env.REDIS_TOKEN,
			}).setSession({ sessionId, phoneNumber: '', expiryInSeconds: 300 });
		}

		return { url: googleAuthUrl };
	};

	public static readonly googleCallback = async ({ ctx, code, state }: { ctx: Context; code: string; state?: string }) => {
		const validateEnv = validateEnvironment(ctx);

		if (!validateEnv) {
			throw new Error('Environment variables are not properly configured.');
		}

		const google = GoogleAuth.getInstance({
			googleClientId: ctx.env.GOOGLE_CLIENT_ID || '',
			googleClientSecret: ctx.env.GOOGLE_CLIENT_SECRET || '',
			googleRedirectUri: ctx.env.GOOGLE_REDIRECT_URI || '',
		});

		const tokens = await google.getTokens(code);

		if (!tokens || !tokens.access_token) {
			throw new Error('Failed to retrieve Google tokens.');
		}


		const me = await google.me(tokens.access_token);

		if (!me || !me.email) {
			throw new Error('Failed to retrieve user info from Google.');
		}

		const { db, error: dbError } = await initializeDatabase(ctx);

		if (dbError || !db) {
			throw new Error(dbError);
		}

		let phoneNumber: string | undefined;

		// If state contains session info, extract phone number from Redis
		if (state && state.startsWith('session:')) {
			const sessionId = state.split('session:')[1];

			if (!sessionId) {
				throw new Error('Session not found or phone number missing');
			}

			const redis = RedisClient.getInstance({
				url: ctx.env.REDIS_URL,
				token: ctx.env.REDIS_TOKEN,
			});

			phoneNumber = await redis.getSession({ sessionId }).then((s) => s?.phoneNumber);

			if (!phoneNumber) {
				throw new Error('Session not found or phone number missing');
			}

			await redis.deleteSession({ sessionId });
		}

		const user = await db
			.insert(users)
			.values({
				email: me.email,
				name: me.name,
				profilePic: me.profilePic,
				phoneNumber: phoneNumber ?? null,
				google_access_token: tokens.access_token,
			})
			.onConflictDoUpdate({
				target: users.email,
				set: {
					google_access_token: tokens.access_token,
					phoneNumber: phoneNumber ?? users.phoneNumber,
				},
			})
			.returning({
				id: users.id,
				email: users.email,
				name: users.name,
				phoneNumber: users.phoneNumber,
				google_access_token: users.google_access_token,
				profilePic: users.profilePic,
			})
			.get();

		if (!user) {
			throw new Error('Failed to create or update user.');
		}
		console.log('Upserted User:', user);

		const token = await this._signToken({
			user: { id: user.id },
			secret: ctx.env.JWT_SECRET,
		});

		// set token to redis for whatsapp auth
		if (phoneNumber) {
			const redis = RedisClient.getInstance({
				url: ctx.env.REDIS_URL,
				token: ctx.env.REDIS_TOKEN,
			});

			await this._upsertUserToken({ redis, phoneNumber, token });
		}

		return { token, user: { id: user.id, email: user.email, name: user.name, profilePic: user.profilePic } };
	};

	public static readonly getWhatsAppAuthLink = async ({ ctx, phoneNumber }: { ctx: Context; phoneNumber: string }) => {
		const sessionId = crypto.randomUUID();

		const validateEnv = validateEnvironment(ctx);

		if (!validateEnv) {
			throw new Error('Environment variables are not properly configured.');
		}

		await RedisClient.getInstance({
			url: ctx.env.REDIS_URL,
			token: ctx.env.REDIS_TOKEN,
		}).setSession({
			phoneNumber,
			sessionId,
			expiryInSeconds: 300, // 5 minutes
		});

		return {
			url: `${ctx.env.FRONTEND_URL}/whatsapp/auth?sessionId=${sessionId}&phoneNumber=${encodeURIComponent(phoneNumber)}`,
		};
	};

	private static async _hashPass({ password, salt }: { password: string; salt: string }): Promise<string> {
		return await hash(password, Number(salt));
	}

	private static async _verifyPass({ password, hash }: { password: string; hash: string }): Promise<boolean> {
		return await compare(password, hash);
	}

	private static async _signToken({ user, secret }: { user: IJwtUserPayload; secret: string }): Promise<string> {
		return await sign({ id: user.id }, secret);
	}

	/**
	 * Helper function to upsert user token in Redis
	 * @param redis - Redis client instance
	 * @param phoneNumber - User's phone number
	 * @param token - JWT token to store
	 * @param ttl - Time to live in seconds (optional, defaults to USER_TOKEN_TTL_SECONDS)
	 */
	private static async _upsertUserToken({
		redis,
		phoneNumber,
		token,
		ttl = 86400 * 30, // 30 days
	}: {
		redis: RedisClient;
		phoneNumber: string;
		token: string;
		ttl?: number;
	}): Promise<void> {
		const existingUser = await redis.getUser({ phoneNumber });

		if (existingUser) {
			await redis.updateUser({ phoneNumber, token, expiryInSeconds: ttl });
		} else {
			await redis.setUser({ phoneNumber, token, expiryInSeconds: ttl });
		}
	}

	public static async verifyToken({ token, ctx }: { token: string; ctx: Context }): Promise<IJwtUserPayload | null> {
		try {
			const secret = ctx.env.JWT_SECRET;
			const payload = (await verify(token, secret)) as unknown as IJwtUserPayload;
			return payload;
		} catch (error) {
			console.error('Token verification failed:', error);
			return null;
		}
	}
}
