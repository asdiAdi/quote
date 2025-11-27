import { type ClientSchema, defineData } from "@aws-amplify/backend";

import { schema as generatedSqlSchema } from "./schema.sql";

// Add a global authorization rule
const sqlSchema = generatedSqlSchema;

export type Schema = ClientSchema<typeof sqlSchema>;

export const data = defineData({
  schema: sqlSchema,
});
