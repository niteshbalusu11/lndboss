import * as YAML from 'json-to-pretty-yaml';
import * as types from '~shared/types';

import React, { useState } from 'react';

import { Stack } from '@mui/system';
import SubmitButton from '../SubmitButton';
import { TextField } from '@mui/material';
import { axiosGet } from '~client/utils/axios';
import { globalCommands } from '~client/commands';

// Pays an offchain invoice from quick tools, calls NESTJS process pay command.

const PayInvoice = () => {
  const [data, setData] = useState(undefined);
  const [invoice, setInvoice] = useState('');
  const [node, setNode] = useState('');

  const handleInvoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice(event.target.value);
  };

  const handleNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const fetchData = async () => {
    const query: types.commandPay = {
      node,
      avoid: [],
      in_through: '',
      is_strict_max_fee: false,
      max_fee: 1337,
      max_paths: 1,
      message: '',
      out: [],
      request: invoice,
      message_id: Date.now().toString(),
    };

    const result = await axiosGet({ path: 'pay', query });

    if (!!result) {
      setData(result);
    }
  };

  return (
    <Stack spacing={3} style={styles.form}>
      <h3>Pay Invoice</h3>
      <TextField
        type="text"
        placeholder="Bolt 11 Invoice"
        label={'Invoice'}
        id={'invoice'}
        onChange={handleInvoiceChange}
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

      <SubmitButton onClick={fetchData}>Pay Invoice</SubmitButton>
      {!!data && !!data.preimage ? <PayInvoiceOutput data={data} /> : null}
    </Stack>
  );
};

export default PayInvoice;

type Args = {
  data: object;
};
const PayInvoiceOutput = ({ data }: Args) => {
  return (
    <div style={styles.style}>
      <div style={styles.headerStyle}>
        <strong>Result</strong>
      </div>

      <pre style={styles.preStyle}>{YAML.stringify(data)}</pre>
    </div>
  );
};

const styles = {
  form: {
    marginTop: '50px',
    width: '700px',
  },
  headerStyle: {
    backgroundColor: '#193549',
    padding: '5px 10px',
    fontFamily: 'monospace',
    color: '#ffc600',
  },
  preStyle: {
    display: 'block',
    padding: '10px 30px',
    margin: '0',
    overflow: 'scroll',
  },
  style: {
    backgroundColor: '#1f4662',
    color: '#fff',
    fontSize: '12px',
  },
  textField: {
    width: '500px',
  },
};
