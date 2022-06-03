import { CssBaseline, Stack } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import { ChartFeesPaidOutput, ChartFeesPaidOutputTable } from '../../output';
import { StartFlexBox } from '../../standard_components';
import * as types from '../../types';

/*
  Renders the bos chart-chain-fees command output in chart format.
  IPC to the main process to get fees paid data.
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginRight: '50px',
    marginTop: '50px',
    midWidth: '600px',
  },
};

const ChartFeesPaidResult = () => {
  const [data, setData] = React.useState({ data: [], title: '', description: '', rows: [] });

  React.useEffect(() => {
    window.electronAPI.passArgs(async (_event: any, flags: types.commandChartFeesPaid) => {
      const { error, result } = await window.electronAPI.commandChartFeesPaid(flags);
      if (!!error) {
        window.alert(error);
        return;
      }

      if (!!result) {
        setData(result);
      }
    });
  }, []);

  return (
    <CssBaseline>
      <Head>
        <title>Chart Fees Paid Result</title>
      </Head>
      <StartFlexBox>
        <Stack spacing={3} style={styles.form}>
          {!!data.rows && !!data.rows.length ? <ChartFeesPaidOutputTable data={data} /> : null}
          {!!data.data.length ? <ChartFeesPaidOutput data={data} /> : <h2>Loading...</h2>}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default ChartFeesPaidResult;
