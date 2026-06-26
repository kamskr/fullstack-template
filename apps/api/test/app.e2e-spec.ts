import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { setupJsonBodyParsing } from './../src/body-parsing';
import { HealthResponseDto } from './../src/health/dto/health-response.dto';
import { AppInfoModel } from './../src/models';
import { createOpenApiDocument, setupOpenApi } from './../src/openapi';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication({ bodyParser: false });
    setupJsonBodyParsing(app);
    setupOpenApi(app);
    await app.init();
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/').expect(200);
    const body = response.body as AppInfoModel;

    expect(body.name).toBe('@template/api');
    expect(body.version).toBe('0.0.1');
    expect(body.status).toBe('ok');
    expect(typeof body.appEnv).toBe('string');
    expect(typeof body.nodeEnv).toBe('string');
    expect(typeof body.timestamp).toBe('string');
  });

  it('/health (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/health')
      .expect(200);
    const body = response.body as HealthResponseDto;

    expect(body.status).toBe('ok');
    expect(typeof body.timestamp).toBe('string');
    expect(typeof body.uptimeSeconds).toBe('number');
    expect(typeof body.appEnv).toBe('string');
    expect(typeof body.nodeEnv).toBe('string');
  });

  it('/api/auth/ok (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/auth/ok')
      .expect(200)
      .expect({ ok: true });
  });

  it('/api/auth/sign-in/anonymous (POST) creates an authenticated anonymous session', async () => {
    const agent = request.agent(app.getHttpServer());

    const response = await agent
      .post('/api/auth/sign-in/anonymous')
      .set('origin', 'http://localhost:3000')
      .expect(200);
    const body = response.body as {
      token?: string;
      user?: { id?: string; isAnonymous?: boolean };
    };

    expect(typeof body.token).toBe('string');
    expect(typeof body.user?.id).toBe('string');
    expect(body.user?.isAnonymous).toBe(true);

    await agent.get('/api/auth/get-session').expect(200);
    await agent
      .post('/api/auth/delete-anonymous-user')
      .set('origin', 'http://localhost:3000')
      .expect(200)
      .expect({ success: true });
  });

  it('/api-json (GET)', async () => {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().build(),
    );
    const response = await request(app.getHttpServer())
      .get('/api-json')
      .expect(200);
    const body = response.body as {
      openapi?: string;
      paths?: Record<string, unknown>;
    };

    expect(body.openapi).toBe(document.openapi);
    expect(body.paths).toHaveProperty('/health');
    expect(body.paths).toHaveProperty('/');
    expect(body.paths).not.toHaveProperty('/children');
    expect(body.paths).not.toHaveProperty('/timestamps');
  });

  it('keeps checked OpenAPI schema current', async () => {
    const schemaPath = resolve(process.cwd(), 'docs/openapi.json');
    const checkedSchema = JSON.parse(
      await readFile(schemaPath, 'utf8'),
    ) as ReturnType<typeof createOpenApiDocument>;

    expect(checkedSchema).toEqual(createOpenApiDocument(app));
  });

  afterAll(async () => {
    await app.close();
  });
});
