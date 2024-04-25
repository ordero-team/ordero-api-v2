import { MigrationInterface, QueryRunner } from 'typeorm';

export class cuistomerNoPassword1713801385496 implements MigrationInterface {
  name = 'cuistomerNoPassword1713801385496';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customer\` CHANGE \`password\` \`password\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customer\` CHANGE \`password\` \`password\` varchar(255) NOT NULL`);
  }
}
