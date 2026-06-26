import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { closeAuthDatabase } from './auth';

@Injectable()
export class AuthLifecycleService implements OnApplicationShutdown {
  async onApplicationShutdown(): Promise<void> {
    await closeAuthDatabase();
  }
}
