import { relations } from "drizzle-orm/relations";
import { authors, quotes, quotesTags, tags } from "./schema";

export const quotesRelations = relations(quotes, ({one, many}) => ({
	author: one(authors, {
		fields: [quotes.author],
		references: [authors.id]
	}),
	quotesTags: many(quotesTags),
}));

export const authorsRelations = relations(authors, ({many}) => ({
	quotes: many(quotes),
}));

export const quotesTagsRelations = relations(quotesTags, ({one}) => ({
	quote: one(quotes, {
		fields: [quotesTags.quoteId],
		references: [quotes.id]
	}),
	tag: one(tags, {
		fields: [quotesTags.tagId],
		references: [tags.id]
	}),
}));

export const tagsRelations = relations(tags, ({many}) => ({
	quotesTags: many(quotesTags),
}));