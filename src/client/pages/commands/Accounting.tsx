import * as types from '~shared/types';

import { CssBaseline, FormControlLabel, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import {
  StandardHomeButtonLink,
  StandardSwitch,
  StartFlexBox,
  SubmitButton,
} from '~client/standard_components/app-components';
import commands, { globalCommands } from '~client/commands';

import Head from 'next/head';
import Link from 'next/link';

const AccountingCommand = commands.find(n => n.value === 'Accounting');

/*
  Renders the Accounting page
  Passes query parameters to the accounting results page
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '700px',
  },
  textField: {
    width: '350px',
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
  h4: {
    marginTop: '0px',
  },
  inputLabel: {
    fontWeight: 'bold',
    color: 'black',
  },
  select: {
    width: '300px',
  },
  switch: {
    width: '100px',
  },
};

const Accounting = () => {
  const [node, setNode] = useState('');
  const [isCsv, setIsCsv] = useState(false);
  const [isFiatDisabled, setIsFiatDisabled] = useState(true);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [category, setCategory] = useState('');
  const [rateProvider, setRateProvider] = useState('');

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  const handleIsCsvChange = () => {
    setIsCsv((previousState: boolean) => !previousState);
  };

  const handleIsFiatDisabledChange = () => {
    setIsFiatDisabled((previousState: boolean) => !previousState);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(event.target.value);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value);
  };

  const handleRateProviderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRateProvider(event.target.value);
  };

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const flags: types.commandAccounting = {
    category,
    month,
    node,
    year,
    is_csv: isCsv,
    is_fiat_disabled: isFiatDisabled,
    rate_provider: rateProvider,
  };

  return (
    <CssBaseline>
      <Head>
        <title>Accounting</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />

        <Stack spacing={3} style={styles.form}>
          <h2>{AccountingCommand.name}</h2>
          <h4>{AccountingCommand.longDescription}</h4>
          <div>
            <InputLabel id="accounting-category" style={styles.inputLabel}>
              Pick a value (Required)
            </InputLabel>
            <Select
              labelId="category"
              id="category"
              value={category}
              onChange={handleCategoryChange}
              label="Accounting Category"
              style={styles.select}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={AccountingCommand.args.chainFees} id={AccountingCommand.args.chainFees}>
                {AccountingCommand.args.chainFees}
              </MenuItem>
              <MenuItem value={AccountingCommand.args.chainReceives} id={AccountingCommand.args.chainReceives}>
                {AccountingCommand.args.chainReceives}
              </MenuItem>
              <MenuItem value={AccountingCommand.args.chainSends} id={AccountingCommand.args.chainSends}>
                {AccountingCommand.args.chainSends}
              </MenuItem>
              <MenuItem value={AccountingCommand.args.forwards} id={AccountingCommand.args.forwards}>
                {AccountingCommand.args.forwards}
              </MenuItem>
              <MenuItem value={AccountingCommand.args.invoices} id={AccountingCommand.args.invoices}>
                {AccountingCommand.args.invoices}
              </MenuItem>
              <MenuItem value={AccountingCommand.args.payments} id={AccountingCommand.args.payments}>
                {AccountingCommand.args.payments}
              </MenuItem>
            </Select>
          </div>
          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch checked={isCsv} onChange={handleIsCsvChange} id={AccountingCommand.flags.is_csv} />
            }
            label={AccountingCommand.flags.is_csv}
          />
          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch
                checked={isFiatDisabled}
                onChange={handleIsFiatDisabledChange}
                id={AccountingCommand.flags.is_fiat_disabled}
              />
            }
            label={`${AccountingCommand.flags.is_fiat_disabled} (Defaulted to true for faster results)`}
          />
          <TextField
            type="text"
            placeholder={`${AccountingCommand.flags.month} (Records for specified month)`}
            label={AccountingCommand.flags.month}
            id={AccountingCommand.flags.month}
            style={styles.textField}
            onChange={handleMonthChange}
          />
          <TextField
            type="text"
            placeholder={`${AccountingCommand.flags.rate_provider} (default Coindesk)`}
            label={AccountingCommand.flags.rate_provider}
            id={AccountingCommand.flags.rate_provider}
            style={styles.textField}
            onChange={handleRateProviderChange}
          />
          <TextField
            type="text"
            placeholder={`${AccountingCommand.flags.year} (Records for specified year)`}
            label={AccountingCommand.flags.year}
            id={AccountingCommand.flags.year}
            style={styles.textField}
            onChange={handleYearChange}
          />
          <TextField
            type="text"
            placeholder={globalCommands.node.name}
            label={globalCommands.node.name}
            id={globalCommands.node.value}
            onChange={handeNodeChange}
            style={styles.textField}
          />
          <Link href={{ pathname: '/result/AccountingResult', query: flags }} passHref>
            <a target="_blank" rel="noreferrer">
              <SubmitButton>Run Command</SubmitButton>
            </a>
          </Link>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Accounting;
