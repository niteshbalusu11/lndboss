import React, { useState } from 'react';

import { Stack } from '@mui/system';
import SubmitButton from '../SubmitButton';
import { TextField } from '@mui/material';
import { axiosPostWithAlert } from '~client/utils/axios';
import { globalCommands } from '~client/commands';

// Sends onchain funds to an address from quick tools, calls NESTJS process raw API sendToChainAddress

const SendOnchain = () => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [data, setData] = useState(undefined);
  const [feerate, setFeeRate] = useState('');
  const [node, setNode] = useState('');

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleFeeRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeeRate(event.target.value);
  };

  const handleNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const fetchData = async () => {
    const postArgs = {
      address,
      tokens: Number(amount),
      fee_tokens_per_vbyte: Number(feerate),
      description: '',
    };

    const result = await axiosPostWithAlert({
      path: 'call',
      postBody: { method: 'sendToChainAddress', node, postArgs },
    });

    if (!!result) {
      setData(result.result);
    }
  };

  return (
    <Stack spacing={3} style={styles.form}>
      <h3>Send Onchain</h3>
      <TextField
        type="text"
        placeholder="Address"
        label={'Addres'}
        id={'address'}
        onChange={handleAddressChange}
        style={styles.textField}
      />

      <TextField
        type="text"
        placeholder="Amount"
        label={'Amount'}
        id={'amount'}
        onChange={handleAmountChange}
        style={styles.textField}
      />

      <TextField
        type="text"
        placeholder="Fee Rate"
        label={'Fee Rate'}
        id={'feerate'}
        onChange={handleFeeRateChange}
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

      <SubmitButton onClick={fetchData}>Send Onchain</SubmitButton>
      {!!data && !!data.id ? <SendOnchainOutput data={data} /> : null}
    </Stack>
  );
};

export default SendOnchain;

type Args = {
  data: object;
};
const SendOnchainOutput = ({ data }: Args) => {
  return (
    <div style={styles.style}>
      <div style={styles.headerStyle}>
        <strong>Result</strong>
      </div>

      <pre style={styles.preStyle}>{JSON.stringify(data, null, 2)}</pre>
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
