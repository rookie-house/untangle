import type { Context } from "hono";
import { RedisClient } from "../redis";

/**
 * Checks if a user token exists for the given phone number.
 * @param ctx - The context object.
 * @param phoneNumber - The phone number to check.
 * @returns The user token if it exists, otherwise null.
 */
export async function checkToken(phoneNumber: string, ctx: Context, ) {
	try {
		const redis = await connectRedis(ctx);
		const user = await redis.getUser({ phoneNumber });
		if (!user) {
			return null;
		}
		return user.token;
	} catch (error) {
		console.error("Error checking token:", error);
		return null;
	}
}

/**
 * Checks if a user session ID exists for the given phone number.
 * @param ctx - The context object.
 * @param phoneNumber - The phone number to check.
 * @returns The user session ID if it exists, otherwise null.
 */
export async function getSessionId(ctx: Context, phoneNumber: string) {
	try {
		const redis = await connectRedis(ctx);
		const user = await redis.getUser({ phoneNumber });
		if (!user) {
			return null;
		}
		return user.sessionId;
	} catch (error) {
		console.error("Error getting session ID:", error);
		return null;
	}
}

async function connectRedis(ctx: Context) {
	return RedisClient.getInstance({
		url: ctx.env.REDIS_URL,
		token: ctx.env.REDIS_TOKEN,
	});
}
