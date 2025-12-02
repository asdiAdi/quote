import { get } from "aws-amplify/api";

export default async function getTag() {
  try {
    const restOperation = get({
      apiName: import.meta.env.VITE_SUBDOMAIN,
      path: "tags",
    });

    const { body } = await restOperation.response;
    const json = await body.json();
    console.log(json);
  } catch (error) {
    console.log("GET call failed: ", error);
  }
}
