import { Connection, createConnection } from 'typeorm';
import {Address, Qualification, User} from "../../../common/help-on-spot-models/src";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import { ormConfig } from "./ormConfig";

export class Database {
  private connection?: Connection;

  public async connect() {
    try {
      this.connection = await createConnection({
        ...ormConfig,
        entities: [User, Address, Qualification],
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
