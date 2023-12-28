import { config } from '@lib/helpers/config.helper';
import { MigrationInterface } from 'typeorm';

export class initial1660303494536 implements MigrationInterface {
  name = 'initial1660303494536';

  public async up(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Importer = require('mysql-import');
    const importer = new Importer({
      host: config.get('DATABASE_MASTER_HOST'),
      user: config.get('DATABASE_USER'),
      password: config.get('DATABASE_PASSWORD'),
      database: config.get('DATABASE_NAME'),
    });

    try {
      await importer.import(`${config.getRootPath()}/src/database/seeds/dump/initial.sql`);
      const files_imported = importer.getImported();
      console.log(`${files_imported.length} SQL file(s) imported.`);
    } catch (err) {
      console.error(err);
    }
  }

  public async down(): Promise<void> {
    return;
  }
}
