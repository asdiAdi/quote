import { Construct } from "constructs";
import { aws_route53, aws_route53_targets } from "aws-cdk-lib";
import { Cors, RestApi } from "aws-cdk-lib/aws-apigateway";
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
      restApiName: "api-quotes",
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
