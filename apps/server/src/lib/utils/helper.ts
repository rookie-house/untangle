import type { Context } from "hono";
import { DbClient } from "../db";

// Helper function to validate environment variables
export const validateEnvironment = (ctx: Context) => {
	try {
		const missingVars = [];

		if (!ctx.env.TURSO_AUTH_TOKEN) missingVars.push("TURSO_AUTH_TOKEN");
		if (!ctx.env.TURSO_DATABASE_URL) missingVars.push("TURSO_DATABASE_URL");
		if (!ctx.env.JWT_SECRET) missingVars.push("JWT_SECRET");
		if (!ctx.env.SALT) missingVars.push("SALT");

		if (missingVars.length > 0) {
			throw new Error(
				`Missing required environment variables: ${missingVars.join(", ")}`
			);
		}

		return {
			isValid: true,
			missingVars: [],
		};
	} catch (error) {
		throw error;
	}
};

// Helper function to initialize database connection
export const initializeDatabase = async (ctx: Context) => {
	try {
		const dbClient = new DbClient({
			authToken: ctx.env.TURSO_AUTH_TOKEN,
			url: ctx.env.TURSO_DATABASE_URL,
		});
		return { db: await dbClient.client(), error: null };
	} catch (error) {
		console.error("Database connection error:", error);
		return { db: null, error: "Database connection failed" };
	}
};
