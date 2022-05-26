import { CssBaseline, FormControlLabel, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import commands from '../commands';
import StandardButtonLink from '../standard_components/StandardButtonLink';
import StandardSwitch from '../standard_components/StandardSwitch';
import StartFlexBox from '../standard_components/StartFlexBox';
import SubmitButton from '../standard_components/SubmitButton';
import BalanceOutput from '../output/BalanceOutput';
import SavedNodes from '../standard_components/SavedNodes';
import * as types from '../types';
import Head from 'next/head';

/*
  Renders the bos balance command
*/

const BalanceCommand = commands.find(n => n.value === 'Balance');

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '300px',
  },
};

const Balance = () => {
  const [above, setAbove] = useState('');
  const [below, setBelow] = useState('');
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const [isEnabled3, setIsEnabled3] = useState(false);
  const [isEnabled4, setIsEnabled4] = useState(false);
  const [data, setData] = useState(undefined);

  const [node, setNode] = useState('');

  const getSavedNode = (data: string) => {
    setNode(data);
  };

  const toggleSwitch1 = () => {
    setIsEnabled1((previousState: boolean) => !previousState);
  };

  const toggleSwitch2 = () => {
    setIsEnabled2((previousState: boolean) => !previousState);
  };

  const toggleSwitch3 = () => {
    setIsEnabled3((previousState: boolean) => !previousState);
  };

  const toggleSwitch4 = () => {
    setIsEnabled4((previousState: boolean) => !previousState);
  };

  const handleAboveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAbove(event.target.value);
  };

  const handleBelowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBelow(event.target.value);
  };

  const fetchData = async () => {
    const flags: types.commandBalance = {
      above: Number(above),
      below: Number(below),
      node,
      is_confirmed: isEnabled1,
      is_detailed: isEnabled2,
      is_offchain_only: isEnabled3,
      is_onchain_only: isEnabled4,
    };

    const { error, result } = await window.electronAPI.commandBalance(flags);
    console.log(result);
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
        <title>Balance</title>
      </Head>
      <StartFlexBox>
        <StandardButtonLink label="Home" destination="/Commands" />
        <Stack spacing={3} style={styles.form}>
          <TextField
            type="text"
            placeholder="Above (Number)"
            label={BalanceCommand.flags.above}
            id={BalanceCommand.flags.above}
            onChange={handleAboveChange}
          />
          <TextField
            type="text"
            placeholder="Below (Number)"
            label={BalanceCommand.flags.below}
            id={BalanceCommand.flags.below}
            onChange={handleBelowChange}
          />

          <FormControlLabel
            control={
              <StandardSwitch checked={isEnabled1} onChange={toggleSwitch1} id={BalanceCommand.flags.confirmed} />
            }
            label={BalanceCommand.flags.confirmed}
          />
          <FormControlLabel
            control={
              <StandardSwitch checked={isEnabled2} onChange={toggleSwitch2} id={BalanceCommand.flags.detailed} />
            }
            label={BalanceCommand.flags.detailed}
          />
          <FormControlLabel
            control={
              <StandardSwitch checked={isEnabled3} onChange={toggleSwitch3} id={BalanceCommand.flags.offchain} />
            }
            label={BalanceCommand.flags.offchain}
          />
          <FormControlLabel
            control={<StandardSwitch checked={isEnabled4} onChange={toggleSwitch4} id={BalanceCommand.flags.onchain} />}
            label={BalanceCommand.flags.onchain}
          />
          <SavedNodes getSavedNode={getSavedNode} />
          <SubmitButton variant="contained" onClick={fetchData}>
            Run Command
          </SubmitButton>
          {!!data ? <BalanceOutput data={data} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Balance;
