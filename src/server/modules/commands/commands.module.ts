import { CommandsController } from './commands.controller';
import { CommandsService } from './commands.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CommandsController],
  providers: [CommandsService],
})
export class CommandsModule {}
