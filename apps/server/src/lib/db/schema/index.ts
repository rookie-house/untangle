import { relations } from 'drizzle-orm';

// Export table definitions
export * from './user.schema';
export * from './session.schema';
export * from './document.schema';

// Import tables for relations
import { users } from './user.schema';
import { sessions } from './session.schema';
import { documents } from './document.schema';

// Define relations here to avoid circular imports
export const userRelations = relations(users, ({ many }) => ({
    sessions: many(sessions, {
        relationName: 'user_sessions',
    }),
    documents: many(documents, {
        relationName: 'user_documents',
    }),
}));

export const sessionRelations = relations(sessions, ({ one, many }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
        relationName: 'user_sessions',
    }),
    documents: many(documents, {
        relationName: 'session_documents',
    }),
}));

export const documentRelations = relations(documents, ({ one }) => ({
    user: one(users, {
        fields: [documents.userId],
        references: [users.id],
        relationName: 'user_documents',
    }),
    session: one(sessions, {
        fields: [documents.sessionId],
        references: [sessions.id],
        relationName: 'session_documents',
    }),
}));
