import * as types from '~shared/types';

import { CssBaseline, FormControlLabel, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import {
  StandardHomeButtonLink,
  StandardSwitch,
  StartFlexBox,
  SubmitButton,
} from '~client/standard_components/app-components';
import commands, { globalCommands } from '~client/commands';

import Head from 'next/head';
import { InvoiceOutput } from '~client/output';
import { axiosPostWithAlert } from '~client/utils/axios';

const InvoiceCommand = commands.find(n => n.value === 'Invoice');

/*
  Renders the bos invoice command
  POST call to the NestJs process to get Bolt 11 payment request
*/

const Invoice = () => {
  const [amount, setAmount] = useState('');
  const [data, setData] = useState(undefined);
  const [description, setDescription] = useState('');
  const [expiresIn, setExpiresIn] = useState(undefined);
  const [isHinting, setIsHinting] = useState(false);
  const [node, setNode] = useState('');
  const [rateProvider, setRateProvider] = useState('');

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleExpiresInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpiresIn(event.target.value);
  };

  const handleIsHintingChange = () => {
    setIsHinting(previousValue => !previousValue);
  };

  const handleNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleRateProviderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRateProvider(event.target.value);
  };

  const fetchData = async () => {
    const postBody: types.commandInvoice = {
      description,
      node,
      amount: amount || '0',
      expires_in: Number(expiresIn) || 3,
      is_hinting: isHinting,
      is_selecting_hops: false,
      is_virtual: false,
      rate_provider: rateProvider,
      virtual_fee_rate: 0,
    };

    const result = await axiosPostWithAlert({ path: 'invoice', postBody });

    if (!!result) {
      setData(result.result);
    }
  };
  return (
    <CssBaseline>
      <Head>
        <title>Invoice</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{InvoiceCommand.name}</h2>
          <h4 style={styles.h4}>{InvoiceCommand.longDescription}</h4>

          <TextField
            type="text"
            placeholder="Amount (Default 0)"
            label={InvoiceCommand.args.amount}
            id={InvoiceCommand.args.amount}
            onChange={handleAmountChange}
            style={styles.textField}
          />

          <TextField
            type="text"
            placeholder="Invoice Description (Optional)"
            label={InvoiceCommand.flags.description}
            id={InvoiceCommand.flags.description}
            onChange={handleDescriptionChange}
            style={styles.textField}
          />

          <TextField
            type="text"
            placeholder="Invoice Expires In Hours, (Default 3)"
            label={InvoiceCommand.flags.expires_in}
            id={InvoiceCommand.flags.expires_in}
            onChange={handleExpiresInChange}
            style={styles.textField}
          />

          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch
                checked={isHinting}
                onChange={handleIsHintingChange}
                id={InvoiceCommand.flags.is_hinting}
                placeholder="Add hop hints"
              />
            }
            label={InvoiceCommand.flags.is_hinting}
            placeholder="Add hop hints"
          />

          <TextField
            type="text"
            placeholder="Rate Provider (Default Coindesk)"
            label={InvoiceCommand.flags.rate_provider}
            id={InvoiceCommand.flags.rate_provider}
            onChange={handleRateProviderChange}
            style={styles.textField}
          />

          <TextField
            type="text"
            placeholder={globalCommands.node.name}
            label={globalCommands.node.name}
            id={globalCommands.node.value}
            onChange={handleNodeChange}
            style={styles.textField}
          />

          <SubmitButton onClick={fetchData}>Run Command</SubmitButton>
          {!!data && !!data.request && data.tokens !== undefined ? <InvoiceOutput data={data} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Invoice;

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
