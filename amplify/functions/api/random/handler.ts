import { env } from "$amplify/env/api-tags";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { authors, quotes, quotesTags, tags } from "../../../db/schema";
import { and, eq, gte, lte, or, sql } from "drizzle-orm";
import { APIGatewayProxyHandler } from "aws-lambda/trigger/api-gateway-proxy";

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("event", event);

  const { queryStringParameters, multiValueQueryStringParameters } = event;

  const limit = parseInt(queryStringParameters?.limit ?? "1");
  const minLength = parseInt(queryStringParameters?.minLength ?? "1");
  const maxLength = parseInt(queryStringParameters?.maxLength ?? "10000");
  const tagsParam = multiValueQueryStringParameters?.tags ?? [];
  const author = queryStringParameters?.author;

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
    .where(
      and(
        gte(sql<number>`LENGTH(${quotes.content})`, minLength),
        lte(sql<number>`LENGTH(${quotes.content})`, maxLength),
        tagsParam.length > 0
          ? or(...tagsParam.map((tag) => eq(tags.name, tag)))
          : undefined,
        author ? eq(authors.name, author ?? authors.name) : undefined,
      ),
    )
    .groupBy(quotes.id, authors.id)
    .orderBy(sql`RANDOM()`)
    .limit(limit);

  return {
    statusCode: 200,
    // Modify the CORS settings below to match your specific requirements
    headers: {
      "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
      "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
    },
    body: JSON.stringify(matchedList),
  };
};
