import dotenv from "dotenv";
import { defineBackend } from "@aws-amplify/backend";
import { apiTags } from "./functions/api/tags/resource";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Stack } from "aws-cdk-lib";
import { CustomRestApi } from "./custom/restApi/resource";
import { apiQuote } from "./functions/api/quote/resource";
import { apiRandom } from "./functions/api/random/resource";
import { apiDailyQuote } from "./functions/api/daily-quote/resource";

dotenv.config();
const STAGE = process.env.VITE_STAGE ?? "";
const CERT_ARN = process.env.VITE_CERT_ARN ?? "";
const HOSTED_ZONE_ID = process.env.VITE_HOSTED_ZONE_ID ?? "";
const SUBDOMAIN = process.env.VITE_SUBDOMAIN ?? "";
const DOMAIN = process.env.VITE_DOMAIN ?? "";
const backend = defineBackend({
  apiTags: apiTags,
  apiQuote: apiQuote,
  apiRandom: apiRandom,
  apiDailyQuote: apiDailyQuote,
});

// create a new API stack
const apiStack = backend.createStack("api-stack");

const restApi = new CustomRestApi(apiStack, "RestApi", {
  cert_arn: CERT_ARN,
  subdomain: SUBDOMAIN,
  domain: DOMAIN,
  stage: STAGE,
  hosted_zone_id: HOSTED_ZONE_ID,
});

//TODO: generate routes by config

// http lambda integration for each api
// tagLI short for "Tags Lambda Integration"
const tagsLI = new LambdaIntegration(backend.apiTags.resources.lambda);
// create a new resource path
const tagsPath = restApi.root.addResource("tags");
// add methods you would like to create to the resource path
tagsPath.addMethod("GET", tagsLI);
// add a proxy resource path to the API
// const tagsProxy = tagsPath.addProxy({
//   defaultIntegration: tagsLI,
// });
// tagsProxy.addMethod("GET", tagsLI);

const quoteLi = new LambdaIntegration(backend.apiQuote.resources.lambda);
const quotePath = restApi.root.addResource("quote").addResource("{quoteId}");
quotePath.addMethod("GET", quoteLi);

const randomLi = new LambdaIntegration(backend.apiRandom.resources.lambda);
const randomPath = restApi.root.addResource("random");
randomPath.addMethod("GET", randomLi);

const dailyQuoteLi = new LambdaIntegration(
  backend.apiDailyQuote.resources.lambda,
);
const dailyQuotePath = restApi.root.addResource("daily-quote");
dailyQuotePath.addMethod("GET", dailyQuoteLi);

// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      REST: {
        [restApi.restApiName!]: {
          endpoint: `https://${SUBDOMAIN}.${DOMAIN}/`,
          region: Stack.of(restApi).region,
        },
      },
    },
  },
});
