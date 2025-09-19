import { Redis } from '@upstash/redis';

export class RedisClient {
	private static instance: RedisClient;
	private client: Redis;

	private constructor(
		private config: {
			url: string;
			token: string;
		},
	) {
		this.client = new Redis({
			url: config.url,
			token: config.token,
			retry: {
				retries: 5,
				backoff: (retryCount) => Math.exp(retryCount) * 50,
			},
		});
	}

	public static getInstance(config: { url: string; token: string }): RedisClient {
		if (!RedisClient.instance) {
			RedisClient.instance = new RedisClient(config);
		}
		return RedisClient.instance;
	}

	async setSession({ phoneNumber, sessionId, expiryInSeconds }: { phoneNumber: string; sessionId: string; expiryInSeconds?: number }) {
		await this.client.hset(sessionId, {
			phoneNumber: phoneNumber,
			sessionId: sessionId,
		});
		if (expiryInSeconds) {
			await this.client.expire(sessionId, expiryInSeconds);
		}
	}

	async getSession({ sessionId }: { sessionId: string }): Promise<{ phoneNumber: string; sessionId: string } | null> {
		return await this.client.hgetall(sessionId);
	}

	async deleteSession({ sessionId }: { sessionId: string }) {
		await this.client.del(sessionId);
	}

	async setUser({ phoneNumber, token, expiryInSeconds }: { phoneNumber: string; token: string; expiryInSeconds?: number }) {
		await this.client.hset(phoneNumber, {
			phoneNumber: phoneNumber,
			token: token,
		});
		if (expiryInSeconds) {
			await this.client.expire(phoneNumber, expiryInSeconds);
		}
	}

	async updateUser({ phoneNumber, token, expiryInSeconds }: { phoneNumber: string; token: string; expiryInSeconds?: number }) {
		await this.client.hset(phoneNumber, {
			token: token,
		});
		if (expiryInSeconds) {
			await this.client.expire(phoneNumber, expiryInSeconds);
		}
	}

	async getUser({ phoneNumber }: { phoneNumber: string }): Promise<{ phoneNumber: string; token: string } | null> {
		return await this.client.hgetall(phoneNumber);
	}

	async deleteUser({ phoneNumber }: { phoneNumber: string }) {
		await this.client.del(phoneNumber);
	}
}
