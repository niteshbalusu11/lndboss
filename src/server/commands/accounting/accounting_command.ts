import * as request from 'balanceofsatoshis/commands/simple_request';
import * as types from '../../../shared/types';

import { AuthenticatedLnd } from 'lightning';
import { getAccountingReport } from 'balanceofsatoshis/balances';
import { logger } from '~server/utils/global_functions';

const accountingCommand = async (args: types.commandAccounting, lnd: AuthenticatedLnd) => {
  try {
    const result = await getAccountingReport({
      lnd,
      request,
      category: args.category,
      is_csv: args.is_csv,
      is_fiat_disabled: args.is_fiat_disabled,
      month: args.month,
      node: args.node,
      rate_provider: args.rate_provider,
      year: Number(args.year),
    });

    return { result };
  } catch (error) {
    logger({ error });
  }
};

export default accountingCommand;
