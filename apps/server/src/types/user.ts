import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '@lib/db/schema';

export interface IUserContext {
	id: number;
	email: string;
}

export type DbType = LibSQLDatabase<typeof schema>;
