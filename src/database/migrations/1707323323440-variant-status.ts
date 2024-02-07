import { MigrationInterface, QueryRunner } from 'typeorm';

export class variantStatus1707323323440 implements MigrationInterface {
  name = 'variantStatus1707323323440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`variant\` ADD \`status\` varchar(255) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`variant\` DROP COLUMN \`status\``);
  }
}
