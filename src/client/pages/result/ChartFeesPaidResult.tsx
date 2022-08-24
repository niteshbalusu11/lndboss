import { CssBaseline, Stack } from '@mui/material';
import { StandardTableOutput, StartFlexBox } from '../../standard_components/app-components';

import { ChartFeesPaidOutput } from '../../output';
import Head from 'next/head';
import React from 'react';
import { axiosGet } from '~client/utils/axios';
import { useRouter } from 'next/router';

/*
  Renders the bos chart-chain-fees command output in chart format.
  GET call to the  NestJs process to get Chart Fees Paid data.
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
  const router = useRouter();

  const query = {
    days: router.query.days,
    end_date: router.query.end_date,
    in: router.query.in,
    is_most_fees_table: router.query.is_most_fees_table,
    is_most_forwarded_table: router.query.is_most_forwarded_table,
    is_network: router.query.is_network,
    is_peer: router.query.is_peer,
    is_rebalances_only: router.query.is_rebalances_only,
    nodes: router.query.nodes,
    out: router.query.out,
    start_date: router.query.start_date,
  };

  const [data, setData] = React.useState({ data: [], title: '', description: '', rows: [] });

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axiosGet({ path: 'chart-fees-paid', query });

      if (!!result) {
        setData(result);
      }
    };

    fetchData();
  }, []);

  return (
    <CssBaseline>
      <Head>
        <title>Chart Fees Paid Result</title>
      </Head>
      <StartFlexBox>
        <Stack spacing={3} style={styles.form}>
          {!!data.rows && !!data.rows.length ? <StandardTableOutput data={data} tableId="ChartFeesPaidResult" /> : null}
          {!!data.data.length ? <ChartFeesPaidOutput data={data} /> : null}
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

export default ChartFeesPaidResult;
