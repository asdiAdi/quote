import { APIGatewayProxyHandler } from "aws-lambda/trigger/api-gateway-proxy";
import { env } from "$amplify/env/api-tags";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { authors, quotes, quotesTags, tags } from "../../../db/schema";
import { eq, sql } from "drizzle-orm";

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("event", event);

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(env.SUPABASE_URL, { prepare: false });
  const db = drizzle({ client });

  // total count of quotes
  const count = 2127;

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // number of days since jan 1 1970
  const numDays = Math.round(Date.now() / day);

  const index = numDays - count * Math.floor(numDays / count);

  const response = await db
    .select({
      id: quotes.id,
      content: quotes.content,
      author: authors.name,
      length: sql<number>`LENGTH(${quotes.content})`,
      tags: sql<string[]>`ARRAY_AGG(${tags.name} ORDER BY ${tags.name} ASC)`,
    })
    .from(quotes)
    .leftJoin(authors, eq(quotes.author, authors.id))
    .leftJoin(quotesTags, eq(quotes.id, quotesTags.quoteId))
    .leftJoin(tags, eq(tags.id, quotesTags.tagId))
    .groupBy(quotes.id, authors.id)
    .orderBy(quotes.id)
    .limit(1)
    .offset(index);

  const quoteOfTheDay = response[0];

  return {
    statusCode: 200,
    // Modify the CORS settings below to match your specific requirements
    headers: {
      "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
      "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
    },
    body: JSON.stringify(quoteOfTheDay),
  };
};
