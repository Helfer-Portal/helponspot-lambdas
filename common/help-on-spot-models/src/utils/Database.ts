import { Connection, ConnectionManager, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm'
import {ormConfig} from "../ormConfig";
import User from "../entity/User";
import Qualification from "../entity/Qualification";
import Organisation from "../entity/Organisation";
import Address from "../entity/Address";
import Request from "../entity/Request";
import RequestResponse from "../entity/RequestResponse";
import {QualificationsMigration1586981133000} from "../migration/qualificationsMigration";

export class Database {
  private connectionManager: ConnectionManager

  constructor() {
    this.connectionManager = getConnectionManager()
  }

  public async getConnection(): Promise<Connection> {
    const CONNECTION_NAME = `default`

    let connection: Connection

    if (this.connectionManager.has(CONNECTION_NAME)) {
      console.info(`Database.getConnection()-using existing connection ...`)
      connection = await this.connectionManager.get(CONNECTION_NAME)

      if (!connection.isConnected) {
        connection = await connection.connect()
      }
    }
    else {
      console.log(`Database.getConnection()-creating connection ...`)

      const connectionOptions: ConnectionOptions = {
        ...ormConfig,
        name: `default`,
        type: `postgres`,
        synchronize: true,
        entities: [User, Qualification, Organisation, Address, Request, RequestResponse],
        migrations: [ QualificationsMigration1586981133000 ],
      }
      connection = await createConnection(connectionOptions)
      const migrations = await connection.runMigrations();
      migrations.forEach((migration) => {
        console.log('Executed migration', migration);
      });
    }

    return connection
  }

  public async disconnect(connection: Connection) {
    if (connection) {
      await connection.close();
    } else {
      console.log(
        'Trying to disconnect from the DB, but apparently there is no connection.',
      );
    }
  }
}
