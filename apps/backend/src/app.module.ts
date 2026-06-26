import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppAuthModule } from './auth/auth.module';
import { ChildrenModule } from './children/children.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { envFilePaths } from './config/env-file-paths';
import { envValidationSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { TimestampsModule } from './timestamps/timestamps.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePaths,
      load: [appConfig, databaseConfig],
      validationOptions: {
        abortEarly: false,
      },
      validationSchema: envValidationSchema,
    }),
    AppAuthModule,
    ChildrenModule,
    DatabaseModule,
    HealthModule,
    TimestampsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
