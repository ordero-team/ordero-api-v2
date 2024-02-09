import { MigrationInterface, QueryRunner } from 'typeorm';

export class productHistory1707415496168 implements MigrationInterface {
  name = 'productHistory1707415496168';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`product_history\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`action\` varchar(255) NULL, \`data\` json NULL, \`product_id\` varchar(26) NULL, \`location_id\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(`ALTER TABLE \`product_stock\` ADD \`product_id\` varchar(26) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`product_stock\` ADD CONSTRAINT \`FK_62a8438c36b1a42790d3cd755a1\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`product_history\` ADD CONSTRAINT \`FK_d0e845cfa7cb0c5f092ae9acab1\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`product_history\` ADD CONSTRAINT \`FK_3125f8ec9c86ddf197969f7fb39\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product_history\` DROP FOREIGN KEY \`FK_3125f8ec9c86ddf197969f7fb39\``);
    await queryRunner.query(`ALTER TABLE \`product_history\` DROP FOREIGN KEY \`FK_d0e845cfa7cb0c5f092ae9acab1\``);
    await queryRunner.query(`ALTER TABLE \`product_stock\` DROP FOREIGN KEY \`FK_62a8438c36b1a42790d3cd755a1\``);
    await queryRunner.query(`ALTER TABLE \`product_stock\` DROP COLUMN \`product_id\``);
    await queryRunner.query(`DROP TABLE \`product_history\``);
  }
}
