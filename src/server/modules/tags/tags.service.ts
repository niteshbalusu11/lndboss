import { Injectable } from '@nestjs/common';
import { tagsCommand } from '~server/commands';
import { tagsDto } from '~shared/commands.dto';

@Injectable()
export class TagsService {
  async get(args: tagsDto): Promise<{ result: any; error: string }> {
    const { result, error } = await tagsCommand(args);

    return { result, error };
  }
}
