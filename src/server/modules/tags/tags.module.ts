import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

// Tags Module: Module for the tags service

@Module({
  providers: [TagsService],
  controllers: [TagsController],
})
export class TagsModule {}
