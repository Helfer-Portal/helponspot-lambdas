import { Connection, createConnection } from 'typeorm';
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import { ormConfig } from "./ormConfig";
import User from "./User";

export class Database {
  private connection?: Connection;

  public async connect() {
    try {
      this.connection = await createConnection({
        ...ormConfig,
        entities: [User],
        migrations: [],
        schema: 'public',
        type: 'postgres',
        synchronize: true,
      } as PostgresConnectionOptions);
    } catch (e) {
      console.log(e);
    }

    return this.connection;
  }

  public async disconnect() {
    if (this.connection) {
      await this.connection.close();
    } else {
      console.log(
        'Trying to disconnect from the DB, but apparently there is no connection.',
      );
    }
  }
}
