import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupJsonBodyParsing } from './body-parsing';
import { setupOpenApi } from './openapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  const configService = app.get(ConfigService);
  const trustedOrigins = configService
    .get<string>('BETTER_AUTH_TRUSTED_ORIGINS')
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) ?? ['http://localhost:3000', 'http://localhost:3001'];

  app.enableCors({
    origin: trustedOrigins,
    credentials: true,
  });
  setupJsonBodyParsing(app);
  setupOpenApi(app);

  await app.listen(configService.getOrThrow<number>('app.port'));
}
void bootstrap();
