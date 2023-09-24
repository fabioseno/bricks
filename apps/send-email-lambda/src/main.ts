import { NestFactory } from '@nestjs/core';
import { SQSEvent } from 'aws-lambda';
import { AppModule } from './app/app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const globalPrefix = 'api';
//   app.setGlobalPrefix(globalPrefix);
//   const port = process.env.PORT || 3000;
//   await app.listen(port);
//   Logger.log(
//     `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
//   );
// }

// bootstrap();

exports.handler = async (event: SQSEvent) => {
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log(event.Records[0]);
  console.log(event.Records[0].body);
  const data = JSON.parse(event.Records[0].body);
  console.log(data.name);
}
