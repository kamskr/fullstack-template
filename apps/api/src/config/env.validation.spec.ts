import { DEFAULT_API_BASE_URL, DEFAULT_API_PORT } from './api-defaults';
import { envValidationSchema } from './env.validation';

describe('environment validation', () => {
  it('uses the canonical local API address by default', () => {
    const result = envValidationSchema.validate({});
    const value: unknown = result.value;

    expect(result.error).toBeUndefined();
    expect(value).toMatchObject({
      APP_ENV: 'local',
      PORT: DEFAULT_API_PORT,
      BETTER_AUTH_URL: DEFAULT_API_BASE_URL,
    });
  });

  describe('hosted environments', () => {
    const hostedEnv = {
      APP_ENV: 'staging',
      DATABASE_URL: 'postgres://app:secret@db.internal:5432/app',
      BETTER_AUTH_SECRET: 'a'.repeat(32),
      BETTER_AUTH_URL: 'https://api-staging.example.com',
    };

    it('accepts a fully configured staging environment', () => {
      const result = envValidationSchema.validate(hostedEnv);

      expect(result.error).toBeUndefined();
    });

    const requiredKeys = [
      'DATABASE_URL',
      'BETTER_AUTH_SECRET',
      'BETTER_AUTH_URL',
    ] as const satisfies readonly (keyof typeof hostedEnv)[];

    it.each(requiredKeys)('rejects staging without %s', (key) => {
      const withoutKey = Object.fromEntries(
        Object.entries(hostedEnv).filter(([name]) => name !== key),
      );
      const result = envValidationSchema.validate(withoutKey);

      expect(result.error).toBeDefined();
    });

    it('rejects the committed local auth secret in staging', () => {
      const result = envValidationSchema.validate({
        ...hostedEnv,
        BETTER_AUTH_SECRET: 'local-development-better-auth-secret-change-me-32',
      });

      expect(result.error).toBeDefined();
    });
  });
});
