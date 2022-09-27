import { CssBaseline, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';

import Head from 'next/head';
import { Stack } from '@mui/system';
import YamlEditor from '@focus-reactive/react-yaml';
import { axiosPostWithAlert } from '~client/utils/axios';
import { configs } from '~client/utils/fee_strategies';
import { useNotify } from '~client/hooks/useNotify';

const sampleConfigs = Object.keys(configs);

const FeeStrategies = () => {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [strategy, setStrategy] = useState(undefined);
  const actions = useRef(null);

  useEffect(() => {
    if (!strategy) {
      actions.current.replaceValue({ json: configs.defaultConfig });
    } else {
      actions.current.replaceValue({ json: configs[strategy] });
    }
  }, [strategy]);

  const handleChange = ({ json }) => {
    setData(json);
  };

  const handleError = errorObject => {
    setError(errorObject);
  };

  const fetchData = async () => {
    if (!!error) {
      useNotify({ type: 'error', message: 'Cannot save, errors need to be fixed.' });
      return;
    }
    const postBody = {
      strategies: data,
    };

    const result = await axiosPostWithAlert({ path: 'save-strategies', postBody });

    if (!!result) {
      useNotify({ type: 'success', message: 'Fee strategies have been saved' });
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Fee Scheduler</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack style={styles.form}>
          <h2>Automated Fees</h2>
          <FormControl sx={{ minWidth: 120, marginLeft: '10px' }}>
            <InputLabel id="strategies" style={styles.inputLabel}>
              Sample Strategies
            </InputLabel>
            <Select
              label={'Sample Strategies'}
              onChange={event => setStrategy(event.target.value)}
              name={'samplestrategies'}
              style={styles.select}
              placeholder={'Sample Strategies'}
              value={strategy || ''}
            >
              {sampleConfigs.map((config, i) => (
                <MenuItem id={config} value={config} key={i}>
                  {config}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ background: 'white', maxWidth: '100vh', marginTop: '30px' }}>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <YamlEditor json={configs} onChange={handleChange} onError={handleError} ref={actions} />
          </div>
          <SubmitButton onClick={fetchData}>Save Strategies</SubmitButton>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default FeeStrategies;

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '1500px',
  },
  textField: {
    width: '220px',
    marginLeft: '10px',
  },
  h4: {
    marginTop: '0px',
  },
  button: {
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '10px',
    border: '1px solid black',
    marginTop: '20px',
    width: '50px',
  },
  iconButton: {
    width: '50px',
    marginTop: '0px',
  },
  switch: {
    width: '100px',
  },
  select: {
    width: '200px',
  },
  inputLabel: {
    color: 'black',
  },
  formControl: {
    marginLeft: '10px',
    width: '100px',
  },
};
