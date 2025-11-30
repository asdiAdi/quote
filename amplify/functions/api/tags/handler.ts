import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { env } from "$amplify/env/api-tags";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { tags } from "../../../db/schema";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log("event", event);

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(env.SUPABASE_URL, { prepare: false });
  const db = drizzle({ client });
  const tagsList = await db.select().from(tags);

  return {
    statusCode: 200,
    // Modify the CORS settings below to match your specific requirements
    headers: {
      "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
      "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
    },
    body: JSON.stringify(tagsList),
  };
};
