import { Injectable } from '@nestjs/common';
import { LndService } from '../lnd/lnd.service';
import { accountingCommand } from '~server/commands';
import { accountingDto } from '~shared/commands.dto';

/** Get an accounting report

  {
    category: <Accounting Category Type String>
    [currency]: <Currency Label String>
    [fiat]: <Fiat Type String>
    [is_csv]: <Return CSV Output Bool>
    [is_fiat_disabled]: <Omit Fiat Conversion Bool>
    lnd: <Authenticated LND API Object>
    [month]: <Month for Report String>
    [node]: <Node Name String>
    [rate_provider]: <Rate Provider String>
    request: <Request Function>
    [year]: <Year for Report String>
  }

  @returns via Promise
  {
    [rows]: [[<Column String>]]
    [rows_summary]: [[<Column String>]]
  }
*/

@Injectable()
export class AccountingService {
  async get(args: accountingDto): Promise<{ result: any }> {
    const lnd = await LndService.authenticatedLnd({ node: args.node });

    const { result } = await accountingCommand({ args, lnd });

    return { result };
  }
}
