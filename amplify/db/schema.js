"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quotesTags = exports.quotes = exports.tags = exports.authors = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_orm_1 = require("drizzle-orm");
exports.authors = (0, pg_core_1.pgTable)("authors", {
    id: (0, pg_core_1.text)().primaryKey().notNull(),
    name: (0, pg_core_1.text)().notNull(),
    link: (0, pg_core_1.text)().notNull(),
    bio: (0, pg_core_1.text)().notNull(),
    description: (0, pg_core_1.text)().notNull(),
}, function (table) { return [
    (0, pg_core_1.pgPolicy)("read_access_policy", { as: "permissive", for: "select", to: ["public"], using: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["true"], ["true"]))) }),
]; });
exports.tags = (0, pg_core_1.pgTable)("tags", {
    id: (0, pg_core_1.text)().primaryKey().notNull(),
    name: (0, pg_core_1.text)().notNull(),
}, function (table) { return [
    (0, pg_core_1.pgPolicy)("read_access_policy", { as: "permissive", for: "select", to: ["public"], using: (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["true"], ["true"]))) }),
]; });
exports.quotes = (0, pg_core_1.pgTable)("quotes", {
    id: (0, pg_core_1.text)().primaryKey().notNull(),
    content: (0, pg_core_1.text)().notNull(),
    author: (0, pg_core_1.text)().notNull(),
}, function (table) { return [
    (0, pg_core_1.foreignKey)({
        columns: [table.author],
        foreignColumns: [exports.authors.id],
        name: "quotes_author_fkey"
    }),
    (0, pg_core_1.pgPolicy)("read_access_policy", { as: "permissive", for: "select", to: ["public"], using: (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["true"], ["true"]))) }),
]; });
exports.quotesTags = (0, pg_core_1.pgTable)("quotes_tags", {
    quoteId: (0, pg_core_1.text)("quote_id").notNull(),
    tagId: (0, pg_core_1.text)("tag_id").notNull(),
}, function (table) { return [
    (0, pg_core_1.foreignKey)({
        columns: [table.quoteId],
        foreignColumns: [exports.quotes.id],
        name: "quotes_tags_quote_id_fkey"
    }),
    (0, pg_core_1.foreignKey)({
        columns: [table.tagId],
        foreignColumns: [exports.tags.id],
        name: "quotes_tags_tag_id_fkey"
    }),
    (0, pg_core_1.primaryKey)({ columns: [table.quoteId, table.tagId], name: "quotes_tags_pkey" }),
    (0, pg_core_1.pgPolicy)("read_access_policy", { as: "permissive", for: "select", to: ["public"], using: (0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["true"], ["true"]))) }),
]; });
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
