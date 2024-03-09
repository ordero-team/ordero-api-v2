import { MigrationInterface, QueryRunner } from 'typeorm';

export class restaurantImage1710002572201 implements MigrationInterface {
  name = 'restaurantImage1710002572201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`restaurant\` ADD \`logo_url\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`restaurant\` ADD \`banner_url\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`restaurant\` DROP COLUMN \`banner_url\``);
    await queryRunner.query(`ALTER TABLE \`restaurant\` DROP COLUMN \`logo_url\``);
  }
}
