import { CssBaseline, FormControlLabel, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import {
  StandardHomeButtonLink,
  StandardSwitch,
  StartFlexBox,
  SubmitButton,
} from '~client/standard_components/app-components';

import { CallOutput } from '~client/output';
import Head from 'next/head';
import { RawApiList } from '~client/standard_components/lndboss';
import { axiosPost } from '~client/utils/axios';
import commands from '~client/commands';
import { rawApi } from '~shared/raw_api';

const CallCommand = commands.find(n => n.value === 'Call');
const argument = n => rawApi.calls.find(s => s.method === n);

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
  switch: {
    width: '100px',
  },
};

const Call = () => {
  const argumentsArray = [];
  const [method, setMethod] = useState('');
  const [data, setData] = useState(null);

  const getArguments = !!method && !!argument(method).arguments ? argument(method).arguments.map(n => n) : [];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    if (!!argumentsArray.length) {
      argumentsArray.map(obj => {
        obj[id] = value;
        return obj;
      });

      return;
    }

    argumentsArray.push({ [id]: value });
  };

  const fetchData = async () => {
    const [postArgs] = argumentsArray;
    const node = localStorage.getItem('SELECTED_SAVED_NODE');
    const result = await axiosPost({ path: 'call', postBody: { method, node, postArgs } });

    if (!!result) {
      setData(result.result);
    }
  };

  const RenderArguments = () => {
    return (
      <>
        {getArguments.map(n => (
          <div key={n.named}>
            {n.type !== 'boolean' ? (
              <TextField
                label={n.named}
                placeholder={n.description}
                style={styles.textField}
                required={n.optional !== true}
                id={n.named}
                onChange={handleChange}
              />
            ) : (
              <FormControlLabel
                style={styles.switch}
                control={<StandardSwitch onChange={handleChange} id={n.named} />}
                label={n.description}
              />
            )}
          </div>
        ))}
      </>
    );
  };

  return (
    <CssBaseline>
      <Head>
        <title>Call</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={2} style={styles.form}>
          <h2>{CallCommand.name}</h2>
          <h4 style={styles.h4}>{CallCommand.description}</h4>
          <RawApiList setMethod={setMethod} />
          <RenderArguments />
          <SubmitButton variant="contained" onClick={fetchData}>
            Run Command
          </SubmitButton>
          {!!data ? <CallOutput data={data} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Call;
