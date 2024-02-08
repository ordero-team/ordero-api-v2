import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1704559361925 implements MigrationInterface {
  name = 'initial1704559361925';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`owner\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`phone\` varchar(25) NOT NULL, \`email\` varchar(150) NULL, \`password\` varchar(255) NOT NULL, \`reset_token\` varchar(255) NULL, \`verification_token\` varchar(255) NULL, \`verification_code\` varchar(255) NULL, \`verified_at\` datetime NULL, \`status\` varchar(25) NOT NULL, \`last_login_at\` datetime NULL, \`restaurant_id\` varchar(26) NULL, UNIQUE INDEX \`REL_d099bef5ba8a112db4de25e819\` (\`restaurant_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`product_category\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`category_id\` varchar(26) NULL, \`product_id\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`order_product\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`order_id\` varchar(26) NULL, \`product_variant_id\` varchar(26) NULL, \`qty\` int NOT NULL DEFAULT '0', \`price\` decimal(16,2) NULL DEFAULT '0.00', \`status\` varchar(25) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`product_stock\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`onhand\` int NULL DEFAULT '0', \`allocated\` int NULL DEFAULT '0', \`available\` int NULL DEFAULT '0', \`threshold\` int NULL DEFAULT '0', \`sold\` int NULL DEFAULT '0', \`last_action\` varchar(255) NULL, \`actor\` varchar(100) NULL, \`variant_id\` varchar(26) NULL, \`location_id\` varchar(26) NULL, \`restaurant_id\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
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
      `CREATE TABLE \`staff_role\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`slug\` varchar(100) NOT NULL, \`permissions\` json NULL, \`is_default\` tinyint NULL DEFAULT '0', UNIQUE INDEX \`IDX_0ac68a587a63abcdf88a8e7c7a\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`staff_user\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`email\` varchar(150) NULL, \`phone\` varchar(25) NULL, \`password\` varchar(255) NOT NULL, \`reset_token\` varchar(255) NULL, \`reset_token_expires\` datetime NULL, \`admin_code\` varchar(20) NULL, \`status\` varchar(25) NOT NULL, \`last_login_at\` datetime NULL, \`role_slug\` varchar(26) NULL, \`location_id\` varchar(26) NULL, \`restaurant_id\` varchar(26) NULL, UNIQUE INDEX \`IDX_41a4f42a05b7aee26f9d3a0bb6\` (\`email\`), UNIQUE INDEX \`IDX_31fa873c0e53578eb7af05fe93\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`media\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`label\` varchar(255) NULL, \`url\` varchar(255) NULL, \`owner_id\` varchar(26) NULL, \`staff_user_id\` varchar(26) NULL, \`restaurant_id\` varchar(26) NULL, \`product_id\` varchar(26) NULL, UNIQUE INDEX \`REL_c6889397830b5ed0f2a3036206\` (\`owner_id\`), UNIQUE INDEX \`REL_cff5e3462728daf5e1bd777bcb\` (\`staff_user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`table\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`number\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`restaurant_id\` varchar(26) NULL, \`location_id\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`restaurant\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`phone\` varchar(25) NULL, \`slug\` varchar(255) NOT NULL, \`email\` varchar(150) NULL, \`website\` varchar(255) NULL, \`status\` varchar(25) NOT NULL, \`owner_id\` varchar(26) NULL, UNIQUE INDEX \`REL_fe7a22ecf454b7168b5a37fbdc\` (\`owner_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`location\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`is_default\` tinyint NULL DEFAULT '0', \`restaurant_id\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`order\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`uid\` bigint NOT NULL AUTO_INCREMENT, \`number\` varchar(50) NOT NULL, \`gross_total\` decimal(16,2) NULL DEFAULT '0.00', \`discount\` decimal(16,2) NULL DEFAULT '0.00', \`net_total\` decimal(16,2) NULL DEFAULT '0.00', \`billed_at\` datetime NULL, \`status\` varchar(25) NOT NULL, \`customer_id\` varchar(26) NULL, \`table_id\` varchar(26) NULL, \`restaurant_id\` varchar(26) NULL, \`location_id\` varchar(26) NULL, UNIQUE INDEX \`IDX_a0f2cc435c1f58b4e6494e8abd\` (\`uid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB AUTO_INCREMENT=202410000001`
    );
    await queryRunner.query(
      `CREATE TABLE \`customer\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`phone\` varchar(25) NOT NULL, \`email\` varchar(150) NULL, \`password\` varchar(255) NOT NULL, \`reset_token\` varchar(255) NULL, \`verification_token\` varchar(255) NULL, \`verified_at\` datetime NULL, \`status\` varchar(25) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`slug\` varchar(100) NOT NULL, \`permissions\` json NULL, \`restaurant_id\` varchar(26) NULL, UNIQUE INDEX \`IDX_35c9b140caaf6da09cfabb0d67\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`staff_blacklist\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`token\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`staff_session\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`token_id\` varchar(255) NULL, \`token_deleted\` tinyint NULL DEFAULT '0', \`ip_address\` varchar(25) NULL, \`user_agent\` varchar(255) NULL, \`raw\` json NULL, \`logged_out_at\` datetime NULL, \`staff_user_id\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`owner\` ADD CONSTRAINT \`FK_d099bef5ba8a112db4de25e8190\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`product_category\` ADD CONSTRAINT \`FK_2df1f83329c00e6eadde0493e16\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`product_category\` ADD CONSTRAINT \`FK_0374879a971928bc3f57eed0a59\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` ADD CONSTRAINT \`FK_ea143999ecfa6a152f2202895e2\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` ADD CONSTRAINT \`FK_c7b3af275e3794d40fc84d23016\` FOREIGN KEY (\`product_variant_id\`) REFERENCES \`product_variant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
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
      `ALTER TABLE \`staff_user\` ADD CONSTRAINT \`FK_c6ffed1a4934b4a59df1e505048\` FOREIGN KEY (\`role_slug\`) REFERENCES \`staff_role\`(\`slug\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`staff_user\` ADD CONSTRAINT \`FK_4b4d37ed2c9dc1bb47f87654f4d\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`staff_user\` ADD CONSTRAINT \`FK_514e02e2d9138143ce1c6165578\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`media\` ADD CONSTRAINT \`FK_c6889397830b5ed0f2a30362065\` FOREIGN KEY (\`owner_id\`) REFERENCES \`owner\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`media\` ADD CONSTRAINT \`FK_cff5e3462728daf5e1bd777bcb9\` FOREIGN KEY (\`staff_user_id\`) REFERENCES \`staff_user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`media\` ADD CONSTRAINT \`FK_66a647deee9b6e070a558aec762\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`media\` ADD CONSTRAINT \`FK_1fe69e256dfd757e9e7651c6bf5\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`table\` ADD CONSTRAINT \`FK_1e79a861b6be1078a6b79e48ff9\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`table\` ADD CONSTRAINT \`FK_330a81f831c235c5511b9f52b0e\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`restaurant\` ADD CONSTRAINT \`FK_fe7a22ecf454b7168b5a37fbdce\` FOREIGN KEY (\`owner_id\`) REFERENCES \`owner\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`
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
    await queryRunner.query(
      `ALTER TABLE \`role\` ADD CONSTRAINT \`FK_71b066744fdcbe3bb66b78b6067\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`staff_session\` ADD CONSTRAINT \`FK_a22a2e34ae99521fce06336f06e\` FOREIGN KEY (\`staff_user_id\`) REFERENCES \`staff_user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`staff_session\` DROP FOREIGN KEY \`FK_a22a2e34ae99521fce06336f06e\``);
    await queryRunner.query(`ALTER TABLE \`role\` DROP FOREIGN KEY \`FK_71b066744fdcbe3bb66b78b6067\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_25125d69332bed7866e58163544\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_3edfcab660a53a1ac59e0e51911\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_2e52c3d2ee23b941afed22f6a38\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_cd7812c96209c5bdd48a6b858b0\``);
    await queryRunner.query(`ALTER TABLE \`location\` DROP FOREIGN KEY \`FK_c7e64d6441826d1c8f8edb1ecc4\``);
    await queryRunner.query(`ALTER TABLE \`restaurant\` DROP FOREIGN KEY \`FK_fe7a22ecf454b7168b5a37fbdce\``);
    await queryRunner.query(`ALTER TABLE \`table\` DROP FOREIGN KEY \`FK_330a81f831c235c5511b9f52b0e\``);
    await queryRunner.query(`ALTER TABLE \`table\` DROP FOREIGN KEY \`FK_1e79a861b6be1078a6b79e48ff9\``);
    await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_1fe69e256dfd757e9e7651c6bf5\``);
    await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_66a647deee9b6e070a558aec762\``);
    await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_cff5e3462728daf5e1bd777bcb9\``);
    await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_c6889397830b5ed0f2a30362065\``);
    await queryRunner.query(`ALTER TABLE \`staff_user\` DROP FOREIGN KEY \`FK_514e02e2d9138143ce1c6165578\``);
    await queryRunner.query(`ALTER TABLE \`staff_user\` DROP FOREIGN KEY \`FK_4b4d37ed2c9dc1bb47f87654f4d\``);
    await queryRunner.query(`ALTER TABLE \`staff_user\` DROP FOREIGN KEY \`FK_c6ffed1a4934b4a59df1e505048\``);
    await queryRunner.query(`ALTER TABLE \`product_variant\` DROP FOREIGN KEY \`FK_ba81eb96dc6c10d67a3270e913e\``);
    await queryRunner.query(`ALTER TABLE \`product_variant\` DROP FOREIGN KEY \`FK_ca67dd080aac5ecf99609960cd2\``);
    await queryRunner.query(`ALTER TABLE \`product_stock\` DROP FOREIGN KEY \`FK_e7ddda0caa01e71ac44fc7f2bf8\``);
    await queryRunner.query(`ALTER TABLE \`product_stock\` DROP FOREIGN KEY \`FK_883f3097914ea14c8a3a772d682\``);
    await queryRunner.query(`ALTER TABLE \`product_stock\` DROP FOREIGN KEY \`FK_c9b7956474f99101b96248b8a3f\``);
    await queryRunner.query(`ALTER TABLE \`order_product\` DROP FOREIGN KEY \`FK_c7b3af275e3794d40fc84d23016\``);
    await queryRunner.query(`ALTER TABLE \`order_product\` DROP FOREIGN KEY \`FK_ea143999ecfa6a152f2202895e2\``);
    await queryRunner.query(`ALTER TABLE \`product_category\` DROP FOREIGN KEY \`FK_0374879a971928bc3f57eed0a59\``);
    await queryRunner.query(`ALTER TABLE \`product_category\` DROP FOREIGN KEY \`FK_2df1f83329c00e6eadde0493e16\``);
    await queryRunner.query(`ALTER TABLE \`owner\` DROP FOREIGN KEY \`FK_d099bef5ba8a112db4de25e8190\``);
    await queryRunner.query(`DROP TABLE \`staff_session\``);
    await queryRunner.query(`DROP TABLE \`staff_blacklist\``);
    await queryRunner.query(`DROP INDEX \`IDX_35c9b140caaf6da09cfabb0d67\` ON \`role\``);
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(`DROP TABLE \`customer\``);
    await queryRunner.query(`DROP INDEX \`IDX_a0f2cc435c1f58b4e6494e8abd\` ON \`order\``);
    await queryRunner.query(`DROP TABLE \`order\``);
    await queryRunner.query(`DROP TABLE \`location\``);
    await queryRunner.query(`DROP INDEX \`REL_fe7a22ecf454b7168b5a37fbdc\` ON \`restaurant\``);
    await queryRunner.query(`DROP TABLE \`restaurant\``);
    await queryRunner.query(`DROP TABLE \`table\``);
    await queryRunner.query(`DROP INDEX \`REL_cff5e3462728daf5e1bd777bcb\` ON \`media\``);
    await queryRunner.query(`DROP INDEX \`REL_c6889397830b5ed0f2a3036206\` ON \`media\``);
    await queryRunner.query(`DROP TABLE \`media\``);
    await queryRunner.query(`DROP INDEX \`IDX_31fa873c0e53578eb7af05fe93\` ON \`staff_user\``);
    await queryRunner.query(`DROP INDEX \`IDX_41a4f42a05b7aee26f9d3a0bb6\` ON \`staff_user\``);
    await queryRunner.query(`DROP TABLE \`staff_user\``);
    await queryRunner.query(`DROP INDEX \`IDX_0ac68a587a63abcdf88a8e7c7a\` ON \`staff_role\``);
    await queryRunner.query(`DROP TABLE \`staff_role\``);
    await queryRunner.query(`DROP TABLE \`product\``);
    await queryRunner.query(`DROP TABLE \`product_variant\``);
    await queryRunner.query(`DROP TABLE \`variant\``);
    await queryRunner.query(`DROP TABLE \`product_stock\``);
    await queryRunner.query(`DROP TABLE \`order_product\``);
    await queryRunner.query(`DROP TABLE \`product_category\``);
    await queryRunner.query(`DROP TABLE \`category\``);
    await queryRunner.query(`DROP INDEX \`REL_d099bef5ba8a112db4de25e819\` ON \`owner\``);
    await queryRunner.query(`DROP TABLE \`owner\``);
  }
}
