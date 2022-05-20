import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import commands from '../commands';
import StandardButtonLink from '../standard_components/StandardButtonLink';
import StartFlexBox from '../standard_components/StartFlexBox';
import SubmitButton from '../standard_components/SubmitButton';
import ChainDepositOutput from '../output/ChainDepositOutput';
import * as types from '../types';
import Head from 'next/head';

const ChainDepositCommand = commands.find(n => n.value === 'ChainDeposit');

const styles = createUseStyles({
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '300px',
  },
});

const ChainDeposit = () => {
  const classes = styles();
  const [amount, setAmount] = useState('');
  const [data, setData] = useState({ address: '', url: '' });

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const fetchData = async () => {
    const flags: types.commandChainDeposit = {
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
        <StandardButtonLink label="Home" destination="/home" />
        <Stack spacing={3} className={classes.form}>
          <TextField
            type="text"
            placeholder="Above (Number)"
            label={ChainDepositCommand.flags.amount}
            id={ChainDepositCommand.flags.amount}
            onChange={handleAmountChange}
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
