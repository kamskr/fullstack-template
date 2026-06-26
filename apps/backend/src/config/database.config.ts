import { registerAs } from '@nestjs/config';

const defaultDatabaseUrl =
  'postgres://baby_app:baby_app@localhost:5432/baby_app';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL ?? defaultDatabaseUrl,
}));
