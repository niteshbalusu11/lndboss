import { CssBaseline, Stack } from '@mui/material';
import React from 'react';
import { ChartChainFeesOutput } from '../../output';
import { StartFlexBox } from '../../standard_components';
import * as types from '../../types';

/*
  Renders the bos chart-chain-fees command output in chart format.
  IPC to the main process to get chain-fees data.
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginRight: '50px',
    marginTop: '50px',
    width: '700px',
  },
};

const ChartChainFeesResult = () => {
  const [data, setData] = React.useState({ data: [], title: '', description: '' });

  React.useEffect(() => {
    window.electronAPI.passArgs(async (_event: any, flags: types.commandChartChainFees) => {
      const { error, result } = await window.electronAPI.commandChartChainFees(flags);
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
      <StartFlexBox>
        <Stack spacing={3} style={styles.form}>
          {!!data.data.length ? <ChartChainFeesOutput data={data} /> : <h2>Loading...</h2>}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default ChartChainFeesResult;
