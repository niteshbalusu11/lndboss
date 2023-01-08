import * as types from '~shared/types';

import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import commands, { globalCommands } from '~client/commands';

import { DecryptOutput } from '~client/output';
import Head from 'next/head';
import { axiosPostWithAlert } from '~client/utils/axios';

const DecryptCommand = commands.find(n => n.value === 'Decrypt');

/*
  Renders the bos Decrypt command
  POST call to the NestJs process to get decrypt data
*/

const Decrypt = () => {
  const [data, setData] = useState(undefined);
  const [encrypted, setEncrypted] = useState('');
  const [node, setNode] = useState('');

  const handleEncryptedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEncrypted(event.target.value);
  };

  const handleNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const fetchData = async () => {
    const postBody: types.commandDecrypt = {
      encrypted,
      node,
    };

    const result = await axiosPostWithAlert({ path: 'decrypt', postBody });

    if (!!result) {
      setData(result.result);
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Decrypt</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{DecryptCommand.name}</h2>
          <h4 style={styles.h4}>{DecryptCommand.description}</h4>
          <TextField
            type="text"
            placeholder="Data to decrypt"
            label={DecryptCommand.args.encrypted}
            id={DecryptCommand.args.encrypted}
            onChange={handleEncryptedChange}
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
          {!!data ? <DecryptOutput data={data} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Decrypt;

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
