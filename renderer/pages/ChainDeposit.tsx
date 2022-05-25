import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import commands from '../commands';
import StandardButtonLink from '../standard_components/StandardButtonLink';
import StartFlexBox from '../standard_components/StartFlexBox';
import SubmitButton from '../standard_components/SubmitButton';
import ChainDepositOutput from '../output/ChainDepositOutput';
import * as types from '../types';
import Head from 'next/head';
import SavedNodes from '../standard_components/SavedNodes';

/*
  Renders the bos chain-deposit command
*/

const ChainDepositCommand = commands.find(n => n.value === 'ChainDeposit');

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '300px',
  },
};

const ChainDeposit = () => {
  const [amount, setAmount] = useState('');
  const [data, setData] = useState({ address: '', url: '' });
  const [node, setNode] = useState('');

  const getSavedNode = (data: string) => {
    setNode(data);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const fetchData = async () => {
    const flags: types.commandChainDeposit = {
      node,
      amount: Number(amount),
    };

    const { error, result } = await window.electronAPI.commandChainDeposit(flags);

    if (!!error) {
      window.alert(error);
      return;
    }

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
        <StandardButtonLink label="Home" destination="/Commands" />
        <Stack spacing={3} style={styles.form}>
          <TextField
            type="text"
            placeholder="Above (Number)"
            label={ChainDepositCommand.flags.amount}
            id={ChainDepositCommand.flags.amount}
            onChange={handleAmountChange}
          />
          <SavedNodes getSavedNode={getSavedNode} />
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
