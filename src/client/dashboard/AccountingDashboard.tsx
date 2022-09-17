import * as types from '~shared/types';

import { Box, Container, Grid, Paper, Toolbar } from '@mui/material';
import {
  ChartChainFeesOutput,
  ChartFeesEarnedOutput,
  ChartFeesPaidOutput,
  ChartPaymentsReceivedOutput,
} from '~client/output';
import React, { useEffect, useState } from 'react';

import AccountingSummary from './AccountingSummary';
import BalanceInfo from './BalanceInfo';
import { axiosGetNoLoading } from '~client/utils/axios';
import resgisterCharts from '../register_charts';
import { selectedSavedNode } from '~client/utils/constants';
import { useLoading } from '~client/hooks/useLoading';

// Renders the accounting section of the dashboard.

const AccountingDashboard = ({ days }: { days: number }) => {
  const [chartChainFeesData, setChartChainFeesData] = useState({ data: [], title: '', description: '' });
  const [chartFeesEarnedData, setChartFeesEarnedData] = useState({ data: [], title: '', description: '' });
  const [chartFeesPaidData, setChartFeesPaidData] = useState({ data: [], title: '', description: '' });
  const [chartPaymentsReceivedData, setChartPaymentsReceivedData] = useState({ data: [], title: '', description: '' });
  const [accountingSummary, setAccountingSummary] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const nodes = [selectedSavedNode()];

      const chartChainFeesQuery: types.commandChartChainFees = {
        days,
        end_date: '',
        nodes,
        start_date: '',
      };

      const chartFeesEarnedQuery: types.commandChartFeesEarned = {
        days,
        end_date: '',
        nodes,
        is_count: false,
        is_forwarded: false,
        start_date: '',
        via: '',
      };

      const chartFeesPaidQuery: types.commandChartFeesPaid = {
        days,
        end_date: '',
        nodes,
        in: '',
        out: '',
        is_most_fees_table: false,
        is_most_forwarded_table: false,
        is_network: false,
        is_peer: false,
        is_rebalances_only: false,
        start_date: '',
      };

      const chartPaymentsReceivedQuery: types.commandChartPaymentsReceived = {
        days,
        nodes,
        end_date: '',
        is_count: false,
        query: '',
        start_date: '',
      };

      useLoading({ isLoading: true });
      const [chartChainFeesResult, chartFeesEarnedResult, chartFeesPaidResult, chartPaymentsReceivedResult] =
        await Promise.all([
          axiosGetNoLoading({ path: 'chart-chain-fees', query: chartChainFeesQuery }),
          axiosGetNoLoading({ path: 'chart-fees-earned', query: chartFeesEarnedQuery }),
          axiosGetNoLoading({ path: 'chart-fees-paid', query: chartFeesPaidQuery }),
          axiosGetNoLoading({ path: 'chart-payments-received', query: chartPaymentsReceivedQuery }),
        ]);

      if (!!chartChainFeesResult && !!chartFeesEarnedResult && !!chartFeesPaidResult && !!chartPaymentsReceivedResult) {
        setChartChainFeesData(chartChainFeesResult);
        setChartFeesEarnedData(chartFeesEarnedResult);
        setChartFeesPaidData(chartFeesPaidResult);
        setChartPaymentsReceivedData(chartPaymentsReceivedResult);

        const summary = [];
        summary.push(chartChainFeesResult);
        summary.push(chartFeesEarnedResult);
        summary.push(chartFeesPaidResult);
        summary.push(chartPaymentsReceivedResult);
        setAccountingSummary(summary);
      }
      useLoading({ isLoading: false });
    };

    fetchData();
  }, []);

  resgisterCharts();

  return (
    <Box
      component="main"
      sx={{
        background: 'linear-gradient(200.96deg, #fedc2a -29.09%, #dd5789 51.77%, #7a2c9e 129.35%)',
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Balance Info */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <BalanceInfo />
            </Paper>
          </Grid>
          {/* Accounting Summary */}
          <Grid item xs={12} md={5} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <AccountingSummary data={accountingSummary} />
            </Paper>
          </Grid>

          {/* ChartChainFeesOutput */}
          <Grid item xs={12} md={8} lg={11}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              {!!chartChainFeesData.data.length ? <ChartChainFeesOutput data={chartChainFeesData} /> : null}
            </Paper>
          </Grid>

          {/* ChartFeesEarnedOutput */}
          <Grid item xs={12} md={8} lg={11}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              {!!chartFeesEarnedData.data.length ? <ChartFeesEarnedOutput data={chartFeesEarnedData} /> : null}
            </Paper>
          </Grid>

          {/* ChartFeesPaidOutput */}
          <Grid item xs={12} md={8} lg={11}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              {!!chartFeesPaidData.data.length ? <ChartFeesPaidOutput data={chartFeesPaidData} /> : null}
            </Paper>
          </Grid>

          {/* ChartPaymentsReceivedOutput */}
          <Grid item xs={12} md={8} lg={11}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              {!!chartPaymentsReceivedData.data.length ? (
                <ChartPaymentsReceivedOutput data={chartPaymentsReceivedData} />
              ) : null}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AccountingDashboard;
