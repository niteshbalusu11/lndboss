import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

const stringify = (n: object) => JSON.stringify(n, null, 2);

/**
  Bos Logger Service - Logs Serverside logs to the console
  {
    message: <Message String | JSON>,
    type: <Log Type String>,
  }
 */

@Injectable()
export class BosloggerService {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger) {}

  log({ message, type }: { message: any; type: string }) {
    if (type === 'error') {
      this.logger.error(message);
    }

    if (type === 'warn') {
      this.logger.warn(message);
    }

    if (type === 'info') {
      this.logger.log(message, { level: 'info' });
    }

    if (type === 'json') {
      this.logger.log(stringify(message), { level: 'info' });
    }
  }
}
