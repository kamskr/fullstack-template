import { defineConfig } from 'drizzle-kit';
import { loadEnvFiles } from './src/config/load-env-files';

loadEnvFiles();

const defaultDatabaseUrl =
  'postgres://app_template:app_template@localhost:5432/app_template';

export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? defaultDatabaseUrl,
  },
});
