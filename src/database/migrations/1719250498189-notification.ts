import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notification1719250498189 implements MigrationInterface {
  name = 'Notification1719250498189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`notification\` (\`id\` varchar(26) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`type\` varchar(100) NULL, \`title\` varchar(255) NULL, \`content\` text NULL, \`actor\` varchar(100) NULL, \`location_id\` varchar(26) NULL, \`restaurant_id\` varchar(26) NULL, \`order_id\` varchar(26) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_9f0f4d05e60d2d94135eda86649\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_eea2206a8461ccbcfc11f1c45a5\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`restaurant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_3ea5cd8a1de9cbf90c86dd0582c\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_3ea5cd8a1de9cbf90c86dd0582c\``);
    await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_eea2206a8461ccbcfc11f1c45a5\``);
    await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_9f0f4d05e60d2d94135eda86649\``);
    await queryRunner.query(`DROP TABLE \`notification\``);
  }
}
