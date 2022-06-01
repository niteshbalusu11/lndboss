import { CssBaseline, Stack } from '@mui/material';
import React from 'react';
import { ChartFeesEarnedOutput } from '../../output';
import { StartFlexBox } from '../../standard_components';

/*
  Renders the bos chart-chain-fees command output in chart format.
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginRight: '50px',
    marginTop: '100px',
    width: '700px',
  },
};

const ChartFeesEarnedResult = () => {
  const [data, setData] = React.useState({ data: [], title: '', description: '' });

  React.useEffect(() => {
    window.electronAPI.passArgs(async (_event: any, flags: any) => {
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
      <StartFlexBox>
        <Stack spacing={3} style={styles.form}>
          {!!data.data.length ? <ChartFeesEarnedOutput data={data} /> : <h2>Loading...</h2>}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default ChartFeesEarnedResult;
