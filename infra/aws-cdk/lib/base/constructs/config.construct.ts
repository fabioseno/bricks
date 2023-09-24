// import * as ssm from 'aws-cdk-lib/aws-ssm';
// import { Construct } from "constructs";
// import { configValues } from '../config/dev.config';

// export class ConfigConstruct extends Construct {
//   constructor(scope: Construct, id: string) {
//     super(scope, id);

//     configValues.forEach(configValue => {
//       new ssm.StringParameter(this, configValue.cdkId, configValue);
//     });

//   }
// }