import { MigrationInterface, QueryRunner } from 'typeorm';

export class newMedia1707326585825 implements MigrationInterface {
  name = 'newMedia1707326585825';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`media\` ADD \`file\` json NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`media\` DROP COLUMN \`file\``);
  }
}
