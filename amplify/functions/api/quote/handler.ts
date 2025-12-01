import { APIGatewayProxyHandler } from "aws-lambda/trigger/api-gateway-proxy";
import { env } from "$amplify/env/api-tags";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { authors, quotes, quotesTags, tags } from "../../../db/schema";
import { asc, eq, sql } from "drizzle-orm";

type QuotePathParams = {
  quoteId: string;
};

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("event", event);

  const { pathParameters } = event;
  const { quoteId } = pathParameters as QuotePathParams;

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(env.SUPABASE_URL, { prepare: false });
  const db = drizzle({ client });

  const matchedList = await db
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
    .having(eq(quotes.id, quoteId))
    .orderBy(asc(authors.name));

  let quote;

  if (matchedList[0] !== undefined) {
    quote = matchedList[0];
  } else {
    quote = "Not Found";
  }

  return {
    statusCode: 200,
    // Modify the CORS settings below to match your specific requirements
    headers: {
      "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
      "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
    },
    body: JSON.stringify(quote),
  };
};
