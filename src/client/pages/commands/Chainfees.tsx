import * as types from '~shared/types';

import { CssBaseline, FormControlLabel, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import {
  StandardHomeButtonLink,
  StandardSwitch,
  StartFlexBox,
  SubmitButton,
} from '~client/standard_components/app-components';
import commands, { globalCommands } from '../../commands';

import { ChainfeesOutput } from '~client/output';
import Head from 'next/head';
import { axiosGet } from '~client/utils/axios';

const ChainfeesCommand = commands.find(n => n.value === 'Chainfees');

/*
  Renders the bos chainfees command
  GET call to the NestJs process to get chainfees information
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
  switch: {
    width: '100px',
  },
};

const Chainfees = () => {
  const [blocks, setBlocks] = useState('');
  const [file, setFile] = useState(false);
  const [node, setNode] = useState('');
  const [data, setData] = useState(undefined);

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleFileChange = () => {
    setFile((previousState: boolean) => !previousState);
  };

  const handleBlocksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlocks(event.target.value);
  };

  const fetchData = async () => {
    const query: types.commandChainfees = {
      file,
      node,
      blocks: Number(blocks),
    };

    const result = await axiosGet({ path: 'chainfees', query });

    if (!!result) {
      setData(result);
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Chain Fees</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{ChainfeesCommand.name}</h2>
          <h4 style={styles.h4}>{ChainfeesCommand.description}</h4>
          <TextField
            type="text"
            placeholder="Above (Number)"
            label={ChainfeesCommand.flags.blocks}
            id={ChainfeesCommand.flags.blocks}
            onChange={handleBlocksChange}
            style={styles.textField}
          />
          <FormControlLabel
            style={styles.switch}
            control={<StandardSwitch checked={file} onChange={handleFileChange} id={ChainfeesCommand.flags.file} />}
            label={ChainfeesCommand.flags.file}
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
          {!!data ? <ChainfeesOutput data={data} file={file} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Chainfees;
