import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
// import { env } from "$amplify/env/api-tags";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log("event", event);

  return {
    statusCode: 200,
    // Modify the CORS settings below to match your specific requirements
    headers: {
      "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
      "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
    },
    body: "Hello from tags",
  };
};
