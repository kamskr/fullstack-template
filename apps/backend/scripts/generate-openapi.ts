import { NestFactory } from '@nestjs/core';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { AppModule } from '../src/app.module';
import { createOpenApiDocument } from '../src/openapi';

async function generateOpenApi(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: false,
  });
  await app.init();

  const document = createOpenApiDocument(app);
  const outputPath = resolve(process.cwd(), 'docs/openapi.json');

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`);
  await app.close();
}

void generateOpenApi();
