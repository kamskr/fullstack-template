import { INestApplication } from '@nestjs/common';
import { json, NextFunction, Request, Response } from 'express';

export function setupJsonBodyParsing(app: INestApplication): void {
  const jsonParser = json();

  app.use((request: Request, response: Response, next: NextFunction) => {
    if (request.path.startsWith('/api/auth')) {
      next();
      return;
    }

    jsonParser(request, response, next);
  });
}
