import { CssBaseline, Stack } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import { ChartFeesEarnedOutput } from '../../output';
import { StartFlexBox } from '../../standard_components';
import * as types from '../../types';

/*
  Renders the bos chart-chain-fees command output in chart format.
  IPC to the main process to get chart-fees earned data.
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginRight: '50px',
    marginTop: '50px',
    width: '700px',
  },
};

const ChartFeesEarnedResult = () => {
  const [data, setData] = React.useState({ data: [], title: '', description: '' });

  React.useEffect(() => {
    window.electronAPI.passArgs(async (_event: any, flags: types.commandChartFeesEarned) => {
      const { error, result } = await window.electronAPI.commandChartFeesEarned(flags);
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
        <title>Chart Fees Earned Result</title>
      </Head>
      <StartFlexBox>
        <Stack spacing={3} style={styles.form}>
          {!!data.data.length ? <ChartFeesEarnedOutput data={data} /> : <h2>Loading...</h2>}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default ChartFeesEarnedResult;
