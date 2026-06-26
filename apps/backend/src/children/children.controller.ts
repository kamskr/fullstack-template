import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ChildrenService } from './children.service';
import { ChildModel } from '../models';

@ApiTags('children')
@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Get()
  @ApiOkResponse({ type: ChildModel, isArray: true })
  findAll(): Promise<ChildModel[]> {
    return this.childrenService.findAll();
  }
}
