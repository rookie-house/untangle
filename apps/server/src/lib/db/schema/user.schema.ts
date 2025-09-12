import {
	int,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
	"users",
	{
		id: int().primaryKey({ autoIncrement: true }),
		email: text().notNull().unique(),
		password: text(),
		googleAccess: text(),
	},
	(t) => [
		uniqueIndex("users_email_idx").on(t.email),
	]
);

export type IUser = typeof users.$inferSelect;
export type IPartialUser = Partial<typeof users.$inferInsert>;
export type INewUser = typeof users.$inferInsert;
