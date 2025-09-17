DROP INDEX "users_email_idx";--> statement-breakpoint
DROP INDEX "users_name_idx";--> statement-breakpoint
DROP INDEX "sessions_id_unique";--> statement-breakpoint
DROP INDEX "users_title_idx";--> statement-breakpoint
DROP INDEX "documents_id_unique";--> statement-breakpoint
DROP INDEX "documents_sessionId_idx";--> statement-breakpoint
DROP INDEX "documents_title_idx";--> statement-breakpoint
DROP INDEX "documents_userId_idx";--> statement-breakpoint
DROP INDEX "documents_type_idx";--> statement-breakpoint
ALTER TABLE `sessions` ALTER COLUMN "title" TO "title" text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_name_idx` ON `users` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_id_unique` ON `sessions` (`id`);--> statement-breakpoint
CREATE INDEX `users_title_idx` ON `sessions` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `documents_id_unique` ON `documents` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `documents_sessionId_idx` ON `documents` (`sessionId`);--> statement-breakpoint
CREATE INDEX `documents_title_idx` ON `documents` (`title`);--> statement-breakpoint
CREATE INDEX `documents_userId_idx` ON `documents` (`userId`);--> statement-breakpoint
CREATE INDEX `documents_type_idx` ON `documents` (`type`);