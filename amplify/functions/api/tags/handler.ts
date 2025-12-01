import { APIGatewayProxyHandler } from "aws-lambda/trigger/api-gateway-proxy";
import { env } from "$amplify/env/api-tags";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { quotesTags, tags } from "../../../db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("event", event);

  const { queryStringParameters } = event;

  let body;

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(env.SUPABASE_URL, { prepare: false });
  const db = drizzle({ client });

  const sortBy = queryStringParameters?.sort;
  const order = queryStringParameters?.order;

  if (queryStringParameters) {
    if (sortBy === "quoteCount") {
      body = await db
        .select({
          id: tags.id,
          name: tags.name,
          count: sql<number>`COUNT(${quotesTags.quoteId})`,
        })
        .from(tags)
        .leftJoin(quotesTags, eq(tags.id, quotesTags.tagId))
        .groupBy(tags.id)
        .orderBy(
          order === "desc"
            ? desc(sql<number>`COUNT(${quotesTags.quoteId})`)
            : asc(sql<number>`COUNT(${quotesTags.quoteId})`),
        );
    } else {
      body = await db
        .select()
        .from(tags)
        .orderBy(order === "desc" ? desc(tags.name) : asc(tags.name));
    }
  } else {
    // default
    body = await db.select().from(tags).orderBy(asc(tags.name));
  }

  return {
    statusCode: 200,
    // Modify the CORS settings below to match your specific requirements
    headers: {
      "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
      "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
    },
    body: JSON.stringify(body),
  };
};
