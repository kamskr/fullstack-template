import { registerAs } from '@nestjs/config';
import { DEFAULT_API_PORT } from './api-defaults';

export default registerAs('app', () => ({
  appEnv: process.env.APP_ENV ?? 'local',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? DEFAULT_API_PORT),
}));
