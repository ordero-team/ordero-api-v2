import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderCustomer1719251773021 implements MigrationInterface {
  name = 'OrderCustomer1719251773021';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`order\` ADD \`customer_name\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`order\` ADD \`customer_phone\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`customer_phone\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`customer_name\``);
  }
}
