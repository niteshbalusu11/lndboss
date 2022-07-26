import * as YAML from 'json-to-pretty-yaml';

import React, { useEffect, useState } from 'react';

import { CssBaseline } from '@mui/material';
import Head from 'next/head';
import { StartFlexBoxBlack } from '~client/standard_components/app-components';
import { axiosGetWebSocket } from '~client/utils/axios';
import { io } from 'socket.io-client';
import stripAnsi from 'strip-ansi';
import { useRouter } from 'next/router';

const socket = io();
const stringify = (n: object) => JSON.stringify(n);
const { isArray } = Array;

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
    if (
      !!parsed.options &&
      !!parsed.options.probing &&
      !!isArray(parsed.options.probing) &&
      !!parsed.options.probing.length
    ) {
      parsed.options.probing = parsed.options.probing.map((n: string) => stripAnsi(n));
    }

    if (!!parsed.options && !!parsed.options.total_liquidity && !!parsed.options.total_liquidity.length) {
      parsed.options.total_liquidity = stripAnsi(parsed.options.total_liquidity);
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
    marginLeft: '20px',
  },
  h1: {
    color: 'white',
  },
};

const ProbeResult = () => {
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
    console.log(dateString);
    const query = {
      avoid: router.query.avoid,
      destination: router.query.destination,
      in_through: router.query.in_through,
      find_max: router.query.find_max,
      max_paths: router.query.max_paths,
      message_id: dateString,
      node: router.query.node,
      out: router.query.out,
      tokens: router.query.tokens,
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
      const result = await axiosGetWebSocket({ path: 'probe', query });

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
        <title>Probe Result</title>
      </Head>
      <StartFlexBoxBlack>
        <div style={styles.div}>
          <h1 id={'probeResultTitle'} style={styles.h1}>
            Probing...
          </h1>
          {!!data && (
            <div id={'probeResult'}>
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

export default ProbeResult;
