import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import {
  CreateTimestampModel,
  TimestampModel,
  UpdateTimestampModel,
} from '../models';
import { TimestampsService } from './timestamps.service';

@ApiTags('timestamps')
@AllowAnonymous()
@Controller('timestamps')
export class TimestampsController {
  constructor(private readonly timestampsService: TimestampsService) {}

  @Post()
  @ApiCreatedResponse({ type: TimestampModel })
  @ApiBadRequestResponse({ description: 'Invalid timestamp payload.' })
  create(@Body() body: CreateTimestampModel): Promise<TimestampModel> {
    return this.timestampsService.create(body);
  }

  @Get()
  @ApiOkResponse({ type: TimestampModel, isArray: true })
  @ApiQuery({
    name: 'updatedAfter',
    required: false,
    type: String,
    description: 'Return only records updated after this ISO date-time.',
    example: '2026-06-18T10:00:00.000Z',
  })
  @ApiBadRequestResponse({ description: 'Invalid updatedAfter value.' })
  findAll(
    @Query('updatedAfter') updatedAfter?: string,
  ): Promise<TimestampModel[]> {
    return this.timestampsService.findAll(updatedAfter);
  }

  @Get(':id')
  @ApiOkResponse({ type: TimestampModel })
  @ApiBadRequestResponse({ description: 'Invalid timestamp id.' })
  @ApiNotFoundResponse({ description: 'Timestamp not found.' })
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<TimestampModel> {
    return this.timestampsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TimestampModel })
  @ApiBadRequestResponse({ description: 'Invalid timestamp payload or id.' })
  @ApiNotFoundResponse({ description: 'Timestamp not found.' })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: UpdateTimestampModel,
  ): Promise<TimestampModel> {
    return this.timestampsService.update(id, body);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'All timestamps deleted.' })
  async removeAll(): Promise<void> {
    await this.timestampsService.removeAll();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Timestamp deleted.' })
  @ApiBadRequestResponse({ description: 'Invalid timestamp id.' })
  @ApiNotFoundResponse({ description: 'Timestamp not found.' })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.timestampsService.remove(id);
  }
}
