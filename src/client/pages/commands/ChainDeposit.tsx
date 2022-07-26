import * as types from '~shared/types';

import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import commands, { globalCommands } from '../../commands';

import { ChainDepositOutput } from '../../output';
import Head from 'next/head';
import { axiosGet } from '~client/utils/axios';

/*
  Renders the bos chain-deposit command
  GET call to the NestJs process to get chain deposit address
*/

const ChainDepositCommand = commands.find(n => n.value === 'ChainDeposit');

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

const ChainDeposit = () => {
  const [amount, setAmount] = useState('');
  const [data, setData] = useState({ address: '', url: '' });
  const [node, setNode] = useState('');
  const [format, setFormat] = useState('');

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormat(event.target.value);
  };

  const fetchData = async () => {
    const query: types.commandChainDeposit = {
      node,
      format,
      amount: Number(amount),
    };

    const result = await axiosGet({ path: 'chain-deposit', query });

    if (!!result) {
      setData(result);
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Chain Deposit</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
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
            placeholder="Format np2wpkh, p2tr, p2wpkh (default)"
            label={ChainDepositCommand.flags.format}
            id={ChainDepositCommand.flags.format}
            onChange={handleFormatChange}
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
