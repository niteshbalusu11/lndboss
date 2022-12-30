import * as types from '~shared/types';

import React, { useState } from 'react';

import CopyText from '../CopyText';
import QRCode from 'qrcode.react';
import { Stack } from '@mui/system';
import SubmitButton from '../SubmitButton';
import { TextField } from '@mui/material';
import { axiosGet } from '~client/utils/axios';
import { globalCommands } from '~client/commands';

// Creates an onchain address from quick tools, calls NESTJS process for chain-deposit command

const CreateChainAddress = () => {
  const [amount, setAmount] = useState('');
  const [data, setData] = useState({ address: '', url: '' });
  const [node, setNode] = useState('');

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const fetchData = async () => {
    const query: types.commandChainDeposit = {
      node,
      format: '',
      amount: Number(amount),
    };

    const result = await axiosGet({ path: 'chain-deposit', query });

    if (!!result) {
      setData(result);
    }
  };

  return (
    <Stack spacing={3} style={styles.form}>
      <h3>Create Onchain Address</h3>
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
        placeholder={globalCommands.node.name}
        label={globalCommands.node.name}
        id={globalCommands.node.value}
        onChange={handleNodeChange}
        style={styles.textField}
      />

      <SubmitButton onClick={fetchData} id="createchainaddress">
        Create Chain Address
      </SubmitButton>
      {!!data.address && !!data.url ? <CreateChainAddressOutput data={data} /> : null}
    </Stack>
  );
};

export default CreateChainAddress;

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
    height: '250px',
    width: '250px',
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

type Data = {
  data: {
    address: string;
    url: string;
  };
};

const CreateChainAddressOutput = ({ data }: Data) => {
  return (
    <div style={styles.div} id="createchainaddressoutput">
      <QRCode value={data.url} size={250} style={styles.qr} id="qrcode" bgColor="white" fgColor="black" />
      <p style={styles.text} id="chainaddress">
        {data.address}
      </p>
      <CopyText text={data.url} />
    </div>
  );
};
