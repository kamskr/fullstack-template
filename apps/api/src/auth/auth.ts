import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { betterAuth } from 'better-auth';
import { anonymous } from 'better-auth/plugins';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { loadEnvFiles } from '../config/load-env-files';
import * as schema from '../database/schema';

loadEnvFiles();

const defaultDatabaseUrl =
  'postgres://app_template:app_template@localhost:5432/app_template';
const defaultBetterAuthSecret =
  'local-development-better-auth-secret-change-me-32';

const trustedOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const authSql = postgres(
  process.env.DATABASE_URL ?? defaultDatabaseUrl,
  { max: 10 },
);

export const authDb = drizzle(authSql, { schema });

export const auth = betterAuth({
  appName: 'Full Stack Template',
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET ?? defaultBetterAuthSecret,
  database: drizzleAdapter(authDb, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        await authDb
          .update(schema.timestamps)
          .set({ userId: newUser.user.id, updatedAt: new Date() })
          .where(eq(schema.timestamps.userId, anonymousUser.user.id));
      },
    }),
  ],
  trustedOrigins,
});

export async function closeAuthDatabase(): Promise<void> {
  await authSql.end({ timeout: 5 });
}
