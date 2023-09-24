export abstract class DatabaseConnection {

  abstract getConnection(): Promise<any>;

  abstract releaseConnection(connection: any): void;

  abstract query<T>(query: string): Promise<any>;

}