import { Connection, createConnection } from 'typeorm';
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import User from "../entity/User";
import Address from "../entity/Address";
import Qualification from "../entity/Qualification";
import Organisation from "../entity/Organisation";
import Request from "../entity/Request";
import RequestResponse from "../entity/RequestResponse";
import {ormConfig} from "../ormConfig";

export class Database {
  private connection?: Connection;

  public async connect() {
    try {
      this.connection = await createConnection({
        ...ormConfig,
        entities: [User, Address, Qualification, Organisation, Request, RequestResponse],
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
