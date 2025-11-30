import dotenv from "dotenv";
import { defineBackend } from "@aws-amplify/backend";
import { CustomARecord } from "./custom/arecord/resource";
import { apiTags } from "./functions/api/tags/resource";
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Stack } from "aws-cdk-lib";

dotenv.config();
const CERT_ARN = process.env.CERT_ARN ?? "";
const HOSTED_ZONE_ID = process.env.HOSTED_ZONE_ID ?? "";
const SUBDOMAIN = process.env.SUBDOMAIN ?? "";
const backend = defineBackend({
  apiTags: apiTags,
});

// create a new API stack
const apiStack = backend.createStack("api-stack");

// create custom ARecord
const aRecord = new CustomARecord(apiStack, "ARecord", {
  cert_arn: CERT_ARN,
  subdomain: SUBDOMAIN,
  domain: "carladi.com",
  hosted_zone_id: HOSTED_ZONE_ID,
});

// create a new HTTP API with IAM as default authorizer
const httpApi = new HttpApi(apiStack, "HttpApi", {
  apiName: "myHttpApi",
  corsPreflight: {
    // Modify the CORS settings below to match your specific requirements
    allowMethods: [CorsHttpMethod.GET],
    // Restrict this to domains you trust
    allowOrigins: ["*"],
    // Specify only the headers you need to allow
    allowHeaders: ["*"],
  },
  defaultDomainMapping: {
    domainName: aRecord.domainName,
  },
  disableExecuteApiEndpoint: true,
  createDefaultStage: true,
});

// http lambda integration for each api
const apiTagsLambdaIntegration = new HttpLambdaIntegration(
  "apiTagsLambdaIntegration",
  backend.apiTags.resources.lambda,
);

// add a proxy resource path to the API
httpApi.addRoutes({
  path: "/tags",
  methods: [HttpMethod.GET],
  integration: apiTagsLambdaIntegration,
});

// add a proxy resource path to the API
httpApi.addRoutes({
  path: "/tags/{proxy+}",
  methods: [HttpMethod.GET],
  integration: apiTagsLambdaIntegration,
});

// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      REST: {
        [httpApi.httpApiName!]: {
          endpoint: `https://${aRecord.domainName.name}/`,
          region: Stack.of(httpApi).region,
        },
      },
    },
  },
});
