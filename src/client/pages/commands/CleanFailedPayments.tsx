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

import { CleanFailedPaymentsOutput } from '~client/output';
import Head from 'next/head';
import { axiosPostWithAlert } from '~client/utils/axios';

const CleanFailedPaymentsCommand = commands.find(n => n.value === 'CleanFailedPayments');

/*
  Renders the bos clean-failed-payments command
  GET call to the NestJs process to get failed payments found or deleted
*/

const CleanFailedPayments = () => {
  const [data, setData] = useState(undefined);
  const [dryRun, setDryRun] = useState(false);
  const [node, setNode] = useState('');

  const handleDryRunChange = () => {
    setDryRun(previousValue => !previousValue);
  };

  const handleNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const fetchData = async () => {
    const postBody: types.commandCleanFailedPayments = {
      node,
      is_dry_run: dryRun,
    };

    const { result } = await axiosPostWithAlert({ path: 'clean-failed-payments', postBody });

    if (!!result) {
      setData(result);
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Clean Failed Payments</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{CleanFailedPaymentsCommand.name}</h2>
          <h4 style={styles.h4}>{CleanFailedPaymentsCommand.longDescription}</h4>
          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch
                checked={dryRun}
                onChange={handleDryRunChange}
                id={CleanFailedPaymentsCommand.flags.dryrun}
              />
            }
            label={CleanFailedPaymentsCommand.flags.dryrun}
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
          {!!data ? <CleanFailedPaymentsOutput data={data} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default CleanFailedPayments;

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '700px',
  },
  h4: {
    marginTop: '0px',
  },
  switch: {
    width: '100px',
  },
  textField: {
    width: '500px',
  },
};
