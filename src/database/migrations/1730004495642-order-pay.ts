import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderPay1730004495642 implements MigrationInterface {
  name = 'OrderPay1730004495642';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`order\` ADD \`pay_amount\` decimal(16,2) NULL DEFAULT '0.00'`);
    await queryRunner.query(`ALTER TABLE \`order\` ADD \`change_amount\` decimal(16,2) NULL DEFAULT '0.00'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`change_amount\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`pay_amount\``);
  }
}
