import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EmailConstruct } from './constructs/email.construct';

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new EmailConstruct(this, 'email-construct', props);

  }
}
