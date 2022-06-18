import { certExpiration, pemAsDer } from 'balanceofsatoshis/encryption';

import { lndCredentials } from '~server/lnd';
import { logger } from '~server/utils/global_functions';

const base64AsString = base64 => Buffer.from(base64, 'base64').toString();
const bufferAsHex = buffer => buffer.toString('hex');
const msPerDay = 1000 * 60 * 60 * 24;
const { round } = Math;

/** Get the number of days until the certificate expires
  {
    node: <String>
    [below]: <Number>
  }

  @returns via Promise
  {
    days: <Number>
  }
 */

const certValidityDaysCommand = async ({ below, node }): Promise<{ result: number }> => {
  try {
    const credentials = await lndCredentials({ node });

    const pem = base64AsString(credentials.cert);

    const cert = bufferAsHex(pemAsDer({ pem }).der);

    const expiryDate: any = new Date(certExpiration({ cert }).expires_at);

    const date: any = new Date();

    const valid = round((expiryDate - date) / msPerDay);

    const days = !below ? valid : valid < below ? below - valid : 0;

    return { result: round(days) };
  } catch (error) {
    logger({ error });
  }
};

export default certValidityDaysCommand;
