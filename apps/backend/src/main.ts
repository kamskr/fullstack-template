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

  setupJsonBodyParsing(app);
  setupOpenApi(app);

  await app.listen(configService.getOrThrow<number>('app.port'));
}
void bootstrap();
