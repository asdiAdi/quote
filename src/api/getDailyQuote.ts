import { get } from "aws-amplify/api";
import outputs from "../../amplify_outputs.json";

export default async function getDailyQuote() {
  const { publicApiKey } = outputs.custom;

  try {
    const restOperation = get({
      apiName: import.meta.env.VITE_SUBDOMAIN,
      path: "daily-quote",
      options: {
        headers: {
          "X-API-Key": publicApiKey,
        },
      },
    });

    const { body } = await restOperation.response;

    return (await body.json()) as {
      id: string;
      content: string;
      author: string;
      length: number;
      tags: string[];
    };
  } catch (error) {
    console.log("GET call failed: ", error);
  }
}
