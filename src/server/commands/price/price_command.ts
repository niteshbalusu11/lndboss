import * as request from 'balanceofsatoshis/commands/simple_request';
import * as types from '../../../shared/types';

import { getPrices } from '@alexbosworth/fiat';
import { httpLogger } from '~server/utils/global_functions';

/** Get exchange rates from a rate provider
  {
    from: <From Rate Provider String>
    request: <Request Function> {url}, (err, {statusCode}, body) => {}
    symbols: [<Fiat Symbol String>] // empty defaults to USD
  }
  @returns via Promise
  {
    tickers: [{
      date: <Rate Updated At ISO 8601 Date String>
      rate: <Exchange Rate in Cents Number>
      ticker: <Ticker Symbol String>
    }]
  }
*/

const priceCommand = async (args: types.commandPrice): Promise<{ result: any }> => {
  try {
    const symbols = !!args.symbols
      ? args.symbols
          .toUpperCase()
          .trim()
          .split(',')
          .map(n => n.trim())
      : ['USD'];

    const result = await getPrices({
      request,
      symbols,
      from: args.from,
    });

    return { result };
  } catch (error) {
    httpLogger({ error });
  }
};

export default priceCommand;
