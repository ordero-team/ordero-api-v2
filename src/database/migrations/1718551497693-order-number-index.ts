import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderNumberIndex1718551497693 implements MigrationInterface {
  name = 'OrderNumberIndex1718551497693';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX \`IDX_2bf21e468cc540c1ac7645da26\` ON \`order\` (\`number\`)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_2bf21e468cc540c1ac7645da26\` ON \`order\``);
  }
}
