import {
  AuthenticatedLnd,
  GetChannelBalanceResult,
  GetWalletInfoResult,
  SignMessageResult,
  getChannelBalance,
  getWalletInfo,
  signMessage,
} from 'lightning';

import { Logger } from '@nestjs/common';
import { httpLogger } from '~server/utils/global_functions';

/**
 * Signs a message with the given lnd node.
 {
    lnd: <AuthenticatedLnd>,
    message: <Message String>,
 }
  @returns
  {
    result: <SignMessageResult>,
  }
 */

type SignMessage = {
  lnd: AuthenticatedLnd;
  message: string;
};

export const signature = async ({ lnd, message }: SignMessage): Promise<{ result: SignMessageResult }> => {
  try {
    const result: SignMessageResult = await signMessage({
      lnd,
      message,
    });

    return { result };
  } catch (error) {
    Logger.error(error);
    httpLogger({ error });
  }
};

/**
 * Returns the wallet info for the given lnd node.
 {
    lnd: <AuthenticatedLnd>,
 }
  @returns
  {
    result: <GetWalletInfoResult>,
  }
 */
export const walletInfo = async ({ lnd }: { lnd: AuthenticatedLnd }): Promise<{ result: GetWalletInfoResult }> => {
  try {
    const result = await getWalletInfo({ lnd });

    return { result };
  } catch (error) {
    Logger.error(error);
    httpLogger({ error });
  }
};

/**
 * Get balance across channels.
{
  lnd: <Authenticated LND API Object>
}

@returns via Promise
{
  result: <GetChannelBalanceResult>,
}
 */
export const channelBalance = async ({
  lnd,
}: {
  lnd: AuthenticatedLnd;
}): Promise<{ result: GetChannelBalanceResult }> => {
  try {
    const result = await getChannelBalance({ lnd });

    return { result };
  } catch (error) {
    Logger.error(error);
    httpLogger({ error });
  }
};
