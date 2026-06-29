import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { auth } from '../auth/auth';
import {
  CreateTimestampModel,
  TimestampModel,
  UpdateTimestampModel,
} from '../models';
import { TimestampsService } from './timestamps.service';

@ApiTags('timestamps')
@ApiUnauthorizedResponse({ description: 'Authentication required.' })
@Controller('timestamps')
export class TimestampsController {
  constructor(private readonly timestampsService: TimestampsService) {}

  @Get()
  @ApiOkResponse({ type: TimestampModel, isArray: true })
  findAll(
    @Session() session: UserSession<typeof auth>,
  ): Promise<TimestampModel[]> {
    return this.timestampsService.findAll(session.user.id);
  }

  @Post()
  @ApiCreatedResponse({ type: TimestampModel })
  create(
    @Session() session: UserSession<typeof auth>,
    @Body() body: CreateTimestampModel,
  ): Promise<TimestampModel> {
    return this.timestampsService.create(session.user.id, body);
  }

  @Get(':id')
  @ApiOkResponse({ type: TimestampModel })
  @ApiBadRequestResponse({ description: 'Timestamp id must be a UUID.' })
  @ApiNotFoundResponse({ description: 'Timestamp not found.' })
  findOne(
    @Session() session: UserSession<typeof auth>,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TimestampModel> {
    return this.timestampsService.findOne(session.user.id, id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TimestampModel })
  @ApiBadRequestResponse({ description: 'Timestamp id must be a UUID.' })
  @ApiNotFoundResponse({ description: 'Timestamp not found.' })
  update(
    @Session() session: UserSession<typeof auth>,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateTimestampModel,
  ): Promise<TimestampModel> {
    return this.timestampsService.update(session.user.id, id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Timestamp deleted.' })
  @ApiBadRequestResponse({ description: 'Timestamp id must be a UUID.' })
  @ApiNotFoundResponse({ description: 'Timestamp not found.' })
  remove(
    @Session() session: UserSession<typeof auth>,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.timestampsService.remove(session.user.id, id);
  }
}
