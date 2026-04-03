import { sqliteTable, AnySQLiteColumn, integer, text, index, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const items = sqliteTable("items", {
	id: integer().primaryKey().notNull(),
	done: integer(),
	value: text(),
});

export const fruit = sqliteTable("fruit", {
	id: text().primaryKey().notNull(),
	at: text().default("sql`(datetime('now'))`").notNull(),
},
(table) => [
	index("fruit_idx").on(table.at),
]);

export const click = sqliteTable("click", {
	id: text().default("sql`(lower(hex(randomblob(16))))`").primaryKey().notNull(),
	on: text().notNull().references(() => fruit.id),
	at: text().default("sql`(datetime('now'))`").notNull(),
},
(table) => [
	index("click_idx").on(table.on, table.at),
]);

