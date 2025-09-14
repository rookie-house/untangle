CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`password` text,
	`profilePic` text,
	`google_access_token` text,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_name_idx` ON `users` (`name`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`userId` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `users_title_idx` ON `sessions` (`title`);--> statement-breakpoint
CREATE TABLE `documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`r2_key` text NOT NULL,
	`url` text NOT NULL,
	`userId` integer NOT NULL,
	`sessionId` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `documents_sessionId_idx` ON `documents` (`sessionId`);--> statement-breakpoint
CREATE INDEX `documents_title_idx` ON `documents` (`title`);--> statement-breakpoint
CREATE INDEX `documents_userId_idx` ON `documents` (`userId`);--> statement-breakpoint
CREATE INDEX `documents_type_idx` ON `documents` (`type`);