import { MigrationInterface, QueryRunner } from 'typeorm';

export class LocationAddress1726760246672 implements MigrationInterface {
  name = 'LocationAddress1726760246672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`location\` ADD \`address\` longtext NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`location\` DROP COLUMN \`address\``);
  }
}
