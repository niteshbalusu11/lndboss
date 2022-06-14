import { Controller, Get, Query } from '@nestjs/common';
import { tagsDto } from '~shared/commands.dto';
import { TagsService } from './tags.service';

// Tags Controller: Defines routes for tags command

@Controller('api/tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get()
  async get(@Query() args: tagsDto) {
    return this.tagsService.get(args);
  }
}
