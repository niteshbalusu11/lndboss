import * as types from '~shared/types';

import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import commands, { globalCommands } from '../../commands';

import { CreateGroupChannelOutput } from '~client/output';
import Head from 'next/head';
import { axiosPostWithWebSocket } from '~client/utils/axios';
import { useNotify } from '~client/hooks/useNotify';
import validateCreateGroupChannelCommand from '~client/utils/validations/validate_create_group_channel_command';

/*
  Renders the bos create-group-channel command
  GET call to the NestJs process to get chain deposit address
*/

const CreateGroupChannelCommand = commands.find(n => n.value === 'CreateGroupChannel');

const CreateGroupChannel = () => {
  const [capacity, setCapacity] = useState('');
  const [data, setData] = useState(undefined);
  const [feeRate, setFeeRate] = useState('');
  const [node, setNode] = useState('');

  const [size, setSize] = useState('');

  const handleCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCapacity(event.target.value);
  };

  const handleFeeRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeeRate(event.target.value);
  };

  const handleNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(event.target.value);
  };

  const fetchData = async () => {
    try {
      const result = validateCreateGroupChannelCommand({
        capacity: Number(capacity),
        count: Number(size),
        rate: Number(feeRate),
      });

      if (!result) {
        return;
      }

      const postBody: types.commandCreateGroupChannel = {
        node,
        capacity: Number(capacity),
        count: Number(size),
        message_id: Date.now().toString(),
        rate: Number(feeRate),
      };

      await axiosPostWithWebSocket({
        id: postBody.message_id,
        path: 'create-group-channel',
        postBody,
        setData,
      });
    } catch (error) {
      useNotify({ type: 'error', message: error.message });
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Create Group Channel</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{CreateGroupChannelCommand.name}</h2>
          <h4 style={styles.h4}>{CreateGroupChannelCommand.description}</h4>
          <h4 style={styles.h4}>{CreateGroupChannelCommand.longDescription}</h4>
          <Instructions />
          <TextField
            type="text"
            placeholder="Channel Capacity"
            label={CreateGroupChannelCommand.flags.capacity}
            id={CreateGroupChannelCommand.flags.capacity}
            onChange={handleCapacityChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder="Chain fee rate for open"
            label={CreateGroupChannelCommand.flags.fee_rate}
            id={CreateGroupChannelCommand.flags.fee_rate}
            onChange={handleFeeRateChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder="Size of the group"
            label={CreateGroupChannelCommand.flags.size}
            id={CreateGroupChannelCommand.flags.size}
            onChange={handleSizeChange}
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
          <SubmitButton variant="contained" onClick={fetchData}>
            Run Command
          </SubmitButton>
          <CreateGroupChannelOutput data={data} />
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default CreateGroupChannel;

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '1100px',
  },
  textField: {
    width: '500px',
  },
  h4: {
    marginTop: '0px',
  },
};

const Instructions = () => {
  return (
    <ul>
      <li>
        <b>Important: DO NOT REFRESH THE PAGE WHEN THE COMMAND IS RUNNING.</b>
      </li>
      <li>Capacity (Required): Total capacity of the channel(s) being opened.</li>
      <li>FeeRate (Required): On-chain fee rate for the opening transaction(s).</li>
      <li>Size (Required): Number of nodes participating in the group open.</li>
      <li>Runing the command returns an invite code that needs to be passed to other members.</li>
      <li>Members run the Join Group Channel command to join the group.</li>
      <li>Minimum party size is 2.</li>
      <li>Maximum party size is 420.</li>
    </ul>
  );
};
