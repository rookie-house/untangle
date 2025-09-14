import { relations } from 'drizzle-orm';
import { index, int, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sessions } from './session.schema';
import { documents } from './document.schema';

export const users = sqliteTable(
	'users',
	{
		id: int().primaryKey({ autoIncrement: true }),
		name: text(),
		email: text().notNull(),
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
	(t) => [
		uniqueIndex('users_email_idx').on(t.email),
		index('users_name_idx').on(t.name),
	],
);

export const userRelations = relations(users, ({ many }) => ({
	session: many(sessions),
	documents: many(documents),
}));

export type IUser = typeof users.$inferSelect;
export type IPartialUser = Partial<typeof users.$inferInsert>;
export type INewUser = typeof users.$inferInsert;
