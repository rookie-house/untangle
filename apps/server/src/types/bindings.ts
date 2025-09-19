import * as schema from '@/lib/db/schema';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';


export interface Env {
	TURSO_DATABASE_URL: string;
	TURSO_AUTH_TOKEN: string;
	JWT_SECRET: string;
	SALT: string;
	FRONTEND_URL: string;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	GOOGLE_REDIRECT_URI: string;
	BUCKET: R2Bucket;
	AI: Ai;
}

export interface Val {
	user: {
		id: number;
		email: string;
	};
	db: {
		instance: LibSQLDatabase<typeof schema>;
	};
}
