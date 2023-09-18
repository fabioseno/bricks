import * as ssm from 'aws-cdk-lib/aws-ssm';

class ConfigEntry {
  constructor(
    readonly cdkId: string,
    readonly parameterName: string,
    readonly stringValue: string,
    readonly description?: string,
    readonly dataType: ssm.ParameterDataType = ssm.ParameterDataType.TEXT,
    readonly tier: ssm.ParameterTier = ssm.ParameterTier.STANDARD,
    readonly allowedPattern: string = '.*'
  ) { }
}

export const configValues = [
  new ConfigEntry('config-email-host', '/email/host', 'smtp.bla.com.br'),
  new ConfigEntry('config-email-port', '/email/port', '465'),
  new ConfigEntry('config-email-username', '/email/username', 'email'),
  new ConfigEntry('config-email-password', '/email/password', 'password')
]