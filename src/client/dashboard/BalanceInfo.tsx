import * as types from '~shared/types';

import React, { useEffect, useState } from 'react';

import Title from './Title';
import Typography from '@mui/material/Typography';
import { axiosGet } from '~client/utils/axios';
import { selectedSavedNode } from '~client/utils/constants';

const BalanceInfo = () => {
  const [offchainBalance, setOffchainBalance] = useState(0);
  const [onchainBalance, setOnchainBalance] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [inboundLiquidity, setInboundLiquidity] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const balanceQuery: types.commandBalance = {
        above: 0,
        below: 0,
        is_confirmed: true,
        is_detailed: false,
        is_offchain_only: false,
        is_onchain_only: false,
        node: selectedSavedNode(),
      };

      const onchainQuery: types.commandBalance = {
        above: 0,
        below: 0,
        is_confirmed: true,
        is_detailed: false,
        is_offchain_only: false,
        is_onchain_only: true,
        node: selectedSavedNode(),
      };

      const inboundLiquidityQuery = {
        node: selectedSavedNode(),
      };

      const [balance, onchain, inbound] = await Promise.all([
        axiosGet({ path: 'balance', query: balanceQuery }),
        axiosGet({ path: 'balance', query: onchainQuery }),
        axiosGet({ path: 'grpc/get-channel-balance', query: inboundLiquidityQuery }),
      ]);

      if (!!balance) {
        setOffchainBalance(balance.ChannelBalance);
        setTotalBalance(balance.Balance);
      }

      if (!!onchain) {
        setOnchainBalance(onchain.Balance);
      }

      if (!!inbound) {
        setInboundLiquidity(inbound.inbound);
      }
    };

    fetchData();
  }, []);
  return (
    <React.Fragment>
      <Title>Balance Info</Title>
      <Typography component="p" variant="h5" style={{ marginBottom: '20px' }}>
        {`Balance: ${totalBalance}`}
      </Typography>
      <Typography color="text.secondary" variant="body1">{`Offchain Balance: ${offchainBalance}`}</Typography>
      <Typography color="text.secondary" variant="body1">
        {`Onchain Balance: ${onchainBalance}`}
      </Typography>
      <Typography color="text.secondary" variant="body1">{`Inbound Liquidity: ${inboundLiquidity}`}</Typography>
    </React.Fragment>
  );
};

export default BalanceInfo;
