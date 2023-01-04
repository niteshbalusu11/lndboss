import * as types from '~shared/types';

import { FormControlLabel, TextField } from '@mui/material';
import React, { useState } from 'react';

import CopyText from '../CopyText';
import QRCode from 'qrcode.react';
import { Stack } from '@mui/system';
import StandardSwitch from '../StandardSwitch';
import SubmitButton from '../SubmitButton';
import { axiosPostWithAlert } from '~client/utils/axios';
import { globalCommands } from '~client/commands';

const substring = n => n.slice(0, 20) + '......' + n.slice(-20);

// Creates an offchain invoice from quick tools, calls NESTJS process invoice command.

const CreateInvoice = () => {
  const [amount, setAmount] = useState('0');
  const [data, setData] = useState(undefined);
  const [includePrivateChannels, setIncludePrivateChannels] = useState(false);
  const [node, setNode] = useState('');

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleIncludePrivateChannels = () => {
    setIncludePrivateChannels(previousValue => !previousValue);
  };

  const fetchData = async () => {
    const postBody: types.commandInvoice = {
      node,
      amount: amount || '0',
      description: '',
      expires_in: 3,
      is_hinting: includePrivateChannels,
      is_selecting_hops: false,
      is_virtual: false,
      rate_provider: '',
      virtual_fee_rate: 0,
    };

    const result = await axiosPostWithAlert({ path: 'invoice', postBody });

    if (!!result) {
      setData(result.result);
    }
  };

  return (
    <Stack spacing={3} style={styles.form}>
      <h3>Create Invoice</h3>
      <TextField
        type="text"
        placeholder="Amount (Default 0) Accepts: 15*USD or 10*EUR, etc."
        label={'Amount'}
        id={'amount'}
        onChange={handleAmountChange}
        style={styles.textField}
      />

      <FormControlLabel
        style={styles.switch}
        control={
          <StandardSwitch
            checked={includePrivateChannels}
            onChange={handleIncludePrivateChannels}
            id={'includeprivatechannels'}
          />
        }
        label={'Include Private Channels'}
      />

      <TextField
        type="text"
        placeholder={globalCommands.node.name}
        label={globalCommands.node.name}
        id={globalCommands.node.value}
        onChange={handleNodeChange}
        style={styles.textField}
      />

      <SubmitButton onClick={fetchData} id="createinvoice">
        Create Invoice
      </SubmitButton>
      {!!data && !!data.request && data.tokens !== undefined ? <CreateInvoiceOutput data={data} /> : null}
    </Stack>
  );
};

export default CreateInvoice;

const styles = {
  div: {
    marginTop: '30px',
    marginLeft: '10px',
  },
  form: {
    marginTop: '50px',
    width: '700px',
  },
  qr: {
    height: '350px',
    width: '350px',
    padding: '5px',
  },
  switch: {
    width: '180px',
  },
  text: {
    fontSize: '15px',
    fontWeight: 'bold',
    display: 'inline-block',
  },
  textField: {
    width: '500px',
  },
};

type Args = {
  data: {
    request: string;
    tokens: number;
  };
};

const CreateInvoiceOutput = ({ data }: Args) => {
  return (
    <div style={styles.div} id="createinvoiceoutput">
      <QRCode value={data.request} size={250} style={styles.qr} id="qrcode" bgColor="white" fgColor="black" />
      <h3 style={styles.text} id="invoice">
        {substring(data.request)}
      </h3>
      <CopyText text={data.request} />
      <div>
        <h3 style={styles.text}>{`Tokens: ${data.tokens}`}</h3>
      </div>
    </div>
  );
};
