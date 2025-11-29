import dotenv from "dotenv";
import { defineBackend } from "@aws-amplify/backend";
import { apiTags } from "./functions/api/tags/resource";
import {
  CorsHttpMethod,
  DomainName,
  HttpApi,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { aws_route53, aws_route53_targets, Stack } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

dotenv.config();
const CERT_ARN = process.env.CERT_ARN ?? "";
const HOSTED_ZONE_ID = process.env.HOSTED_ZONE_ID ?? "";
const SUBDOMAIN = process.env.SUBDOMAIN ?? "";

const backend = defineBackend({
  apiTags: apiTags,
});

// create a new API stack
const apiStack = backend.createStack("api-stack");

// get ssl cert
const certificate = Certificate.fromCertificateArn(
  apiStack,
  "ApiCert",
  CERT_ARN,
);

// create domain name
const apiName = new DomainName(apiStack, "ApiName", {
  domainName: `${SUBDOMAIN}.carladi.com`,
  certificate: certificate,
});

// get hosted zone
const hostedZone = aws_route53.HostedZone.fromHostedZoneAttributes(
  apiStack,
  "HostedZone",
  {
    hostedZoneId: HOSTED_ZONE_ID,
    zoneName: "carladi.com",
  },
);

// route arecord to domain name
new aws_route53.ARecord(apiName, "ApiAliasRecord", {
  zone: hostedZone,
  recordName: SUBDOMAIN,
  target: aws_route53.RecordTarget.fromAlias(
    new aws_route53_targets.ApiGatewayv2DomainProperties(
      apiName.regionalDomainName,
      apiName.regionalHostedZoneId,
    ),
  ),
});

// http lambda integration for each api
const apiTagsLambdaIntegration = new HttpLambdaIntegration(
  "apiTagsLambdaIntegration",
  backend.apiTags.resources.lambda,
);

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
    domainName: apiName,
  },
  createDefaultStage: true,
});

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
      [httpApi.httpApiName!]: {
        endpoint: httpApi.url,
        region: Stack.of(httpApi).region,
        apiName: httpApi.httpApiName,
      },
    },
  },
});
