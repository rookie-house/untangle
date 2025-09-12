import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

export class DbClient {
	private instance: LibSQLDatabase<typeof schema> | null = null;

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
