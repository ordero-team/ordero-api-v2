import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1703750867632 implements MigrationInterface {
  name = 'initial1703750867632';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`customer\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`phone\` varchar(25) NOT NULL, \`email\` varchar(150) NULL, \`password\` varchar(255) NOT NULL, \`reset_token\` varchar(255) NULL, \`verification_token\` varchar(255) NULL, \`verified_at\` datetime NULL, \`status\` varchar(25) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`employee\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`phone\` varchar(25) NOT NULL, \`email\` varchar(150) NULL, \`role\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`reset_token\` varchar(255) NULL, \`verification_token\` varchar(255) NULL, \`verified_at\` datetime NULL, \`status\` varchar(25) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`product_category\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`category_id\` varchar(26) NULL, \`product_id\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`table\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`number\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`restaurant_id\` varchar(26) NULL, \`location_id\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`restaurant\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`phone\` varchar(25) NULL, \`status\` varchar(25) NOT NULL, \`owner_id\` varchar(26) NULL, UNIQUE INDEX \`REL_fe7a22ecf454b7168b5a37fbdc\` (\`owner_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`location\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`is_default\` tinyint NULL DEFAULT '0', \`restaurant_id\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`product_stock\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`allocated\` int NULL DEFAULT '0', \`available\` int NULL DEFAULT '0', \`threshold\` int NULL DEFAULT '0', \`sold\` int NULL DEFAULT '0', \`last_action\` varchar(255) NULL, \`actor\` varchar(100) NULL, \`variant_id\` varchar(26) NULL, \`location_id\` varchar(26) NULL, \`restaurant_id\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`variant\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`price\` decimal(16,2) NULL DEFAULT '0.00', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`product_variant\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`status\` varchar(255) NOT NULL, \`product_id\` varchar(26) NULL, \`variant_id\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`product\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`price\` decimal(16,2) NULL DEFAULT '0.00', \`status\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`media\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`label\` varchar(255) NULL, \`url\` varchar(255) NULL, \`employee_id\` varchar(26) NULL, \`restaurant_id\` varchar(26) NULL, \`product_id\` varchar(26) NULL, UNIQUE INDEX \`REL_a1ee85880abd00440499380380\` (\`employee_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`staff\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`employee_id\` varchar(26) NULL, \`restaurant_id\` varchar(26) NULL, \`location_id\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`product_category\` ADD CONSTRAINT \`FK_2df1f83329c00e6eadde0493e16\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`product_category\` ADD CONSTRAINT \`FK_0374879a971928bc3f57eed0a59\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`table\` ADD CONSTRAINT \`FK_1e79a861b6be1078a6b79e48ff9\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`table\` ADD CONSTRAINT \`FK_330a81f831c235c5511b9f52b0e\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`restaurant\` ADD CONSTRAINT \`FK_fe7a22ecf454b7168b5a37fbdce\` FOREIGN KEY (\`owner_id\`) REFERENCES \`employee\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`location\` ADD CONSTRAINT \`FK_c7e64d6441826d1c8f8edb1ecc4\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`product_stock\` ADD CONSTRAINT \`FK_c9b7956474f99101b96248b8a3f\` FOREIGN KEY (\`variant_id\`) REFERENCES \`product_variant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`product_stock\` ADD CONSTRAINT \`FK_883f3097914ea14c8a3a772d682\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`product_stock\` ADD CONSTRAINT \`FK_e7ddda0caa01e71ac44fc7f2bf8\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`product_variant\` ADD CONSTRAINT \`FK_ca67dd080aac5ecf99609960cd2\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`product_variant\` ADD CONSTRAINT \`FK_ba81eb96dc6c10d67a3270e913e\` FOREIGN KEY (\`variant_id\`) REFERENCES \`variant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`media\` ADD CONSTRAINT \`FK_a1ee85880abd004404993803809\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employee\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`media\` ADD CONSTRAINT \`FK_66a647deee9b6e070a558aec762\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`media\` ADD CONSTRAINT \`FK_1fe69e256dfd757e9e7651c6bf5\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`staff\` ADD CONSTRAINT \`FK_40490dddbd1095ad68ea36c6be0\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employee\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`staff\` ADD CONSTRAINT \`FK_1b1658ba3bb205874b325403b08\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`staff\` ADD CONSTRAINT \`FK_421a8b1ecbba304bfaf996307c5\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`staff\` DROP FOREIGN KEY \`FK_421a8b1ecbba304bfaf996307c5\``);
    await queryRunner.query(`ALTER TABLE \`staff\` DROP FOREIGN KEY \`FK_1b1658ba3bb205874b325403b08\``);
    await queryRunner.query(`ALTER TABLE \`staff\` DROP FOREIGN KEY \`FK_40490dddbd1095ad68ea36c6be0\``);
    await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_1fe69e256dfd757e9e7651c6bf5\``);
    await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_66a647deee9b6e070a558aec762\``);
    await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_a1ee85880abd004404993803809\``);
    await queryRunner.query(`ALTER TABLE \`product_variant\` DROP FOREIGN KEY \`FK_ba81eb96dc6c10d67a3270e913e\``);
    await queryRunner.query(`ALTER TABLE \`product_variant\` DROP FOREIGN KEY \`FK_ca67dd080aac5ecf99609960cd2\``);
    await queryRunner.query(`ALTER TABLE \`product_stock\` DROP FOREIGN KEY \`FK_e7ddda0caa01e71ac44fc7f2bf8\``);
    await queryRunner.query(`ALTER TABLE \`product_stock\` DROP FOREIGN KEY \`FK_883f3097914ea14c8a3a772d682\``);
    await queryRunner.query(`ALTER TABLE \`product_stock\` DROP FOREIGN KEY \`FK_c9b7956474f99101b96248b8a3f\``);
    await queryRunner.query(`ALTER TABLE \`location\` DROP FOREIGN KEY \`FK_c7e64d6441826d1c8f8edb1ecc4\``);
    await queryRunner.query(`ALTER TABLE \`restaurant\` DROP FOREIGN KEY \`FK_fe7a22ecf454b7168b5a37fbdce\``);
    await queryRunner.query(`ALTER TABLE \`table\` DROP FOREIGN KEY \`FK_330a81f831c235c5511b9f52b0e\``);
    await queryRunner.query(`ALTER TABLE \`table\` DROP FOREIGN KEY \`FK_1e79a861b6be1078a6b79e48ff9\``);
    await queryRunner.query(`ALTER TABLE \`product_category\` DROP FOREIGN KEY \`FK_0374879a971928bc3f57eed0a59\``);
    await queryRunner.query(`ALTER TABLE \`product_category\` DROP FOREIGN KEY \`FK_2df1f83329c00e6eadde0493e16\``);
    await queryRunner.query(`DROP TABLE \`staff\``);
    await queryRunner.query(`DROP INDEX \`REL_a1ee85880abd00440499380380\` ON \`media\``);
    await queryRunner.query(`DROP TABLE \`media\``);
    await queryRunner.query(`DROP TABLE \`product\``);
    await queryRunner.query(`DROP TABLE \`product_variant\``);
    await queryRunner.query(`DROP TABLE \`variant\``);
    await queryRunner.query(`DROP TABLE \`product_stock\``);
    await queryRunner.query(`DROP TABLE \`location\``);
    await queryRunner.query(`DROP INDEX \`REL_fe7a22ecf454b7168b5a37fbdc\` ON \`restaurant\``);
    await queryRunner.query(`DROP TABLE \`restaurant\``);
    await queryRunner.query(`DROP TABLE \`table\``);
    await queryRunner.query(`DROP TABLE \`product_category\``);
    await queryRunner.query(`DROP TABLE \`category\``);
    await queryRunner.query(`DROP TABLE \`employee\``);
    await queryRunner.query(`DROP TABLE \`customer\``);
  }
}
