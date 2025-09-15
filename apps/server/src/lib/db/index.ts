import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import type { DbType } from '@/types/user';

export class DbClient {
	private instance: DbType | null = null;

	constructor(private connection: { url: string; authToken: string }) {}

	async client() {
		if (this.instance) {
			return this.instance;
		}
		const client = createClient({
			url: this.connection.url,
			authToken: this.connection.authToken,
		});
		this.instance = drizzle(client, { schema });

		return this.instance;
	}
}
