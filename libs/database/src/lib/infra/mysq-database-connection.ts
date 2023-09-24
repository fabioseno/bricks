import { DatabaseConnection } from "./database-connection";
const mysql = require('mysql2');

export class MySqlDatabaseConnection extends DatabaseConnection {

  private pool;

  constructor() {
    super();
    this.pool = mysql.createPool({
      // user: this.config.database.user,
      // password: this.config.database.password,
      // host: this.config.database.host,
      // port: this.config.database.port,
      // database: this.config.database.database,
      // connectionLimit: this.config.database.connectionLimit,
      // typeCast: function (field, next) {
      //   if (field.type.indexOf("DECIMAL") >= 0) {
      //     var value = field.string();
      //     return (value === null) ? null : Number(value);
      //   }
      //   return next();
      // }
    });
    console.log('[DATABASE] Pool created', new Date());
  }

  override getConnection(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection(function (err: any, conn: any) {
        if (err) {
          return reject(err);
        }

        return resolve(conn);
      });
    });
  }

  override releaseConnection(connection: any): void {
    this.pool.releaseConnection(connection);
  }

  override async query<T>(query: string): Promise<any> {
    return;
  }

}