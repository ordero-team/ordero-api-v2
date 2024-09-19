import { MigrationInterface, QueryRunner } from 'typeorm';

export class RestaurantNullDesc1725985883987 implements MigrationInterface {
  name = 'RestaurantNullDesc1725985883987';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`description\` \`description\` longtext NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`restaurant\` CHANGE \`description\` \`description\` longtext NOT NULL`);
  }
}
