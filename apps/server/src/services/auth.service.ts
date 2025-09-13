import type { Context } from "hono";
import { sign, verify } from "hono/jwt";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { initializeDatabase, validateEnvironment } from "@/lib/utils/helper";
import { users } from "@/lib/db/schema";
import type { IJwtUserPayload } from "@/types/jwt";
import GoogleAuth from "@/lib/google";

export class AuthService {
	public static readonly signup = async ({
		ctx,
		email,
		password,
	}: {
		ctx: Context;
		email: string;
		password: string;
	}) => {
		const validateEnv = validateEnvironment(ctx);

		if (!validateEnv) {
			throw new Error("Environment variables are not properly configured.");
		}

		const { db, error: dbError } = await initializeDatabase(ctx);

		if (dbError || !db) {
			throw new Error(dbError);
		}

		// Check if user already exists
		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.get();

		if (existingUser) {
			throw new Error("User already exists.");
		}

		const hashedPassword = await this._hashPass({
			password,
			salt: ctx.env.SALT,
		});

		// Insert new user into the database
		const newUser = await db
			.insert(users)
			.values({ email, password: hashedPassword })
			.returning()
			.get();

		if (!newUser) {
			throw new Error("Failed to create user.");
		}

		const token = await this._signToken({
			secret: ctx.env.JWT_SECRET,
			user: { id: newUser.id },
		});

		return { token, user: { id: newUser.id, email: newUser.email } };
	};

	public static readonly signin = async ({
		ctx,
		email,
		password,
	}: {
		ctx: Context;
		email: string;
		password: string;
	}) => {
		const validateEnv = validateEnvironment(ctx);

		if (!validateEnv) {
			throw new Error("Environment variables are not properly configured.");
		}

		const { db, error: dbError } = await initializeDatabase(ctx);

		if (dbError || !db) {
			throw new Error(dbError);
		}

		// Find user by email
		const user = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.get();

		if (!user) {
			throw new Error("User not found.");
		}

		if (!user.password) {
			throw new Error("User has no password set.");
		}

		// Verify password
		const isPasswordValid = await this._verifyPass({
			password,
			hash: user.password,
		});

		if (!isPasswordValid) {
			throw new Error("Invalid password.");
		}

		const token = await this._signToken({
			user: { id: user.id },
			secret: ctx.env.JWT_SECRET,
		});

		return { token, user: { id: user.id, email: user.email } };
	};

	public static readonly googleAuthUrl = async ({ ctx }: { ctx: Context }) => {
		const validateEnv = validateEnvironment(ctx);

		if (!validateEnv) {
			throw new Error("Environment variables are not properly configured.");
		}

		const googleAuthUrl = GoogleAuth.getInstance({
			googleClientId: ctx.env.GOOGLE_CLIENT_ID || "",
			googleClientSecret: ctx.env.GOOGLE_CLIENT_SECRET || "",
			googleRedirectUri: ctx.env.GOOGLE_REDIRECT_URI || "",
		}).getAuthUrl();

		if (!googleAuthUrl) {
			throw new Error("Failed to generate Google authentication URL.");
		}

		return { url: googleAuthUrl };
	};

	public static readonly googleCallback = async ({
		ctx,
		code,
	}: {
		ctx: Context;
		code: string;
	}) => {
		const validateEnv = validateEnvironment(ctx);

		if (!validateEnv) {
			throw new Error("Environment variables are not properly configured.");
		}

		const google = await GoogleAuth.getInstance({
			googleClientId: ctx.env.GOOGLE_CLIENT_ID || "",
			googleClientSecret: ctx.env.GOOGLE_CLIENT_SECRET || "",
			googleRedirectUri: ctx.env.GOOGLE_REDIRECT_URI || "",
		});

		const tokens = await google.getTokens(code);

		if (!tokens || !tokens.access_token) {
			throw new Error("Failed to retrieve Google tokens.");
		}

		const me = await google.me(tokens.access_token);

		if (!me || !me.email) {
			throw new Error("Failed to retrieve user info from Google.");
		}

		const { db, error: dbError } = await initializeDatabase(ctx);

		if (dbError || !db) {
			throw new Error(dbError);
		}

		const user = await db
			.insert(users)
			.values({
				email: me.email,
				googleAccess: tokens.refresh_token,
			})
			.onConflictDoUpdate({
				target: users.email,
				set: {
					googleAccess: tokens.refresh_token,
				},
			})
			.returning({
				id: users.id,
				email: users.email,
				googleAccess: users.googleAccess,
			})
			.get();

		if (!user) {
			throw new Error("Failed to create or update user.");
		}

		const token = await this._signToken({
			user: { id: user.id },
			secret: ctx.env.JWT_SECRET,
		});

		return { token, user: { id: user.id, email: user.email } };
	};

	private static async _hashPass({
		password,
		salt,
	}: {
		password: string;
		salt: string;
	}): Promise<string> {
		return await hash(password, Number(salt));
	}

	private static async _verifyPass({
		password,
		hash,
	}: {
		password: string;
		hash: string;
	}): Promise<boolean> {
		return await compare(password, hash);
	}

	private static async _signToken({
		user,
		secret,
	}: {
		user: IJwtUserPayload;
		secret: string;
	}): Promise<string> {
		return await sign({ id: user.id }, secret);
	}
}
