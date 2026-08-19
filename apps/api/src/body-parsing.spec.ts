import type { INestApplication } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { Readable } from 'node:stream';
import { setupJsonBodyParsing } from './body-parsing';

type Middleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => void;

describe('setupJsonBodyParsing', () => {
  it('leaves multipart form data unread for the route handler', async () => {
    let middleware: Middleware | undefined;
    const app = {
      use(handler: Middleware) {
        middleware = handler;
      },
    } as unknown as INestApplication;
    setupJsonBodyParsing(app);

    const multipartBody = Buffer.from(
      '--boundary\r\nContent-Disposition: form-data; name="file"\r\n\r\navatar\r\n--boundary--\r\n',
    );
    const request = Object.assign(Readable.from([multipartBody]), {
      method: 'POST',
      path: '/uploads',
      url: '/uploads',
      headers: { 'content-type': 'multipart/form-data; boundary=boundary' },
    }) as unknown as Request;

    await new Promise<void>((resolve, reject) => {
      middleware?.(request, {} as Response, (error?: unknown) => {
        if (error) {
          reject(
            error instanceof Error ? error : new Error('Middleware error'),
          );
          return;
        }
        resolve();
      });
    });

    const handlerReceived = await readBody(request);
    expect(handlerReceived).toEqual(multipartBody);
  });
});

async function readBody(request: Request): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk as Uint8Array));
  }
  return Buffer.concat(chunks);
}
