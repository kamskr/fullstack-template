import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TimestampsController } from './timestamps.controller';
import { TimestampsService } from './timestamps.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TimestampsController],
  providers: [TimestampsService],
})
export class TimestampsModule {}
