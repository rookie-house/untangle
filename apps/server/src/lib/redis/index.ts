import type { SessionData, UserData } from '@/types/redis';
import { Redis } from '@upstash/redis';

export class RedisClient {
	private static instance: RedisClient;
	private client: Redis;
	private sessionPrefix = 'session:';
	private userPrefix = 'user:';

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
			cache: 'no-cache',
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

	private _sessionPrefix(sessionId: string): string {
		return `${this.sessionPrefix}${sessionId}`;
	}

	private _userPrefix(phoneNumber: string): string {
		return `${this.userPrefix}${phoneNumber}`;
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
		try {
			await this.client.hset(this._sessionPrefix(sessionId), {
				phoneNumber,
				sessionId,
			});

			if (expiryInSeconds) {
				await this.client.expire(this._sessionPrefix(sessionId), expiryInSeconds);
			}
		} catch (error) {
			console.error('Redis setSession error:', error);
		}
	}

	/**
	 * Get a user session from Redis.
	 * @param sessionId - The unique session identifier.
	 * @returns The session data or null if not found.
	 */
	async getSession({ sessionId }: { sessionId: string }): Promise<SessionData | null> {
		try {
			const result = await this.client.hgetall(this._sessionPrefix(sessionId));
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
		} catch (error) {
			console.error('Redis getSession error:', error);
			return null;
		}
	}

	/**
	 * Delete a user session from Redis.
	 * @param sessionId - The unique session identifier.
	 * @returns The number of keys that were removed.
	 */
	async deleteSession({ sessionId }: { sessionId: string }): Promise<number> {
		try {
			return await this.client.del(this._sessionPrefix(sessionId));
		} catch (error) {
			console.error('Redis deleteSession error:', error);
			return 0;
		}
	}

	/**
	 * Set a user in Redis.
	 * @param phoneNumber - The user's phone number.
	 * @param token - The authentication token.
	 * @param expiryInSeconds - Optional expiration time for the user in seconds.
	 * @returns A promise that resolves when the user is set.
	 */
	async setUser({ phoneNumber, token, sessionId, expiryInSeconds }: { phoneNumber: string; token: string; sessionId?: string; expiryInSeconds?: number }): Promise<void> {
		try {
			await this.client.hset(this._userPrefix(phoneNumber), {
				phoneNumber,
				token,
				sessionId,
			});

			if (expiryInSeconds) {
				await this.client.expire(this._userPrefix(phoneNumber), expiryInSeconds);
			}
		} catch (error) {
			console.error('Redis setUser error:', error);
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
		sessionId,
		expiryInSeconds,
	}: {
		phoneNumber: string;
		token: string;
		sessionId?: string;
		expiryInSeconds?: number;
	}): Promise<void> {
		try {
			// Check if user exists first
			const exists = await this.client.exists(this._userPrefix(phoneNumber));
			if (!exists) {
				throw new Error(`User with phone number ${phoneNumber} does not exist`);
			}

			await this.client.hset(this._userPrefix(phoneNumber), {
				token,
				...(sessionId && { sessionId })
			});

			if (expiryInSeconds) {
				await this.client.expire(this._userPrefix(phoneNumber), expiryInSeconds);
			}
		} catch (error) {
			console.error('Redis updateUser error:', error);
		}
	}

	/**
	 * Get a user session from Redis.
	 * @param phoneNumber - The user's phone number.
	 * @returns The user data or null if not found.
	 */
	async getUser({ phoneNumber }: { phoneNumber: string }): Promise<UserData | null> {
		try {
			const result = await this.client.hgetall(this._userPrefix(phoneNumber));

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
		} catch (error) {
			console.error('Redis getUser error:', error);
			return null;
		}
	}

	/**
	 * Delete a user from Redis.
	 * @param phoneNumber - The user's phone number.
	 * @returns The number of keys that were removed.
	 */
	async deleteUser({ phoneNumber }: { phoneNumber: string }): Promise<number> {
		try {
			return await this.client.del(this._userPrefix(phoneNumber));
		} catch (error) {
			console.error('Redis deleteUser error:', error);
			return 0;
		}
	}

	// Additional utility methods
	/**
	 * Check if a user session exists in Redis.
	 * @param sessionId - The unique session identifier.
	 * @returns True if the session exists, false otherwise.
	 */
	async sessionExists(sessionId: string): Promise<boolean> {
		try {
			return (await this.client.exists(this._sessionPrefix(sessionId))) === 1;
		} catch (error) {
			console.error('Redis sessionExists error:', error);
			return false;
		}
	}

	/**
	 * Check if a user exists in Redis.
	 * @param phoneNumber - The user's phone number.
	 * @returns True if the user exists, false otherwise.
	 */
	async userExists(phoneNumber: string): Promise<boolean> {
		try {
			return (await this.client.exists(this._userPrefix(phoneNumber))) === 1;
		} catch (error) {
			console.error('Redis userExists error:', error);
			return false;
		}
	}

	/**
	 * Get the time-to-live (TTL) of a session in Redis.
	 * @param sessionId - The unique session identifier.
	 * @returns The TTL in seconds, or -1 if the key does not exist.
	 */
	async getSessionTTL(sessionId: string): Promise<number> {
		try {
			return await this.client.ttl(this._sessionPrefix(sessionId));
		} catch (error) {
			console.error('Redis getSessionTTL error:', error);
			return -1;
		}
	}

	/**
	 * Get the time-to-live (TTL) of a user in Redis.
	 * @param phoneNumber - The user's phone number.
	 * @returns The TTL in seconds, or -1 if the key does not exist.
	 */
	async getUserTTL(phoneNumber: string): Promise<number> {
		try {
			return await this.client.ttl(this._userPrefix(phoneNumber));
		} catch (error) {
			console.error('Redis getUserTTL error:', error);
			return -1;
		}
	}

	// Method to close Redis connection
	async disconnect(): Promise<void> {
		try {
			RedisClient.instance = null as any;
		} catch (error) {
			console.error('Redis disconnect error:', error);
		}
	}
}
