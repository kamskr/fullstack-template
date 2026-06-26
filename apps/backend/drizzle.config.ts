import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const defaultDatabaseUrl = 'postgres://baby_app:baby_app@localhost:5432/baby_app';

export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? defaultDatabaseUrl,
  },
});
