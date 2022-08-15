import React from 'react';
import Title from './Title';
import { Typography } from '@mui/material';
import { tokensAsBigTokens } from '~client/utils/constants';

// Renders the accounting summary section of the dashboard.

const AccountingSummary = ({ data }: { data: any[] }) => {
  const SetData = () => {
    if (!data.length) {
      return null;
    }

    // Sum all values in an array
    const chainFeesPaidTotal = tokensAsBigTokens(data[0].data.reduce((acc, curr) => acc + curr, 0));
    const routingFeesEarnedTotal = tokensAsBigTokens(data[1].data.reduce((acc, curr) => acc + curr, 0));
    const routingFeesPaidedTotal = tokensAsBigTokens(data[2].data.reduce((acc, curr) => acc + curr, 0));
    const paymentsReceivedTotal = tokensAsBigTokens(data[3].data.reduce((acc, curr) => acc + curr, 0));

    return (
      <>
        <React.Fragment>
          <Title>Accounting Summary</Title>
          <Typography color="text.secondary" variant="body1">{`ChainFeesPaid: ${chainFeesPaidTotal}`}</Typography>

          <Typography
            color="text.secondary"
            variant="body1"
          >{`RoutingFeesEarned: ${routingFeesEarnedTotal}`}</Typography>
          <Typography color="text.secondary" variant="body1">
            {`RoutingFeesPaid: ${routingFeesPaidedTotal}`}
          </Typography>
          <Typography color="text.secondary" variant="body1">{`PaymentsReceived: ${paymentsReceivedTotal}`}</Typography>
        </React.Fragment>
      </>
    );
  };
  return <SetData />;
};

export default AccountingSummary;
