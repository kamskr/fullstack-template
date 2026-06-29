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
import { AppInfoModel, TimestampModel } from './../src/models';
import { createOpenApiDocument, setupOpenApi } from './../src/openapi';

type AnonymousSignInResponse = {
  token?: string;
  user?: { id?: string; isAnonymous?: boolean };
};
type TestAgent = ReturnType<typeof request.agent>;

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
    const body = response.body as AnonymousSignInResponse;

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

  it('/timestamps requires authentication', async () => {
    await request(app.getHttpServer()).get('/timestamps').expect(401);
  });

  it('/timestamps supports authenticated CRUD scoped to the current user', async () => {
    const firstUser = await signInAnonymous();
    const secondUser = await signInAnonymous();
    const dateOccurredAt = '2026-06-26T12:00:00.000Z';

    const createResponse = await firstUser
      .post('/timestamps')
      .send({
        note: 'Initial timestamp note',
        dateOccurredAt,
      })
      .expect(201);
    const createdTimestamp = createResponse.body as TimestampModel;

    expect(typeof createdTimestamp.id).toBe('string');
    expect(createdTimestamp.note).toBe('Initial timestamp note');
    expect(createdTimestamp.dateOccurredAt).toBe(dateOccurredAt);
    expect(typeof createdTimestamp.createdAt).toBe('string');
    expect(typeof createdTimestamp.updatedAt).toBe('string');
    expect(createdTimestamp).not.toHaveProperty('userId');

    const firstListResponse = await firstUser.get('/timestamps').expect(200);
    const firstList = firstListResponse.body as TimestampModel[];

    expect(firstList.map((timestamp) => timestamp.id)).toContain(
      createdTimestamp.id,
    );

    const secondListResponse = await secondUser.get('/timestamps').expect(200);
    const secondList = secondListResponse.body as TimestampModel[];

    expect(secondList.map((timestamp) => timestamp.id)).not.toContain(
      createdTimestamp.id,
    );

    await secondUser.get(`/timestamps/${createdTimestamp.id}`).expect(404);
    await secondUser
      .patch(`/timestamps/${createdTimestamp.id}`)
      .send({ note: 'Cross-user update attempt' })
      .expect(404);
    await secondUser.delete(`/timestamps/${createdTimestamp.id}`).expect(404);

    const getResponse = await firstUser
      .get(`/timestamps/${createdTimestamp.id}`)
      .expect(200);
    const fetchedTimestamp = getResponse.body as TimestampModel;

    expect(fetchedTimestamp.id).toBe(createdTimestamp.id);
    expect(fetchedTimestamp.note).toBe('Initial timestamp note');

    const updatedDateOccurredAt = '2026-06-26T13:00:00.000Z';
    const updateResponse = await firstUser
      .patch(`/timestamps/${createdTimestamp.id}`)
      .send({
        note: 'Updated timestamp note',
        dateOccurredAt: updatedDateOccurredAt,
      })
      .expect(200);
    const updatedTimestamp = updateResponse.body as TimestampModel;

    expect(updatedTimestamp.id).toBe(createdTimestamp.id);
    expect(updatedTimestamp.note).toBe('Updated timestamp note');
    expect(updatedTimestamp.dateOccurredAt).toBe(updatedDateOccurredAt);

    await firstUser.delete(`/timestamps/${createdTimestamp.id}`).expect(204);
    await firstUser.get(`/timestamps/${createdTimestamp.id}`).expect(404);

    await firstUser
      .post('/api/auth/delete-anonymous-user')
      .set('origin', 'http://localhost:3000')
      .expect(200);
    await secondUser
      .post('/api/auth/delete-anonymous-user')
      .set('origin', 'http://localhost:3000')
      .expect(200);
  });

  it('/timestamps/:id rejects malformed ids before database queries', async () => {
    const agent = await signInAnonymous();
    const invalidId = 'paste-created-timestamp-id-here';

    await agent.get(`/timestamps/${invalidId}`).expect(400);
    await agent
      .patch(`/timestamps/${invalidId}`)
      .send({ note: 'Updated timestamp note' })
      .expect(400);
    await agent.delete(`/timestamps/${invalidId}`).expect(400);

    await agent
      .post('/api/auth/delete-anonymous-user')
      .set('origin', 'http://localhost:3000')
      .expect(200);
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
    expect(body.paths).toHaveProperty('/timestamps');
    expect(body.paths).toHaveProperty('/timestamps/{id}');
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

  async function signInAnonymous(): Promise<TestAgent> {
    const agent = request.agent(app.getHttpServer());
    const response = await agent
      .post('/api/auth/sign-in/anonymous')
      .set('origin', 'http://localhost:3000')
      .expect(200);
    const body = response.body as AnonymousSignInResponse;

    expect(typeof body.user?.id).toBe('string');

    return agent;
  }
});
