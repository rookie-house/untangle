import type { Context } from "hono";
import { RedisClient } from "../redis";

export async function checkToken(ctx: Context, phoneNumber: string) {
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
		url: ctx.env.REDIS_REST_URL,
		token: ctx.env.REDIS_REST_TOKEN,
	});
}
