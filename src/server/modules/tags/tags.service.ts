import { Injectable } from '@nestjs/common';
import { tagsCommand } from '~server/commands';
import { tagsDto } from '~shared/commands.dto';

/** Tags service: Handles the tags command

  {
    add: [<Node To Add To Tag Public Key Hex String>]
    [id]: <Id to Use for New Tag Hex String>
    [icon]: <Tag Icon String>
    [is_avoided]: <Set Avoid Flag on Tag Bool>
    remove: [<Node to Remove From Tag Public Key Hex String>]
    [tag]: <Tag Alias or Id to Adjust String>
  }

  @returns via Promise
  {
    [tags]: [{
      icon: <Tag Icon String>
      id: <Tag Id Hex String>
      name: <Tag Name String>
      nodes: [{
        alias: <Node Alias String>
        public_key: <Public Key Hex String>
      }]
    }]
  }
*/

@Injectable()
export class TagsService {
  async get(args: tagsDto): Promise<{ result: any }> {
    const { result } = await tagsCommand(args);

    return { result };
  }
}
