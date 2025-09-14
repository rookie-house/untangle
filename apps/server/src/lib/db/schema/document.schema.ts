import { relations } from 'drizzle-orm';
import { index, int, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { users } from './user.schema';
import { sessions } from './session.schema';

export const documents = sqliteTable(
	'documents',
	{
		id: int().notNull().primaryKey({ autoIncrement: true }),
		title: text().notNull(),
		type: text('type', {
			enum: ['image', 'pdf', 'other'],
		})
			.$type<'image' | 'pdf' | 'other'>()
			.notNull(),
		r2_key: text().notNull(),
		url: text().notNull(),
		userId: int().notNull(),
		sessionId: int().notNull(),
		updatedAt: int({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdateFn(() => new Date()),
		createdAt: int({ mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(t) => [
		uniqueIndex('documents_sessionId_idx').on(t.sessionId),
		index('documents_title_idx').on(t.title),
		index('documents_userId_idx').on(t.userId),
		index('documents_type_idx').on(t.type),
		index('documents_title_idx').on(t.title),
	],
);

export const documentRelations = relations(documents, ({ one }) => ({
	user: one(users),
	session: one(sessions),
}));

export type IDocument = typeof documents.$inferSelect;
export type IPartialDocument = Partial<typeof documents.$inferInsert>;
export type INewDocument = typeof documents.$inferInsert;
