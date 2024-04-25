import { MigrationInterface, QueryRunner } from 'typeorm';

export class productVariantRestaurant1712495303155 implements MigrationInterface {
  name = 'productVariantRestaurant1712495303155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product_variant\` ADD \`restaurant_id\` varchar(26) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`product_variant\` ADD CONSTRAINT \`FK_79191904b1f06c35e0caa99c873\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product_variant\` DROP FOREIGN KEY \`FK_79191904b1f06c35e0caa99c873\``);
    await queryRunner.query(`ALTER TABLE \`product_variant\` DROP COLUMN \`restaurant_id\``);
  }
}
