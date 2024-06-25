import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationRead1719334195161 implements MigrationInterface {
  name = 'NotificationRead1719334195161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`notification\` ADD \`is_read\` tinyint NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`notification\` DROP COLUMN \`is_read\``);
  }
}
