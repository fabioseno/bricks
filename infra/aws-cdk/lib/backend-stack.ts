import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ConfigConstruct } from './constructs/config.construct';
import { EmailConstruct } from './constructs/email.construct';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ConfigConstruct(this, 'config-construct');
    new EmailConstruct(this, 'email-construct');

  }
}
