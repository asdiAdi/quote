import { get } from "aws-amplify/api";

export default async function getTag() {
  try {
    const restOperation = get({
      apiName: process.env.SUBDOMAIN as string,
      path: "tags",
    });

    const { body } = await restOperation.response;
    const json = await body.json();
    console.log(json);
  } catch (error) {
    console.log("GET call failed: ", error);
  }
}
