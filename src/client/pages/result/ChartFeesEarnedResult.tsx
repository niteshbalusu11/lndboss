import { CssBaseline, Stack } from '@mui/material';

import { ChartFeesEarnedOutput } from '../../output';
import Head from 'next/head';
import React from 'react';
import { StartFlexBox } from '../../standard_components';
import { axiosGet } from '~client/axios/axios';
import { useRouter } from 'next/router';

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
  const router = useRouter();

  const query = {
    days: router.query.days,
    via: router.query.via,
    is_count: router.query.is_count,
    is_forwarded: router.query.is_forwarded,
    nodes: router.query.nodes,
  };

  const [data, setData] = React.useState({ data: [], title: '', description: '' });

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axiosGet({ path: 'chart-fees-earned', query });

      if (!!result) {
        setData(result);
      }
    };

    fetchData();
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

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default ChartFeesEarnedResult;
