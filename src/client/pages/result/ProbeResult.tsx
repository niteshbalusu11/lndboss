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
  Renders the output of the send command
  Listens to the websocket events for logging send output to the browser
*/

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
      const message = data.message;

      output.push(message.options || message);
      setData(YAML.stringify(output));
    });

    socket.on('error', err => {
      throw err;
    });

    const fetchData = async () => {
      const result = await axiosGetWebSocket({ path: 'probe', query });

      if (!!result) {
        output.push(result);
        setData(YAML.stringify(output));
      }
    };

    fetchData();
  }, []);

  return (
    <CssBaseline>
      <Head>
        <title>Probe Result</title>
      </Head>
      <StartFlexBox>
        <Stack spacing={3} style={styles.form}>
          <div style={styles.style}>
            <div style={styles.headerStyle} id={'probeResultTitle'}>
              <strong>Probing...</strong>
            </div>

            {!!data && (
              <div id={'probeResult'}>
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

export default ProbeResult;

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
