import { MigrationInterface, QueryRunner } from 'typeorm';

export class order1703753988002 implements MigrationInterface {
  name = 'order1703753988002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`table\` DROP FOREIGN KEY \`FK_1e79a861b6be1078a6b79e48ff9\``);
    await queryRunner.query(`ALTER TABLE \`table\` DROP FOREIGN KEY \`FK_330a81f831c235c5511b9f52b0e\``);
    await queryRunner.query(`ALTER TABLE \`location\` DROP FOREIGN KEY \`FK_c7e64d6441826d1c8f8edb1ecc4\``);
    await queryRunner.query(
      `CREATE TABLE \`order_product\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`order_id\` varchar(26) NULL, \`product_variant_id\` varchar(26) NULL, \`qty\` int NOT NULL DEFAULT '0', \`price\` decimal(16,2) NULL DEFAULT '0.00', \`status\` varchar(25) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`order\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`uid\` bigint NOT NULL AUTO_INCREMENT, \`number\` varchar(50) NOT NULL, \`gross_total\` decimal(16,2) NULL DEFAULT '0.00', \`discount\` decimal(16,2) NULL DEFAULT '0.00', \`net_total\` decimal(16,2) NULL DEFAULT '0.00', \`billed_at\` datetime NULL, \`status\` varchar(25) NOT NULL, \`customer_id\` varchar(26) NULL, \`table_id\` varchar(26) NULL, \`restaurant_id\` varchar(26) NULL, \`location_id\` varchar(26) NULL, UNIQUE INDEX \`IDX_a0f2cc435c1f58b4e6494e8abd\` (\`uid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB AUTO_INCREMENT=202410000001`
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` ADD CONSTRAINT \`FK_ea143999ecfa6a152f2202895e2\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` ADD CONSTRAINT \`FK_c7b3af275e3794d40fc84d23016\` FOREIGN KEY (\`product_variant_id\`) REFERENCES \`product_variant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`table\` ADD CONSTRAINT \`FK_1e79a861b6be1078a6b79e48ff9\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`table\` ADD CONSTRAINT \`FK_330a81f831c235c5511b9f52b0e\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`location\` ADD CONSTRAINT \`FK_c7e64d6441826d1c8f8edb1ecc4\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_cd7812c96209c5bdd48a6b858b0\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_2e52c3d2ee23b941afed22f6a38\` FOREIGN KEY (\`table_id\`) REFERENCES \`table\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_3edfcab660a53a1ac59e0e51911\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_25125d69332bed7866e58163544\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_25125d69332bed7866e58163544\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_3edfcab660a53a1ac59e0e51911\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_2e52c3d2ee23b941afed22f6a38\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_cd7812c96209c5bdd48a6b858b0\``);
    await queryRunner.query(`ALTER TABLE \`location\` DROP FOREIGN KEY \`FK_c7e64d6441826d1c8f8edb1ecc4\``);
    await queryRunner.query(`ALTER TABLE \`table\` DROP FOREIGN KEY \`FK_330a81f831c235c5511b9f52b0e\``);
    await queryRunner.query(`ALTER TABLE \`table\` DROP FOREIGN KEY \`FK_1e79a861b6be1078a6b79e48ff9\``);
    await queryRunner.query(`ALTER TABLE \`order_product\` DROP FOREIGN KEY \`FK_c7b3af275e3794d40fc84d23016\``);
    await queryRunner.query(`ALTER TABLE \`order_product\` DROP FOREIGN KEY \`FK_ea143999ecfa6a152f2202895e2\``);
    await queryRunner.query(`DROP INDEX \`IDX_a0f2cc435c1f58b4e6494e8abd\` ON \`order\``);
    await queryRunner.query(`DROP TABLE \`order\``);
    await queryRunner.query(`DROP TABLE \`order_product\``);
    await queryRunner.query(
      `ALTER TABLE \`location\` ADD CONSTRAINT \`FK_c7e64d6441826d1c8f8edb1ecc4\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`table\` ADD CONSTRAINT \`FK_330a81f831c235c5511b9f52b0e\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`table\` ADD CONSTRAINT \`FK_1e79a861b6be1078a6b79e48ff9\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
