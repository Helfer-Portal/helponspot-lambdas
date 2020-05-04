import { MigrationInterface, QueryRunner } from 'typeorm'
import {qualifications} from "../utils/qualificationsData";

export class QualificationsMigration1586981133000 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        qualifications.map((qualification) =>
            queryRunner.query(
                `INSERT INTO qualification (key, name, category) VALUES ('${qualification.key}', '${qualification.name}', '${qualification.category}');`
            )
        )
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        qualifications.map((qualification) =>
            queryRunner.query(`DELETE FROM qualification WHERE key = ${qualification.key};`)
        )
    }
}
