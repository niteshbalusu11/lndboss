import * as types from '~shared/types';

import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import commands, { globalCommands } from '~client/commands';

import Head from 'next/head';
import ReconnectOutput from '~client/output/ReconnectOutput';
import { axiosGet } from '~client/utils/axios';

/*
  Renders the bos reconnect command
  GET call to the NestJs process to attempt to reconnect to offline peers
*/

const ReconnectCommand = commands.find(n => n.value === 'Reconnect');

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '800px',
  },
  textField: {
    width: '500px',
  },
  h4: {
    marginTop: '0px',
  },
};

const Reconnect = () => {
  const [node, setNode] = useState('');
  const [data, setData] = useState(undefined);
  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const fetchData = async () => {
    const query: types.commandReconnect = {
      node,
    };
    const result = await axiosGet({ path: 'reconnect', query });

    if (!!result) {
      setData(result);
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Reconnect</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{ReconnectCommand.name}</h2>
          <h4 style={styles.h4}>{ReconnectCommand.longDescription}</h4>
          <TextField
            type="text"
            placeholder={globalCommands.node.name}
            label={globalCommands.node.name}
            id={globalCommands.node.value}
            onChange={handeNodeChange}
            style={styles.textField}
          />
          <SubmitButton variant="contained" onClick={fetchData}>
            Run Command
          </SubmitButton>
          {!!data && !!data ? <ReconnectOutput data={data} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Reconnect;
