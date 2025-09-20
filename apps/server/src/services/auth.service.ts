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

		// Insert new user into the database
		const newUser = await db.insert(users).values({ email, password: hashedPassword }).returning().get();

		if (!newUser) {
			throw new Error('Failed to create user.');
		}

		const token = await this._signToken({
			secret: ctx.env.JWT_SECRET,
			user: { id: newUser.id },
		});

		if (sessionId) {
			const redis = RedisClient.getInstance({
				url: ctx.env.REDIS_URL,
				token: ctx.env.REDIS_TOKEN,
			});
			const session = await redis.getSession({ sessionId });
			if (!session || !session.phoneNumber) {
				throw new Error('Session not found or phone number missing');
			}
			if (await redis.getUser({ phoneNumber: session.phoneNumber })) {
				await redis.updateUser({ phoneNumber: session.phoneNumber, token, expiryInSeconds: 86400 * 30 });
			} else {
				await redis.setUser({ phoneNumber: session.phoneNumber, token, expiryInSeconds: 86400 * 30 });
			}
			await db.update(users).set({ phoneNumber: session.phoneNumber }).where(eq(users.id, newUser.id)).run();
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

		// Verify password
		const isPasswordValid = await this._verifyPass({
			password,
			hash: user.password,
		});

		if (!isPasswordValid) {
			throw new Error('Invalid password');
		}

		const token = await this._signToken({
			user: { id: user.id },
			secret: ctx.env.JWT_SECRET,
		});

		if (sessionId) {
			const redis = RedisClient.getInstance({
				url: ctx.env.REDIS_URL,
				token: ctx.env.REDIS_TOKEN,
			});
			const session = await redis.getSession({ sessionId });
			if (!session || !session.phoneNumber) {
				throw new Error('Session not found or phone number missing');
			}
			if (await redis.getUser({ phoneNumber: session.phoneNumber })) {
				await redis.updateUser({ phoneNumber: session.phoneNumber, token, expiryInSeconds: 86400 * 30 });
			} else {
				await redis.setUser({ phoneNumber: session.phoneNumber, token, expiryInSeconds: 86400 * 30 });
			}
			await db.update(users).set({ phoneNumber: session.phoneNumber }).where(eq(users.id, user.id)).run();
			await redis.deleteSession({ sessionId });
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

	public static readonly googleCallback = async ({ ctx, code, state }: { ctx: Context; code: string; state: string }) => {
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

		if (!me || !me.email?.trim()) {
			throw new Error('Failed to retrieve user info from Google.');
		}

		const { db, error: dbError } = await initializeDatabase(ctx);

		if (dbError || !db) {
			throw new Error(dbError);
		}

		let phoneNumber: string | undefined;

		// If state contains session info, extract phone number from Redis
		if (state.startsWith('session:')) {
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
				phoneNumber: phoneNumber ?? '',
				google_access_token: tokens.access_token,
			})
			.onConflictDoUpdate({
				target: users.email,
				set: {
					google_access_token: tokens.access_token,
					phoneNumber: phoneNumber || users.phoneNumber,
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

			if (await redis.getUser({ phoneNumber })) {
				await redis.updateUser({ phoneNumber, token, expiryInSeconds: 86400 * 30 });
			} else {
				await redis.setUser({ phoneNumber, token, expiryInSeconds: 86400 * 30 });
			}
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

	public static readonly verifyWhatsAppAuth = async ({ ctx, phoneNumber }: { ctx: Context; phoneNumber: string }) => {
		const validateEnv = validateEnvironment(ctx);

		if (!validateEnv) {
			throw new Error('Environment variables are not properly configured.');
		}

		const redis = RedisClient.getInstance({
			url: ctx.env.REDIS_URL,
			token: ctx.env.REDIS_TOKEN,
		});

		const user = await redis.getUser({ phoneNumber });

		if (!user) {
			throw new Error('Invalid session or session expired');
		}

		return {
			token: user.token,
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
