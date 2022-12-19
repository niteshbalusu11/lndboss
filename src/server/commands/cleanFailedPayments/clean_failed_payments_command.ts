import { cleanFailedPayments } from 'balanceofsatoshis/wallets';

/** Clean out failed payments from the wallet

  {
    is_dry_run: <Avoid Actually Deleting Payments>
    lnd: <Authenticated LND API Object>
    logger: <Winston Logger Object>
  }

  @returns via Promise
  {
    [total_failed_payments_found]: <Failed Payments Found Number>
    [total_failed_payments_deleted]: <Failed Payments Deleted Number>
  }
*/

const cleanFailedPaymentsCommand = async ({ args, lnd, logger }) => {
  const result = await cleanFailedPayments({
    lnd,
    logger,
    is_dry_run: args.is_dry_run,
  });

  return { result };
};

export default cleanFailedPaymentsCommand;
