import { MigrationInterface, QueryRunner } from 'typeorm';

export class ownerVariant1707314604838 implements MigrationInterface {
  name = 'ownerVariant1707314604838';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`variant\` ADD \`restaurant_id\` varchar(26) NULL`);
    await queryRunner.query(`ALTER TABLE \`product_variant\` ADD \`price\` decimal(16,2) NULL DEFAULT '0.00'`);
    await queryRunner.query(`ALTER TABLE \`product\` ADD \`sku\` varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`media\` ADD \`mime_type\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`variant\` ADD CONSTRAINT \`FK_39a7b01023784ab1597084361b0\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`variant\` DROP FOREIGN KEY \`FK_39a7b01023784ab1597084361b0\``);
    await queryRunner.query(`ALTER TABLE \`media\` DROP COLUMN \`mime_type\``);
    await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`sku\``);
    await queryRunner.query(`ALTER TABLE \`product_variant\` DROP COLUMN \`price\``);
    await queryRunner.query(`ALTER TABLE \`variant\` DROP COLUMN \`restaurant_id\``);
  }
}
