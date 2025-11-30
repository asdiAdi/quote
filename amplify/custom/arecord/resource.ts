import { Construct } from "constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { DomainName } from "aws-cdk-lib/aws-apigatewayv2";
import { aws_route53, aws_route53_targets } from "aws-cdk-lib";

type CustomARecordProps = {
  cert_arn: string;
  subdomain: string;
  domain: string;
  hosted_zone_id: string;
};

export class CustomARecord extends Construct {
  public readonly domainName: DomainName;

  constructor(scope: Construct, id: string, props: CustomARecordProps) {
    super(scope, id);

    const { cert_arn, subdomain, domain, hosted_zone_id } = props;

    // get ssl cert
    const certificate = Certificate.fromCertificateArn(
      this,
      "ApiCert",
      cert_arn,
    );

    // create domain name
    this.domainName = new DomainName(this, "ApiName", {
      domainName: `${subdomain}.${domain}`,
      certificate: certificate,
    });

    // get hosted zone
    const hostedZone = aws_route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      {
        hostedZoneId: hosted_zone_id,
        zoneName: domain,
      },
    );

    // route arecord to domain name
    new aws_route53.ARecord(this, "ApiARecord", {
      zone: hostedZone,
      recordName: subdomain,
      target: aws_route53.RecordTarget.fromAlias(
        new aws_route53_targets.ApiGatewayv2DomainProperties(
          this.domainName.regionalDomainName,
          this.domainName.regionalHostedZoneId,
        ),
      ),
    });
  }
}
