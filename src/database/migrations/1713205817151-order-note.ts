import { MigrationInterface, QueryRunner } from 'typeorm';

export class orderNote1713205817151 implements MigrationInterface {
  name = 'orderNote1713205817151';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`order\` ADD \`note\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`note\``);
  }
}
