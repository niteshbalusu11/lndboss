import { CssBaseline, Stack } from '@mui/material';

import { ChartFeesEarnedOutput } from '../../output';
import Head from 'next/head';
import React from 'react';
import { StartFlexBox } from '../../standard_components/app-components';
import { axiosGet } from '~client/utils/axios';
import { useRouter } from 'next/router';

/*
  Renders the bos chart-chain-fees command output in chart format.
  GET call to the  NestJs process to get Chart Fees Earned data.
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
    end_date: router.query.end_date,
    via: router.query.via,
    is_count: router.query.is_count,
    is_forwarded: router.query.is_forwarded,
    nodes: router.query.nodes,
    start_date: router.query.start_date,
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
          {!!data.data.length ? <ChartFeesEarnedOutput data={data} /> : null}
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
