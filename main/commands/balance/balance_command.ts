import { getBalance } from "balanceofsatoshis/balances";
import authenticatedLnd from "../../auth/authenticated_lnd";

const balanceCommand = async (args) => {
  try {
    const lnd = await authenticatedLnd();

    const result = await getBalance({
      lnd,
      above: args.above,
      below: args.below,
      is_confirmed: args.is_confirmed,
      is_offchain_only: args.is_offchain_only,
      is_onchain_only: args.is_onchain_only,
    });
    console.log(result);
    return { result };
  } catch (error) {
    return { error };
  }
};

export default balanceCommand;
