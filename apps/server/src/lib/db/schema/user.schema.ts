import { index, int, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
	'users',
	{
		id: int().primaryKey({ autoIncrement: true }),
		name: text(),
		email: text().notNull(),
		phoneNumber: text(),
		password: text(),
		profilePic: text(),
		google_access_token: text(),
		updatedAt: int({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdateFn(() => new Date()),
		createdAt: int({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(t) => [uniqueIndex('users_email_idx').on(t.email), index('users_name_idx').on(t.name)],
);

export type IUser = typeof users.$inferSelect;
export type IPartialUser = Partial<typeof users.$inferInsert>;
export type INewUser = typeof users.$inferInsert;
