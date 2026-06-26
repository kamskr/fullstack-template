import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';
import { AuthLifecycleService } from './auth-lifecycle.service';

@Module({
  imports: [BetterAuthModule.forRoot({ auth })],
  providers: [AuthLifecycleService],
})
export class AppAuthModule {}
