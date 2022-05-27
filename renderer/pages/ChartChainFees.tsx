import React, { useState } from 'react';
import { CssBaseline, Stack, TextField } from '@mui/material';
import Head from 'next/head';
import { StandardButtonLink, StartFlexBox, SubmitButton } from '../standard_components';
import commands, { globalCommands } from '../commands';
import { ChartChainFeesOutput } from '../output';
import * as types from '../types';

const ChartChainFeesCommand = commands.find(n => n.value === 'ChartChainFees');

/*
  Renders the bos chart-chain-fees command
  IPC to the main process to get chain fees data
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '700px',
  },
  textField: {
    width: '300px',
  },
};

const ChartChainFees = () => {
  const [data, setData] = useState(undefined);
  const [days, setDays] = useState('60');
  const [node, setNode] = useState('');

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDays(event.target.value);
  };

  const fetchData = async () => {
    const flags: types.commandChartChainFees = {
      node,
      days: !!days ? Number(days) : 60,
    };

    const { error, result } = await window.electronAPI.commandChartChainFees(flags);

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
        <title>Chart Chain Fees</title>
      </Head>
      <StartFlexBox>
        <StandardButtonLink label="Home" destination="/Commands" />
        <Stack spacing={3} style={styles.form}>
          <h2>{ChartChainFeesCommand.name}</h2>
          <h4 style={{ marginTop: '0px' }}>{ChartChainFeesCommand.longDescription}</h4>
          <TextField
            type="text"
            placeholder={`${ChartChainFeesCommand.flags.days} (Default 60)`}
            label={`${ChartChainFeesCommand.flags.days} (Default 60)`}
            id={ChartChainFeesCommand.flags.days}
            onChange={handleDaysChange}
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
          {!!data && <ChartChainFeesOutput data={data} />}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default ChartChainFees;
