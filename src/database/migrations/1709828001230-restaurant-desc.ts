import { MigrationInterface, QueryRunner } from 'typeorm';

export class restaurantDesc1709828001230 implements MigrationInterface {
  name = 'restaurantDesc1709828001230';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`restaurant\` ADD \`description\` longtext NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`restaurant\` DROP COLUMN \`description\``);
  }
}
