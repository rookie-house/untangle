import { sqliteTable, AnySQLiteColumn, index, uniqueIndex, integer, text, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const users = sqliteTable("users", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text(),
	email: text().notNull(),
	password: text(),
	profilePic: text(),
	googleAccessToken: text("google_access_token"),
	updatedAt: integer().notNull(),
	createdAt: integer().notNull(),
	phoneNumber: text(),
},
(table) => [
	index("users_name_idx").on(table.name),
	uniqueIndex("users_email_idx").on(table.email),
]);

export const sessions = sqliteTable("sessions", {
	id: text().primaryKey().notNull(),
	title: text(),
	userId: integer().notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	updatedAt: integer().notNull(),
	createdAt: integer().notNull(),
},
(table) => [
	index("users_title_idx").on(table.title),
	uniqueIndex("sessions_id_unique").on(table.id),
]);

export const documents = sqliteTable("documents", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	type: text().notNull(),
	url: text().notNull(),
	userId: integer().notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	sessionId: text().references(() => sessions.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	updatedAt: integer().notNull(),
	createdAt: integer().notNull(),
},
(table) => [
	index("documents_type_idx").on(table.type),
	index("documents_userId_idx").on(table.userId),
	index("documents_title_idx").on(table.title),
	uniqueIndex("documents_sessionId_idx").on(table.sessionId),
	uniqueIndex("documents_id_unique").on(table.id),
]);

