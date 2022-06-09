import * as types from '../../shared/types';

import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardButtonLink, StartFlexBox, SubmitButton } from '../standard_components';
import commands, { globalCommands } from '../commands';

import { ChainDepositOutput } from '../output';
import Head from 'next/head';
import axios from 'axios';

/*
  Renders the bos chain-deposit command
  Sends IPC to the main process to get chain address
*/

const ChainDepositCommand = commands.find(n => n.value === 'ChainDeposit');

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '700px',
  },
  textField: {
    width: '300px',
  },
  h4: {
    marginTop: '0px',
  },
};

const ChainDeposit = () => {
  const [amount, setAmount] = useState('');
  const [data, setData] = useState({ address: '', url: '' });
  const [node, setNode] = useState('');

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const fetchData = async () => {
    const flags: types.commandChainDeposit = {
      node,
      amount: Number(amount),
    };

    try {
      const response = await axios.get('http://localhost:8055/api/chain-deposit', {
        params: flags,
        headers: { 'Content-Type': 'application/json' },
      });
      const { error, result } = await response.data;

      if (!!error) {
        window.alert(error);
        return;
      }

      if (!!result) {
        setData(result);
      }
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Chain Deposit</title>
      </Head>
      <StartFlexBox>
        <StandardButtonLink label="Home" destination="/Commands" />
        <Stack spacing={3} style={styles.form}>
          <h2>{ChainDepositCommand.name}</h2>
          <h4 style={styles.h4}>{ChainDepositCommand.description}</h4>
          <TextField
            type="text"
            placeholder="Above (Number)"
            label={ChainDepositCommand.args.amount}
            id={ChainDepositCommand.args.amount}
            onChange={handleAmountChange}
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
          {!!data.address && !!data.url ? <ChainDepositOutput data={data} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default ChainDeposit;
