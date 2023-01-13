import * as YAML from 'json-to-pretty-yaml';

import { CssBaseline, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import { StartFlexBox } from '~client/standard_components/app-components';
import { axiosGetWebSocket } from '~client/utils/axios';
import { io } from 'socket.io-client';
import { useRouter } from 'next/router';

const socket = io();

/*
  Renders the output of the rebalance command
  Listens to the websocket events for logging rebalance output to the browser
*/

const RebalanceResult = () => {
  const router = useRouter();

  const [data, setData] = useState(undefined);
  const output = [];

  useEffect(() => {
    if (!!data) {
      window.scroll({
        top: document.body.offsetHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [data]);

  useEffect(() => {
    const dateString = Date.now().toString();

    const query = {
      avoid: router.query.avoid,
      in_filters: router.query.in_filters,
      in_outbound: router.query.in_outbound,
      in_through: router.query.in_through,
      is_strict_max_fee_rate: router.query.is_strict_max_fee_rate,
      max_fee: router.query.max_fee,
      max_fee_rate: router.query.max_fee_rate,
      max_rebalance: router.query.max_rebalance,
      out_filters: router.query.out_filters,
      out_inbound: router.query.out_inbound,
      out_through: router.query.out_through,
      timeout_minutes: router.query.timeout_minutes,
      node: router.query.node,
      message_id: dateString,
    };

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.on(`${dateString}`, data => {
      const message = data.message;

      output.push(message.options || message);
      setData(YAML.stringify(output));
    });

    socket.on('error', err => {
      throw err;
    });

    const fetchData = async () => {
      const result = await axiosGetWebSocket({ path: 'rebalance', query });

      if (!!result) {
        output.push(result);
        setData(YAML.stringify(output));
      }

      socket.disconnect();
    };

    fetchData();
  }, []);

  return (
    <CssBaseline>
      <Head>
        <title>Rebalance Result</title>
      </Head>
      <StartFlexBox>
        <Stack spacing={3} style={styles.form}>
          <div style={styles.style}>
            <div style={styles.headerStyle} id={'rebalanceResultTitle'}>
              <strong>Paying Offchain...</strong>
            </div>

            {!!data && (
              <div id={'rebalanceResult'}>
                <pre style={styles.preStyle}>{data}</pre>
              </div>
            )}
          </div>
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

export default RebalanceResult;

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '900px',
  },
  pre: {
    fontweight: 'bold',
    color: 'white',
  },
  div: {
    marginLeft: '20px',
  },
  h1: {
    color: 'white',
  },
  headerStyle: {
    backgroundColor: '#193549',
    padding: '5px 10px',
    fontFamily: 'monospace',
    color: '#ffc600',
  },
  preStyle: {
    display: 'block',
    padding: '10px 30px',
    margin: '0',
    overflow: 'scroll',
  },
  style: {
    backgroundColor: '#1f4662',
    color: '#fff',
    fontSize: '12px',
  },
};
