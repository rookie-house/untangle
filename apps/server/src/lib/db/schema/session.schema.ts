import { index, int, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { users } from './user.schema';

export const sessions = sqliteTable(
	'sessions',
	{
		id: text().notNull().primaryKey().unique(),
		title: text(),
		userId: int().notNull().references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		updatedAt: int({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdateFn(() => new Date()),
		createdAt: int({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(t) => [uniqueIndex('users_title_idx').on(t.title), index('users_title_idx').on(t.title)],
);

export type ISession = typeof sessions.$inferSelect;
export type IPartialSession = Partial<typeof sessions.$inferInsert>;
export type INewSession = typeof sessions.$inferInsert;
