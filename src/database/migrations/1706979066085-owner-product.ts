import { MigrationInterface, QueryRunner } from 'typeorm';

export class ownerProduct1706979066085 implements MigrationInterface {
  name = 'ownerProduct1706979066085';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product\` ADD \`restaurant_id\` varchar(26) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD CONSTRAINT \`FK_71aea1d530c0b4920a8ca0e6a23\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_71aea1d530c0b4920a8ca0e6a23\``);
    await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`restaurant_id\``);
  }
}
