const appEnv = process.env.APP_ENV ?? 'local';

export const envFilePaths =
  appEnv === 'local'
    ? ['.env.local', '.env']
    : [`.env.${appEnv}.local`, `.env.${appEnv}`, '.env'];
