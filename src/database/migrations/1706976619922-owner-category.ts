import { MigrationInterface, QueryRunner } from 'typeorm';

export class ownerCategory1706976619922 implements MigrationInterface {
  name = 'ownerCategory1706976619922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`category\` ADD \`restaurant_id\` varchar(26) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD CONSTRAINT \`FK_48be827a112f05347b53cbc330b\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_48be827a112f05347b53cbc330b\``);
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`restaurant_id\``);
  }
}
