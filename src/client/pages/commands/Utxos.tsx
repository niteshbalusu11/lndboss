import * as types from '~shared/types';

import { CssBaseline, FormControlLabel, TextField } from '@mui/material';
import React, { useState } from 'react';
import {
  StandardHomeButtonLink,
  StandardSwitch,
  StartFlexBox,
  SubmitButton,
} from '~client/standard_components/app-components';
import commands, { globalCommands } from '~client/commands';

import Head from 'next/head';
import { Stack } from '@mui/system';
import UtxosOutput from '~client/output/UtxosOutput';
import { axiosPostWithAlert } from '~client/utils/axios';

const UtxosCommand = commands.find(n => n.value === 'Utxos');

/*
  Renders the bos utxos command
  GET call to the NestJs process to utxos information
*/

const Utxos = () => {
  const [countBelow, setCountBelow] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [count, setCount] = useState(false);
  const [data, setData] = useState(undefined);
  const [node, setNode] = useState('');
  const [size, setSize] = useState('');

  const handleCountBelowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCountBelow(event.target.value);
  };

  const handleConfirmedChange = () => {
    setConfirmed((previousState: boolean) => !previousState);
  };

  const handleCountChange = () => {
    setCount((previousState: boolean) => !previousState);
  };

  const handleNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(event.target.value);
  };

  const fetchData = async () => {
    const body: types.commandUtxos = {
      node,
      count_below: Number(countBelow),
      is_confirmed: confirmed,
      is_count: count,
      min_tokens: Number(size),
    };

    const result = await axiosPostWithAlert({ path: 'utxos', postBody: body });

    if (!!result) {
      setData(result);
    }
  };
  return (
    <CssBaseline>
      <Head>
        <title>Utxos</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{UtxosCommand.name}</h2>
          <h4>{UtxosCommand.description}</h4>
          <TextField
            type={'text'}
            id={UtxosCommand.flags.count_below}
            label={UtxosCommand.flags.count_below}
            placeholder={'Return only count below number (optional)'}
            onChange={handleCountBelowChange}
            style={styles.textField}
          />
          <FormControlLabel
            control={
              <StandardSwitch checked={confirmed} onChange={handleConfirmedChange} id={UtxosCommand.flags.confirmed} />
            }
            label={UtxosCommand.flags.confirmed}
          />
          <FormControlLabel
            control={<StandardSwitch checked={count} onChange={handleCountChange} id={UtxosCommand.flags.count} />}
            label={UtxosCommand.flags.count}
          />
          <TextField
            type={'text'}
            id={UtxosCommand.flags.size}
            label={UtxosCommand.flags.size}
            placeholder={'UTXOs of size greater than or equal to specified amount (optional)'}
            onChange={handleSizeChange}
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
          {!!data ? <UtxosOutput data={data} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Utxos;

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    minWidth: '700px',
  },
  textField: {
    width: '550px',
  },
  h4: {
    marginTop: '0px',
  },
};
