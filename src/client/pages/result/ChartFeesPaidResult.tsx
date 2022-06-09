import { ChartFeesPaidOutput, ChartFeesPaidOutputTable } from '../../output';
import { CssBaseline, Stack } from '@mui/material';

import Head from 'next/head';
import React from 'react';
import { StartFlexBox } from '../../standard_components';
import axios from 'axios';
import { useRouter } from 'next/router';

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
  const router = useRouter();

  const query = {
    days: router.query.days,
    in: router.query.in,
    is_most_fees_table: router.query.is_most_fees_table,
    is_most_forwarded_table: router.query.is_most_forwarded_table,
    is_network: router.query.is_network,
    is_peer: router.query.is_peer,
    is_rebalances_only: router.query.is_rebalances_only,
    nodes: router.query.nodes,
    out: router.query.out,
  };

  const [data, setData] = React.useState({ data: [], title: '', description: '', rows: [] });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8055/api/chart-fees-paid`, {
          params: query,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const { error, result } = await response.data;

        if (!!error) {
          window.alert(error);
        }
        if (!!result) {
          setData(result);
        }
      } catch (error) {
        window.alert(`Status: ${error.response.data.statusCode}\nMessage: ${error.response.data.message}`);
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
          {!!data.rows && !!data.rows.length ? <ChartFeesPaidOutputTable data={data} /> : null}
          {!!data.data.length ? <ChartFeesPaidOutput data={data} /> : <h2>Loading...</h2>}
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
