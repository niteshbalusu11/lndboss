import * as YAML from 'json-to-pretty-yaml';

import React, { useEffect, useState } from 'react';

import { CssBaseline } from '@mui/material';
import Head from 'next/head';
import StartFlexBoxBlack from '~client/standard_components/StartFlexBoxBlack';
import { axiosGetWebSocket } from '~client/utils/axios';
import { io } from 'socket.io-client';
import stripAnsi from 'strip-ansi';
import { useRouter } from 'next/router';

const socket = io();
const stringify = (n: object) => JSON.stringify(n);

/*
  Renders the output of the send command
  Listens to the websocket events for logging send output to the browser
*/

const parseAnsi = (n: string) => {
  try {
    const parsed = JSON.parse(n);
    if (!!parsed.options && !!parsed.options.evaluating && !!parsed.options.evaluating.length) {
      parsed.options.evaluating = parsed.options.evaluating.map((n: string) => stripAnsi(n));
    }

    return parsed;
  } catch (e) {
    return n;
  }
};

const styles = {
  pre: {
    fontweight: 'bold',
    color: 'white',
  },
  div: {
    color: 'white',
    marginLeft: '20px',
  },
};

const SendResult = () => {
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
      amount: router.query.amount,
      avoid: router.query.avoid,
      destination: router.query.destination,
      in_through: router.query.in_through,
      is_dry_run: router.query.is_dry_run,
      is_omitting_message_from: router.query.is_omitting_message_from,
      max_fee: router.query.max_fee,
      max_fee_rate: router.query.max_fee_rate,
      message: router.query.message,
      message_id: dateString,
      node: router.query.node,
      out_through: router.query.out_through,
    };

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.on(`${dateString}`, data => {
      const message = parseAnsi(stringify(data.message));

      output.push(YAML.stringify(message));

      setData(output.toString());
    });

    socket.on('error', err => {
      throw err;
    });

    const fetchData = async () => {
      const result = await axiosGetWebSocket({ path: 'send', query });

      if (!!result) {
        output.push(YAML.stringify(result));
        setData(output.toString());
      }
    };

    fetchData();
  }, []);

  return (
    <CssBaseline>
      <Head>
        <title>Send Result</title>
      </Head>
      <StartFlexBoxBlack>
        <div style={styles.div}>
          <h1 id={'sendResultTitle'}>Paying offchain...</h1>
          {!!data && (
            <div id={'sendResult'}>
              <pre style={styles.pre}>{data}</pre>
            </div>
          )}
        </div>
      </StartFlexBoxBlack>
    </CssBaseline>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default SendResult;
