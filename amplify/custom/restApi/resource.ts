import { Construct } from "constructs";
import { aws_apigateway, aws_route53, aws_route53_targets } from "aws-cdk-lib";
import { ApiKey, Cors, IApiKey, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { ARecord, IHostedZone } from "aws-cdk-lib/aws-route53";

type CustomRestApiProps = {
  cert_arn: string;
  subdomain: string;
  domain: string;
  stage: string;
  hosted_zone_id: string;
};

export class CustomRestApi extends RestApi {
  public readonly hostedZone: IHostedZone;
  public readonly arecord: ARecord;
  public readonly apiKey: IApiKey;
  public readonly apiKeyValue: string;

  constructor(scope: Construct, id: string, props: CustomRestApiProps) {
    const { cert_arn, subdomain, domain, stage, hosted_zone_id } = props;

    // get certificate from arn
    const certificate = Certificate.fromCertificateArn(
      scope,
      "ApiCert",
      cert_arn,
    );

    // create the rest api with custom domain name
    super(scope, id, {
      restApiName: subdomain,
      deploy: true,
      deployOptions: {
        stageName: stage,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS, // Restrict this to domains you trust
        allowMethods: Cors.ALL_METHODS, // Specify only the methods you need to allow
        allowHeaders: Cors.DEFAULT_HEADERS, // Specify only the headers you need to allow
      },
      disableExecuteApiEndpoint: true,
      domainName: {
        domainName: `${subdomain}.${domain}`,
        certificate: certificate,
      },
    });

    // public api value so I can encapsulate all users in a single limit
    this.apiKeyValue = `${stage}K7WWeH7MxXXb4f7j76chxR3ukwsj2g6TV6HQ`;

    // set limits
    // create public api key
    this.apiKey = new ApiKey(scope, "public-api-key", {
      apiKeyName: `${subdomain}-api-key`,
      stages: [this.deploymentStage],
      description: "free api key for public consumption",
      value: this.apiKeyValue,
    });

    // create usage plan with limits
    const usagePlan = this.addUsagePlan("usage-plan", {
      name: `${subdomain}-usage-plan`,
      description: "Public usage plan with basic rate limits",
      throttle: {
        rateLimit: 5,
        burstLimit: 10,
      },
      quota: {
        limit: 100,
        period: aws_apigateway.Period.DAY,
      },
    });

    // apply to current stage and puclic api key
    usagePlan.addApiKey(this.apiKey);
    usagePlan.addApiStage({ stage: this.deploymentStage });

    // get hosted zone
    this.hostedZone = aws_route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      {
        hostedZoneId: hosted_zone_id,
        zoneName: domain,
      },
    );

    // create the arecord for the subdomain
    this.arecord = new aws_route53.ARecord(this, "ApiARecord", {
      zone: this.hostedZone,
      recordName: subdomain,
      target: aws_route53.RecordTarget.fromAlias(
        new aws_route53_targets.ApiGateway(this),
      ),
    });
  }
}
