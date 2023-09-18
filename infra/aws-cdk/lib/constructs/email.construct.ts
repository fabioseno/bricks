import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from "constructs";

export class EmailConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const emailDlQueue = new sqs.Queue(this, 'email-queue-dlq', {
      visibilityTimeout: cdk.Duration.seconds(300),
      queueName: 'email-queue-dlq'
    });

    const emailQueue = new sqs.Queue(this, 'email-queue', {
      visibilityTimeout: cdk.Duration.seconds(300),
      queueName: 'email-queue',
      deadLetterQueue: {
        maxReceiveCount: 4,
        queue: emailDlQueue
      }
    });

    const sendEmailLambda = new lambda.Function(this, "send-email-lambda", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../../dist/apps/send-email-lambda'),
      functionName: 'send-email-lambda',
      environment: {
        smtpServer: '',
        smtpPort: '123',
        userName: '',
        userPassword: ''
      }
    });

    sendEmailLambda.addEventSource(new lambdaEventSources.SqsEventSource(emailQueue, {
      batchSize: 1
    }));
  }
}