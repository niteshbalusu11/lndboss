import * as types from '~shared/types';

import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import commands, { globalCommands } from '~client/commands';

import { ClosedOutput } from '~client/output';
import Head from 'next/head';
import { axiosGet } from '~client/utils/axios';

const ClosedCommand = commands.find(n => n.value === 'Closed');

/*
  Renders the bos closed command
  GET call to the NestJs process to get closed transactions
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    minWidth: '700px',
  },
  textField: {
    width: '300px',
  },
  h4: {
    marginTop: '0px',
  },
};

const Closed = () => {
  const [node, setNode] = useState('');
  const [limit, setLimit] = useState('');
  const [data, setData] = useState(undefined);

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(event.target.value);
  };

  const fetchData = async () => {
    const query: types.commandClosed = {
      node,
      limit: Number(limit),
    };

    const result = await axiosGet({ path: 'closed', query });

    if (!!result) {
      setData(result);
    }

    return result;
  };

  return (
    <CssBaseline>
      <Head>
        <title>Closed</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{ClosedCommand.name}</h2>
          <h4>{ClosedCommand.longDescription}</h4>
          <TextField
            type={'text'}
            id={ClosedCommand.flags.limit}
            label={ClosedCommand.flags.limit}
            placeholder={'Limit (Default : 20)'}
            onChange={handleLimitChange}
            style={styles.textField}
          />
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
          {!!data ? <ClosedOutput data={data} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Closed;
