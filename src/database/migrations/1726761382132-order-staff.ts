import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderStaff1726761382132 implements MigrationInterface {
  name = 'OrderStaff1726761382132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`order\` ADD \`staff_id\` varchar(26) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_5c126f83b53f2c6c4caafdb914d\` FOREIGN KEY (\`staff_id\`) REFERENCES \`staff_user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_5c126f83b53f2c6c4caafdb914d\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`staff_id\``);
  }
}
