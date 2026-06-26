import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppInfoModel } from './models';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getInfo(): AppInfoModel {
    return {
      name: '@template/api',
      version: '0.0.1',
      status: 'ok',
      appEnv: this.configService.getOrThrow<string>('app.appEnv'),
      nodeEnv: this.configService.getOrThrow<string>('app.nodeEnv'),
      timestamp: new Date().toISOString(),
    };
  }
}
