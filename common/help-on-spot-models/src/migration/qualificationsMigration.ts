import {MigrationInterface, QueryRunner} from "typeorm";
import {qualificationMock} from "../utils/qualificationsMock";

export class QualificationsMigration1586981133000 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<void> {
    qualificationMock.map(qualification => queryRunner.query(
      `INSERT INTO qualification (key, name) VALUES ('${qualification.key}', '${qualification.name}');`
    ));
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    qualificationMock.map(qualification => queryRunner.query(
      `DELETE FROM qualification WHERE key = ${qualification.key};`
    ));
  }
}
