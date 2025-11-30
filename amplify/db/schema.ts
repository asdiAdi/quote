import { pgTable, pgPolicy, text, foreignKey, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const authors = pgTable("authors", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	link: text().notNull(),
	bio: text().notNull(),
	description: text().notNull(),
}, (table) => [
	pgPolicy("read_access_policy", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const tags = pgTable("tags", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
}, (table) => [
	pgPolicy("read_access_policy", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const quotes = pgTable("quotes", {
	id: text().primaryKey().notNull(),
	content: text().notNull(),
	author: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.author],
			foreignColumns: [authors.id],
			name: "quotes_author_fkey"
		}),
	pgPolicy("read_access_policy", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const quotesTags = pgTable("quotes_tags", {
	quoteId: text("quote_id").notNull(),
	tagId: text("tag_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.quoteId],
			foreignColumns: [quotes.id],
			name: "quotes_tags_quote_id_fkey"
		}),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tags.id],
			name: "quotes_tags_tag_id_fkey"
		}),
	primaryKey({ columns: [table.quoteId, table.tagId], name: "quotes_tags_pkey"}),
	pgPolicy("read_access_policy", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);
