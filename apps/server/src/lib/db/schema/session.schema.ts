import { relations } from 'drizzle-orm';
import { index, int, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { users } from './user.schema';
import { documents } from './document.schema';

export const sessions = sqliteTable(
	'sessions',
	{
		id: text().notNull().primaryKey().unique(),
		title: text().notNull(),
		userId: int().notNull(),
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

export const sessionRelations = relations(sessions, ({ one, many }) => ({
	user: one(users),
	documents: many(documents),
}));

export type ISession = typeof sessions.$inferSelect;
export type IPartialSession = Partial<typeof sessions.$inferInsert>;
export type INewSession = typeof sessions.$inferInsert;
