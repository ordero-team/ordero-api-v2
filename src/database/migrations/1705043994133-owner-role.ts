import { MigrationInterface, QueryRunner } from 'typeorm';

export class ownerRole1705043994133 implements MigrationInterface {
  name = 'ownerRole1705043994133';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`owner\` ADD \`role_slug\` varchar(26) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`owner\` ADD CONSTRAINT \`FK_d4f7a89d41ee1d46815b56ce001\` FOREIGN KEY (\`role_slug\`) REFERENCES \`role\`(\`slug\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`owner\` DROP FOREIGN KEY \`FK_d4f7a89d41ee1d46815b56ce001\``);
    await queryRunner.query(`ALTER TABLE \`owner\` DROP COLUMN \`role_slug\``);
  }
}
