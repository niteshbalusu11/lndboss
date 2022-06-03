import { CssBaseline, Stack } from '@mui/material';
import React from 'react';
import { ChartPaymentsReceivedOutput } from '../../output';
import { StartFlexBox } from '../../standard_components';
import * as types from '../../types';

/*
  Renders the bos chart-payments-received command output in chart format.
  IPC to the main process to get offchain-payments-received.
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginRight: '50px',
    marginTop: '50px',
    width: '700px',
  },
};

const ChartPaymentsReceivedResult = () => {
  const [data, setData] = React.useState({ data: [], title: '', description: '' });

  React.useEffect(() => {
    window.electronAPI.passArgs(async (_event: any, flags: types.commandChartPaymentsReceived) => {
      const { error, result } = await window.electronAPI.commandChartPaymentsReceived(flags);
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
          {!!data.data.length ? <ChartPaymentsReceivedOutput data={data} /> : <h2>Loading...</h2>}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default ChartPaymentsReceivedResult;
