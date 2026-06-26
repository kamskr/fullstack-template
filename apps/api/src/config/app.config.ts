import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  appEnv: process.env.APP_ENV ?? 'local',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
}));
