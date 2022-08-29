import { Box, Container, Grid, Paper, Toolbar } from '@mui/material';

import BalanceInfo from './BalanceInfo';
import NodeInfo from '~client/dashboard/NodeInfo';
import RoutingFeeChart from './RoutingFeeChart';

// Renders the default dashboard on page load.

const DefaultDashboardContainer = () => {
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
          {/* Walletinfo */}
          <Grid item xs={12} md={5} lg={8}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <NodeInfo />
            </Paper>
          </Grid>
          {/* Chart */}
          <Grid item xs={12} md={5} lg={11}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: 800,
              }}
            >
              <RoutingFeeChart />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DefaultDashboardContainer;
