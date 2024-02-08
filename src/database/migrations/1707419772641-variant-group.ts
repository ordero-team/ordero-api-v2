import { MigrationInterface, QueryRunner } from 'typeorm';

export class variantGroup1707419772641 implements MigrationInterface {
  name = 'variantGroup1707419772641';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`variant_group\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`required\` tinyint NULL DEFAULT '0', \`restaurant_id\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(`ALTER TABLE \`variant\` ADD \`group_id\` varchar(26) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`variant_group\` ADD CONSTRAINT \`FK_4043e36c1e7363c875a6e173f66\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`variant\` ADD CONSTRAINT \`FK_f61c9451fd3301da9586232597a\` FOREIGN KEY (\`group_id\`) REFERENCES \`variant_group\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`variant\` DROP FOREIGN KEY \`FK_f61c9451fd3301da9586232597a\``);
    await queryRunner.query(`ALTER TABLE \`variant_group\` DROP FOREIGN KEY \`FK_4043e36c1e7363c875a6e173f66\``);
    await queryRunner.query(`ALTER TABLE \`variant\` DROP COLUMN \`group_id\``);
    await queryRunner.query(`DROP TABLE \`variant_group\``);
  }
}
