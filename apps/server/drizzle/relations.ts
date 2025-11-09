import { relations } from "drizzle-orm/relations";
import { users, sessions, documents } from "./schema";

export const sessionsRelations = relations(sessions, ({one, many}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
	documents: many(documents),
}));

export const usersRelations = relations(users, ({many}) => ({
	sessions: many(sessions),
	documents: many(documents),
}));

export const documentsRelations = relations(documents, ({one}) => ({
	session: one(sessions, {
		fields: [documents.sessionId],
		references: [sessions.id]
	}),
	user: one(users, {
		fields: [documents.userId],
		references: [users.id]
	}),
}));