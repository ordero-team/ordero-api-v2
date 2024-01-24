import { MigrationInterface, QueryRunner } from 'typeorm';

export class ownerLocation1706111840738 implements MigrationInterface {
  name = 'ownerLocation1706111840738';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`owner\` ADD \`location_id\` varchar(26) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`owner\` ADD CONSTRAINT \`FK_71cfe28bf443954332aca78d9e1\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`owner\` DROP FOREIGN KEY \`FK_71cfe28bf443954332aca78d9e1\``);
    await queryRunner.query(`ALTER TABLE \`owner\` DROP COLUMN \`location_id\``);
  }
}
