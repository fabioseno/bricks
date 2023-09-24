import * as cdk from 'aws-cdk-lib';
import { Duration, SecretValue } from "aws-cdk-lib";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import { DatabaseInstance, DatabaseInstanceEngine, MysqlEngineVersion } from "aws-cdk-lib/aws-rds";
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from "constructs";
import { configValues } from '../../../config/config';

export class DatabaseConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const engine = DatabaseInstanceEngine.mysql({ version: MysqlEngineVersion.VER_5_7 });
    const instanceType = InstanceType.of(InstanceClass.T3, InstanceSize.MICRO);
    const port = 3306;
    const dbName = "bricks";

    // We know this VPC already exists
    const defaultVpc = Vpc.fromLookup(this, "default-vpc", { isDefault: true });

    // Create a Security Group
    const dbSg = new SecurityGroup(this, "aatabase-security-group", {
      securityGroupName: "bricks-db-sg",
      vpc: defaultVpc,
    });

    // Add Inbound rule
    dbSg.addIngressRule(
      Peer.ipv4(defaultVpc.vpcCidrBlock),
      Port.tcp(port),
      `Allow port ${port} for database connection from only within the VPC (${defaultVpc.vpcId})`
    );

    dbSg.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(port),
      `Allow port ${port} for database connection from any source`
    );

    const dbPort = ssm.StringParameter.valueForStringParameter(this, '/db/port');
    const dbUser = ssm.StringParameter.valueForStringParameter(this, '/db/user');
    const dbPassword = ssm.StringParameter.valueForStringParameter(this, '/db/password');

    // create RDS instance (MySQL)
    const dbInstance = new DatabaseInstance(this, "bricks-db", {
      instanceIdentifier: configValues.database.instanceName,
      vpc: defaultVpc,
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
      instanceType,
      engine,
      port: cdk.Token.asNumber(dbPort),
      securityGroups: [dbSg],
      databaseName: dbName,
      credentials: { username: dbUser, password: SecretValue.unsafePlainText(dbPassword) },
      backupRetention: Duration.days(0), // disable automatic DB snapshot retention
      deleteAutomatedBackups: true,
      //removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}