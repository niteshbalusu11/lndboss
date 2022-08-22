import * as YAML from 'json-to-pretty-yaml';

import React, { useEffect, useState } from 'react';

import { CssBaseline } from '@mui/material';
import Head from 'next/head';
import { StartFlexBoxBlack } from '~client/standard_components/app-components';
import { axiosGetWebSocket } from '~client/utils/axios';
import { io } from 'socket.io-client';
import { useRouter } from 'next/router';

const socket = io();

/*
  Renders the output of the lnurl command
  Listens to the websocket events for logging lnurl output to the browser
*/

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

const LnurlResult = () => {
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
      function: router.query.function,
      is_private: router.query.is_private,
      max_fee: router.query.max_fee,
      max_paths: router.query.max_paths,
      message_id: dateString,
      node: router.query.node,
      out: router.query.out,
      url: router.query.url,
    };

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.on(`${dateString}`, data => {
      const message = data.message;

      output.push(YAML.stringify(message));

      setData(output.toString());
    });

    socket.on('error', err => {
      throw err;
    });

    const fetchData = async () => {
      const result = await axiosGetWebSocket({ path: 'lnurl', query });

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
        <title>Lnurl Result</title>
      </Head>
      <StartFlexBoxBlack>
        <div style={styles.div}>
          <h1 id={'lnurlResultTitle'} style={styles.h1}>
            {router.query.function}
          </h1>
          {!!data && (
            <div id={'lnurlResult'}>
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

export default LnurlResult;
