import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [appConfig] })],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return service metadata', () => {
      const info = appController.getInfo();

      expect(info.name).toBe('baby_app_backend');
      expect(info.version).toBe('0.0.1');
      expect(info.status).toBe('ok');
      expect(typeof info.appEnv).toBe('string');
      expect(typeof info.nodeEnv).toBe('string');
      expect(typeof info.timestamp).toBe('string');
    });
  });
});
