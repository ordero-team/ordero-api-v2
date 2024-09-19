import { MigrationInterface, QueryRunner } from 'typeorm';

export class HistoryActor1726768379070 implements MigrationInterface {
  name = 'HistoryActor1726768379070';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product_history\` ADD \`actor\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product_history\` DROP COLUMN \`actor\``);
  }
}
