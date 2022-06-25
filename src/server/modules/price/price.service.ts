import { Injectable } from '@nestjs/common';
import { priceCommand } from '~server/commands';
import { priceDto } from '~shared/commands.dto';

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

@Injectable()
export class PriceService {
  async get(args: priceDto): Promise<{ result: any }> {
    const { result } = await priceCommand(args);

    return { result };
  }
}
