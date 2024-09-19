import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderOwner1726762144604 implements MigrationInterface {
  name = 'OrderOwner1726762144604';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`order\` ADD \`owner_id\` varchar(26) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_d9181c2d154dfb71af0e18d9669\` FOREIGN KEY (\`owner_id\`) REFERENCES \`owner\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_d9181c2d154dfb71af0e18d9669\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`owner_id\``);
  }
}
