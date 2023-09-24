import { Global, Module } from '@nestjs/common';
import { DatabaseConnection } from './infra/database-connection';
import { MySqlDatabaseConnection } from './infra/mysq-database-connection';

@Global()
@Module({
  providers: [
    {
      provide: DatabaseConnection,
      useClass: MySqlDatabaseConnection
    }
  ],
  exports: [DatabaseConnection],
})
export class DatabaseModule { }
