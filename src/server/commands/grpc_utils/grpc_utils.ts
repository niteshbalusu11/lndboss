import { AuthenticatedLnd, SignMessageResult, signMessage } from 'lightning';

import { Logger } from '@nestjs/common';

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
  }
};
