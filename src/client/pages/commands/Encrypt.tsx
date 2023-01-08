import * as types from '~shared/types';

import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import commands, { globalCommands } from '~client/commands';

import { EncryptOutput } from '~client/output';
import Head from 'next/head';
import { axiosPostWithAlert } from '~client/utils/axios';

const EncryptCommand = commands.find(n => n.value === 'Encrypt');

/*
  Renders the bos encrypt command
  POST call to the NestJs process to get encrypt data
*/

const Encrypt = () => {
  const [data, setData] = useState(undefined);
  const [message, setMessage] = useState('');
  const [node, setNode] = useState('');
  const [to, setTo] = useState('');

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTo(event.target.value);
  };

  const fetchData = async () => {
    const postBody: types.commandEncrypt = {
      message,
      node,
      to,
    };

    const result = await axiosPostWithAlert({ path: 'encrypt', postBody });

    if (!!result) {
      setData(result.result);
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Encrypt</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{EncryptCommand.name}</h2>
          <h4 style={styles.h4}>{EncryptCommand.description}</h4>
          <TextField
            type="text"
            placeholder="Data to encrypt"
            label={EncryptCommand.flags.message}
            id={EncryptCommand.flags.message}
            onChange={handleMessageChange}
            style={styles.textField}
          />

          <TextField
            type="text"
            placeholder="Encrypt to pubkey (Default: self)"
            label={EncryptCommand.flags.to}
            id={EncryptCommand.flags.to}
            onChange={handleToChange}
            style={styles.textField}
          />

          <TextField
            type="text"
            placeholder={globalCommands.node.name}
            label={globalCommands.node.name}
            id={globalCommands.node.value}
            onChange={handleNodeChange}
            style={styles.textField}
          />
          <SubmitButton variant="contained" onClick={fetchData}>
            Run Command
          </SubmitButton>
          {!!data && !!data.encrypted ? <EncryptOutput data={data} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Encrypt;

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '700px',
  },
  textField: {
    width: '500px',
  },
  h4: {
    marginTop: '0px',
  },
};
