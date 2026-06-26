import * as Joi from 'joi';

const defaultDatabaseUrl =
  'postgres://app_template:app_template@localhost:5432/app_template';
const defaultBetterAuthSecret =
  'local-development-better-auth-secret-change-me-32';

export const envValidationSchema = Joi.object({
  APP_ENV: Joi.string()
    .valid('local', 'staging', 'production')
    .default('local'),
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .default(defaultDatabaseUrl),
  BETTER_AUTH_SECRET: Joi.string().min(32).default(defaultBetterAuthSecret),
  BETTER_AUTH_URL: Joi.string().uri().default('http://localhost:3000'),
  BETTER_AUTH_TRUSTED_ORIGINS: Joi.string().allow('').optional(),
});
