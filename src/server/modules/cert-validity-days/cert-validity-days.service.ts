import { Injectable } from '@nestjs/common';
import { certValidityDaysCommand } from '~server/commands';
import { certValidityDaysDto } from '~shared/commands.dto';

/**
 * CertValidityDays Service: Defines routes for certValidityDays command
  {
    [node]: <String>
    [below]: <Number>
  }
  @returns via Promise
  {
    days: <Number>
  }
 */

@Injectable()
export class CertValidityDaysService {
  async get(args: certValidityDaysDto): Promise<{ result: any }> {
    const { result } = await certValidityDaysCommand({ below: args.below, node: args.node });

    return { result: String(result) };
  }
}
