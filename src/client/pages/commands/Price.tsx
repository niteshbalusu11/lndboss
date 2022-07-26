import * as types from '~shared/types';

import { CssBaseline, FormControlLabel, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import {
  StandardHomeButtonLink,
  StandardSwitch,
  StartFlexBox,
  SubmitButton,
} from '~client/standard_components/app-components';

import Head from 'next/head';
import PriceOutput from '~client/output/PriceOutput';
import { axiosGet } from '~client/utils/axios';
import commands from '../../commands';

const PriceCommand = commands.find(n => n.value === 'Price');

/*
  Renders the bos price command
  GET call to the NestJs process to get fiat pricing information
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    minWidth: '700px',
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

const Price = () => {
  const [symbols, setSymbols] = useState('');
  const [file, setFile] = useState(false);
  const [from, setFrom] = useState('coindesk');
  const [data, setData] = useState(undefined);

  const handleFileChange = () => {
    setFile((previousState: boolean) => !previousState);
  };

  const handleFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFrom(event.target.value);
  };

  const handleSymbolsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSymbols(event.target.value);
  };

  const fetchData = async () => {
    const query: types.commandPrice = {
      file,
      from,
      symbols,
    };

    const result = await axiosGet({ path: 'price', query });

    if (!!result) {
      setData(result);
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Price</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{PriceCommand.name}</h2>
          <h4 style={styles.h4}>{PriceCommand.longDescription}</h4>
          <TextField
            type="text"
            placeholder="Price Symbols USD (default),AUD,CAD ..."
            label={PriceCommand.args.symbols}
            id={PriceCommand.args.symbols}
            onChange={handleSymbolsChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder="From RateProvider (coindesk (default), coingecko)"
            label={PriceCommand.flags.from}
            id={PriceCommand.flags.from}
            onChange={handleFromChange}
            style={styles.textField}
          />
          <FormControlLabel
            style={styles.switch}
            control={<StandardSwitch checked={file} onChange={handleFileChange} id={PriceCommand.flags.file} />}
            label={PriceCommand.flags.file}
          />
          <SubmitButton variant="contained" onClick={fetchData}>
            Run Command
          </SubmitButton>
          {!!data ? <PriceOutput data={data} file={file} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Price;
