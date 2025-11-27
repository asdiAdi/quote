import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { env } from "$amplify/env/api-function";
// import { createClient } from "@supabase/supabase-js";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log("event", event);

  try {
    const SUPABASE_URL = env.SUPABASE_URL;
    // const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_KEY;

    // const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    // const { data } = await supabase.from("authors").select("*");

    return {
      statusCode: 200,
      // Modify the CORS settings below to match your specific requirements
      headers: {
        "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
        "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
      },
      body: "test",
      // body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      // Modify the CORS settings below to match your specific requirements
      headers: {
        "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
        "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
      },
      body: JSON.stringify(error),
    };
  }
};
