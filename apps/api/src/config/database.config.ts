import { registerAs } from '@nestjs/config';

const defaultDatabaseUrl =
  'postgres://app_template:app_template@localhost:5432/app_template';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL ?? defaultDatabaseUrl,
}));
