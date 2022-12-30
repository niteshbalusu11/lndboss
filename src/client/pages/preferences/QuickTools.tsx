import { Button, ButtonProps, CssBaseline } from '@mui/material';
import { CenterFlexBox, StandardHomeButtonLink } from '~client/standard_components/app-components';
import {
  CreateChainAddress,
  CreateInvoice,
  PayInvoice,
  SendOnchain,
} from '~client/standard_components/app-components/quicktools';
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import Grid from '@mui/material/Unstable_Grid2';
import Head from 'next/head';
import LinkIcon from '@mui/icons-material/Link';
import PaymentIcon from '@mui/icons-material/Payment';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

const QuickTools = () => {
  const [action, setAction] = useState('');

  return (
    <CssBaseline>
      <Head>
        <title>Quick Tools</title>
      </Head>
      <CenterFlexBox>
        <StandardHomeButtonLink />
        <Box sx={{ margin: '100px', width: '50%' }}>
          <h1>Quick Tools</h1>
          <Grid container spacing={2}>
            <Grid>
              <ColorButton onClick={() => setAction(tools.invoice)}>
                {tools.invoice}
                <RequestPageIcon />
              </ColorButton>
            </Grid>

            <Grid>
              <ColorButton onClick={() => setAction(tools.chainAddress)}>
                {tools.chainAddress}
                <LinkIcon />
              </ColorButton>
            </Grid>

            <Grid>
              <ColorButton onClick={() => setAction(tools.payInvoice)}>
                {tools.payInvoice}
                <PaymentIcon />
              </ColorButton>
            </Grid>

            <Grid>
              <ColorButton onClick={() => setAction(tools.sendOnchain)}>
                {tools.sendOnchain}
                <CurrencyBitcoinIcon />
              </ColorButton>
            </Grid>
          </Grid>
          {action === tools.chainAddress ? <CreateChainAddress /> : null}
          {action === tools.invoice ? <CreateInvoice /> : null}
          {action === tools.payInvoice ? <PayInvoice /> : null}
          {action === tools.sendOnchain ? <SendOnchain /> : null}
        </Box>
      </CenterFlexBox>
    </CssBaseline>
  );
};

export default QuickTools;

const tools = {
  invoice: 'Create Invoice',
  chainAddress: 'Create OnChain Address',
  payInvoice: `Pay Lightning Invoice`,
  sendOnchain: 'Pay Onchain Address',
};

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(grey[900]),
  backgroundColor: grey[900],
  '&:hover': {
    backgroundColor: grey[800],
  },
  fontWeight: 'bold',
  fontSize: '12px',
  width: '120px',
  height: '120px',
  flexWrap: 'wrap',
}));
