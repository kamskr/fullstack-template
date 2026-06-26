import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

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
