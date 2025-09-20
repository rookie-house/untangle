import type { SessionData, UserData } from '@/types/redis';
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

	/**
	 * Get the singleton instance of the RedisClient.
	 * @param config - Redis configuration object containing the URL and token.
	 * @returns The RedisClient instance.
	 */

	public static getInstance(config: { url: string; token: string }): RedisClient {
		// Check if config has changed and recreate instance if needed
		if (!RedisClient.instance || RedisClient.instance.config.url !== config.url || RedisClient.instance.config.token !== config.token) {
			RedisClient.instance = new RedisClient(config);
		}
		return RedisClient.instance;
	}

	/**
	 * Set a user session in Redis.
	 * @param phoneNumber - The user's phone number.
	 * @param sessionId - The unique session identifier.
	 * @param expiryInSeconds - Optional expiration time for the session in seconds.
	 * @returns A promise that resolves when the session is set.
	 */
	async setSession({
		phoneNumber,
		sessionId,
		expiryInSeconds,
	}: {
		phoneNumber: string;
		sessionId: string;
		expiryInSeconds?: number;
	}): Promise<void> {
		await this.client.hset(sessionId, {
			phoneNumber,
			sessionId,
		});

		if (expiryInSeconds) {
			await this.client.expire(sessionId, expiryInSeconds);
		}
	}

	/**
	 * Get a user session from Redis.
	 * @param sessionId - The unique session identifier.
	 * @returns The session data or null if not found.
	 */
	async getSession({ sessionId }: { sessionId: string }): Promise<SessionData | null> {
		const result = await this.client.hgetall(sessionId);

		// Check if the hash exists and has the required fields
		if (!result || typeof result !== 'object' || Object.keys(result).length === 0) {
			return null;
		}

		const { phoneNumber, sessionId: storedSessionId } = result;

		// Ensure values are strings and not empty
		if (!phoneNumber || !storedSessionId || typeof phoneNumber !== 'string' || typeof storedSessionId !== 'string') {
			return null;
		}

		return {
			phoneNumber,
			sessionId: storedSessionId,
		};
	}

	/**
	 * Delete a user session from Redis.
	 * @param sessionId - The unique session identifier.
	 * @returns The number of keys that were removed.
	 */
	async deleteSession({ sessionId }: { sessionId: string }): Promise<number> {
		return await this.client.del(sessionId);
	}

	/**
	 * Set a user in Redis.
	 * @param phoneNumber - The user's phone number.
	 * @param token - The authentication token.
	 * @param expiryInSeconds - Optional expiration time for the user in seconds.
	 * @returns A promise that resolves when the user is set.
	 */
	async setUser({ phoneNumber, token, expiryInSeconds }: { phoneNumber: string; token: string; expiryInSeconds?: number }): Promise<void> {
		await this.client.hset(phoneNumber, {
			phoneNumber,
			token,
		});

		if (expiryInSeconds) {
			await this.client.expire(phoneNumber, expiryInSeconds);
		}
	}

	/**
	 * Update a user in Redis.
	 * @param phoneNumber - The user's phone number.
	 * @param token - The new authentication token.
	 * @param expiryInSeconds - Optional expiration time for the user in seconds.
	 * @returns A promise that resolves when the user is updated.
	 */
	async updateUser({
		phoneNumber,
		token,
		expiryInSeconds,
	}: {
		phoneNumber: string;
		token: string;
		expiryInSeconds?: number;
	}): Promise<void> {
		// Check if user exists first
		const exists = await this.client.exists(phoneNumber);
		if (!exists) {
			throw new Error(`User with phone number ${phoneNumber} does not exist`);
		}

		await this.client.hset(phoneNumber, {
			token,
		});

		if (expiryInSeconds) {
			await this.client.expire(phoneNumber, expiryInSeconds);
		}
	}

	/**
	 * Get a user session from Redis.
	 * @param phoneNumber - The user's phone number.
	 * @returns The user data or null if not found.
	 */
	async getUser({ phoneNumber }: { phoneNumber: string }): Promise<UserData | null> {
		const result = await this.client.hgetall(phoneNumber);

		// Check if the hash exists and has the required fields
		if (!result || typeof result !== 'object' || Object.keys(result).length === 0) {
			return null;
		}

		const { phoneNumber: storedPhoneNumber, token } = result;

		// Ensure values are strings and not empty
		if (!storedPhoneNumber || !token || typeof storedPhoneNumber !== 'string' || typeof token !== 'string') {
			return null;
		}

		return {
			phoneNumber: storedPhoneNumber,
			token,
		};
	}

	/**
	 * Delete a user from Redis.
	 * @param phoneNumber - The user's phone number.
	 * @returns The number of keys that were removed.
	 */
	async deleteUser({ phoneNumber }: { phoneNumber: string }): Promise<number> {
		return await this.client.del(phoneNumber);
	}

	// Additional utility methods
	/**
	 * Check if a user session exists in Redis.
	 * @param sessionId - The unique session identifier.
	 * @returns True if the session exists, false otherwise.
	 */
	async sessionExists(sessionId: string): Promise<boolean> {
		return (await this.client.exists(sessionId)) === 1;
	}

	/**
	 * Check if a user exists in Redis.
	 * @param phoneNumber - The user's phone number.
	 * @returns True if the user exists, false otherwise.
	 */
	async userExists(phoneNumber: string): Promise<boolean> {
		return (await this.client.exists(phoneNumber)) === 1;
	}

	/**
	 * Get the time-to-live (TTL) of a session in Redis.
	 * @param sessionId - The unique session identifier.
	 * @returns The TTL in seconds, or -1 if the key does not exist.
	 */
	async getSessionTTL(sessionId: string): Promise<number> {
		return await this.client.ttl(sessionId);
	}

	/**
	 * Get the time-to-live (TTL) of a user in Redis.
	 * @param phoneNumber - The user's phone number.
	 * @returns The TTL in seconds, or -1 if the key does not exist.
	 */
	async getUserTTL(phoneNumber: string): Promise<number> {
		return await this.client.ttl(phoneNumber);
	}

	// Method to close Redis connection
	async disconnect(): Promise<void> {
		RedisClient.instance = null as any;
	}
}
