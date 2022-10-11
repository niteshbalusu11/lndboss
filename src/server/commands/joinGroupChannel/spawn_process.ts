import { Logger, createLogger, format, transports } from 'winston';

import { LndService } from '~server/modules/lnd/lnd.service';
import { joinGroupChannel } from 'paid-services';

async function getLogger({ service }) {
  const logger: Logger = createLogger({
    level: 'info',
    defaultMeta: { service },
    transports: [
      new transports.Console({
        format: format.combine(format.prettyPrint()),
      }),
    ],
  });

  return logger;
}

const spawnProcess = async () => {
  try {
    process.on('message', async (msg: any) => {
      try {
        const lnd = await LndService.authenticatedLnd({ node: msg.args.node });

        const logger = await getLogger({ service: 'join-group-channel' });

        const result = await joinGroupChannel({
          lnd,
          logger,
          code: msg.args.code,
          max_rate: msg.args.max_rate,
        });

        process.send({ result });

        process.kill(msg.pid);
      } catch (err) {
        process.kill(msg.pid);
        throw err;
      }
    });

    process.on('exit', () => console.log('exiting process'));
  } catch (err) {
    console.error(err);
  }
};

spawnProcess();
