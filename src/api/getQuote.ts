import { get } from "aws-amplify/api";

export default async function getQuote() {
  try {
    const restOperation = get({
      apiName: "myHttpApi",
      path: "items",
      options: {
        retryStrategy: {
          strategy: "no-retry", // Overrides default retry strategy
        },
      },
    });
    const { body } = await restOperation.response;
    const json = await body.json();
    console.log(json);
  } catch (error) {
    console.log("failed");
    // console.log("GET call failed: ", JSON.parse(error.response.body));
  }
}
