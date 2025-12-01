import { Construct } from "constructs";
import { aws_route53, aws_route53_targets } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";

type CustomARecordProps = {
  subdomain: string;
  domain: string;
  hosted_zone_id: string;
  domain_name: RestApi;
};

export class CustomARecord extends Construct {
  constructor(scope: Construct, id: string, props: CustomARecordProps) {
    super(scope, id);

    const { subdomain, domain, hosted_zone_id, domain_name } = props;

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
        new aws_route53_targets.ApiGateway(domain_name),
      ),
    });
  }
}
