import * as Joi from 'joi';
import { DEFAULT_API_BASE_URL, DEFAULT_API_PORT } from './api-defaults';

const defaultDatabaseUrl =
  'postgres://app_template:app_template@localhost:5432/app_template';
const defaultBetterAuthSecret =
  'local-development-better-auth-secret-change-me-32';

// Hosted deploys must supply these explicitly. Without this the local defaults
// apply silently, so a staging service with a missing variable boots green
// while signing sessions with a committed secret. `is` is written as an
// explicit required schema so that an absent APP_ENV takes the `otherwise`
// branch — Joi does not guarantee that a sibling key's own default is applied
// before this reference resolves.
const hostedOnly = <TSchema extends Joi.AnySchema>(
  schema: TSchema,
  localDefault: string,
): Joi.AnySchema =>
  schema.when('APP_ENV', {
    is: Joi.string().valid('staging', 'production').required(),
    then: schema.required().invalid(localDefault),
    otherwise: schema.default(localDefault),
  });

export const envValidationSchema = Joi.object({
  APP_ENV: Joi.string()
    .valid('local', 'staging', 'production')
    .default('local'),
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(DEFAULT_API_PORT),
  DATABASE_URL: hostedOnly(
    Joi.string().uri({ scheme: ['postgres', 'postgresql'] }),
    defaultDatabaseUrl,
  ),
  BETTER_AUTH_SECRET: hostedOnly(Joi.string().min(32), defaultBetterAuthSecret),
  BETTER_AUTH_URL: hostedOnly(Joi.string().uri(), DEFAULT_API_BASE_URL),
  BETTER_AUTH_TRUSTED_ORIGINS: Joi.string().allow('').optional(),
});
