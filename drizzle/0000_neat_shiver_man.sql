-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `items` (
	`id` integer PRIMARY KEY NOT NULL,
	`done` integer,
	`value` text
);
--> statement-breakpoint
CREATE TABLE `fruit` (
	`id` text PRIMARY KEY NOT NULL,
	`at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `fruit_idx` ON `fruit` (`at`);--> statement-breakpoint
CREATE TABLE `click` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`on` text NOT NULL,
	`at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`on`) REFERENCES `fruit`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `click_idx` ON `click` (`on`,`at`);
*/