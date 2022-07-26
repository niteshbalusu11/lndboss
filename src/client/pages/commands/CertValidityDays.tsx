import * as types from '~shared/types';

import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import commands, { globalCommands } from '~client/commands';

import { CertValidityDaysOutput } from '~client/output';
import Head from 'next/head';
import { axiosGet } from '~client/utils/axios';

const CertValidityDaysCommand = commands.find(n => n.value === 'CertValidityDays');

/* Renders the CertValidityDays command
  GET call to NestJs process to get cert validity days related information
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
  h4: {
    marginTop: '0px',
  },
};

const CertValidityDays = () => {
  const [node, setNode] = useState('');
  const [below, setBelow] = useState('');
  const [data, setData] = useState('');

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleBelowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBelow(event.target.value);
  };

  const fetchData = async () => {
    const query: types.commandCertValidityDays = {
      node,
      below: Number(below),
    };

    const result = await axiosGet({ path: 'cert-validity-days', query });

    setData(result);
  };

  return (
    <CssBaseline>
      <Head>
        <title>Cert Validity Days</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={2} style={styles.form}>
          <h2>CertValidityDays</h2>
          <h4 style={styles.h4}>{CertValidityDaysCommand.description}</h4>
          <TextField
            type="text"
            placeholder="Number of days below mark"
            label={CertValidityDaysCommand.flags.below}
            id={CertValidityDaysCommand.flags.below}
            onChange={handleBelowChange}
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
          {data !== '' ? <CertValidityDaysOutput data={data} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default CertValidityDays;
