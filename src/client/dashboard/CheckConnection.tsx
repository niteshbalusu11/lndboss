import { Box, Container, Grid, Paper, Toolbar } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { axiosGetNoLoading } from '~client/utils/axios';
import { selectedSavedNode } from '~client/utils/constants';

// Checks connection and renders failure dialog on dashboard if connection fails and returns true if connection is successful.

type Args = {
  setCheckConnection: (previousValue: any) => void;
};
const CheckConnection = ({ setCheckConnection }: Args) => {
  const [success, isSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const query = {
        node: selectedSavedNode(),
      };

      const result = await axiosGetNoLoading({ path: 'grpc/get-wallet-info', query });

      if (!!result) {
        setCheckConnection(previousValue => !previousValue);
        isSuccess(true);
      } else {
        isSuccess(false);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {success === null && null}
      {success === false ? (
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
              <Grid item xs={12} md={10} lg={10}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <h1>Connection to LND Failed</h1>
                  <h3>Check connection or Authenticate to LND</h3>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      ) : null}
    </>
  );
};

export default CheckConnection;
