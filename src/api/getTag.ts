import { get } from "aws-amplify/api";

export default async function getTag() {
  try {
    const restOperation = get({
      apiName: "myHttpApi",
      path: "tags",
      options: {
        retryStrategy: {
          strategy: "no-retry", // Overrides default retry strategy
        },
        body: {
          test: "testbody",
        },
      },
    });

    const { body } = await restOperation.response;
    const json = await body.json();
    console.log(json);
  } catch (error) {
    // console.log("failed");
    console.log("GET call failed: ", JSON.stringify(error));
  }
}
