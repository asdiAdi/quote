import { get } from "aws-amplify/api";

export default async function getDailyQuote() {
  try {
    const restOperation = get({
      apiName: import.meta.env.VITE_SUBDOMAIN,
      path: "daily-quote",
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
