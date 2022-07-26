import * as types from '~shared/types';

import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import commands, { globalCommands } from '~client/commands';

import { FindOutput } from '~client/output';
import Head from 'next/head';
import { axiosGet } from '~client/utils/axios';

const FindCommand = commands.find(n => n.value === 'Find');

/*
  Renders the bos find command
  GET call to the NestJs process to fetch data from node db
*/

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

const Find = () => {
  const [node, setNode] = useState('');
  const [queryString, setQueryString] = useState('');
  const [data, setData] = useState(undefined);

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryString(event.target.value);
  };

  const fetchData = async () => {
    const query: types.commandFind = {
      node,
      query: queryString,
    };

    const result = await axiosGet({ path: 'find', query });

    if (!!result) {
      setData(result);
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Find</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{FindCommand.name}</h2>
          <h4 style={styles.h4}>{FindCommand.description}</h4>
          <TextField
            type="text"
            placeholder="Query String"
            label={FindCommand.args.query}
            id={FindCommand.args.query}
            onChange={handleQueryChange}
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
          {!!data ? <FindOutput data={data} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Find;
