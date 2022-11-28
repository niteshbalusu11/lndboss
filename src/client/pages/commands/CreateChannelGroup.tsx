import * as types from '~shared/types';

import { Button, CssBaseline, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import commands, { globalCommands } from '../../commands';

import { CreateGroupChannelOutput } from '~client/output';
import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';
import { axiosPostWithWebSocket } from '~client/utils/axios';
import { useNotify } from '~client/hooks/useNotify';
import validateCreateGroupChannelCommand from '~client/utils/validations/validate_create_channel_group_command';

/*
  Renders the bos create-group-channel command
  GET call to the NestJs process to get chain deposit address
*/

const CreateChannelGroupCommand = commands.find(n => n.value === 'CreateChannelGroup');

const CreateChannelGroup = () => {
  const [capacity, setCapacity] = useState('');
  const [data, setData] = useState(undefined);
  const [feeRate, setFeeRate] = useState('');
  const [formValues, setFormValues] = useState([{ allow: '' }]);
  const [node, setNode] = useState('');

  const [size, setSize] = useState('');

  const addFormFields = () => {
    setFormValues([...formValues, { allow: '' }]);
  };

  const handleCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCapacity(event.target.value);
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
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

  const removeFormFields = (i: number) => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const fetchData = async () => {
    try {
      const result = validateCreateGroupChannelCommand({
        capacity: Number(capacity),
        count: Number(size),
        members: formValues.filter(n => !!n.allow).map(n => n.allow),
        rate: Number(feeRate),
      });

      if (!result) {
        return;
      }

      const postBody: types.commandCreateChannelGroup = {
        node,
        members: formValues.filter(n => !!n.allow).map(n => n.allow),
        capacity: Number(capacity),
        count: Number(size),
        message_id: Date.now().toString(),
        rate: Number(feeRate),
      };

      await axiosPostWithWebSocket({
        id: postBody.message_id,
        path: 'create-channel-group',
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
        <title>Create Channel Group</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{CreateChannelGroupCommand.name}</h2>
          <h4 style={styles.h4}>{CreateChannelGroupCommand.description}</h4>
          <h4 style={styles.h4}>{CreateChannelGroupCommand.longDescription}</h4>
          <Instructions />
          <TextField
            type="text"
            placeholder="Channel Capacity"
            label={CreateChannelGroupCommand.flags.capacity}
            id={CreateChannelGroupCommand.flags.capacity}
            onChange={handleCapacityChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder="Chain fee rate for open"
            label={CreateChannelGroupCommand.flags.fee_rate}
            id={CreateChannelGroupCommand.flags.fee_rate}
            onChange={handleFeeRateChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder="Size of the group"
            label={CreateChannelGroupCommand.flags.size}
            id={CreateChannelGroupCommand.flags.size}
            onChange={handleSizeChange}
            style={styles.textField}
          />
          <>
            <Button href="#text-buttons" onClick={() => addFormFields()} style={styles.button}>
              Add +
            </Button>
            {formValues.map((element, index) => (
              <div key={index}>
                <TextField
                  type="text"
                  label={CreateChannelGroupCommand.flags.allow}
                  name="allow"
                  placeholder={`${CreateChannelGroupCommand.flags.allow}-Add pubkeys to allow and define order`}
                  value={element.allow || ''}
                  onChange={e => handleChange(index, e)}
                  style={styles.textField}
                  id={`node-${index}`}
                />
                {!!index ? (
                  <IconButton aria-label="delete" onClick={() => removeFormFields(index)} style={styles.iconButton}>
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </div>
            ))}
          </>
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

export default CreateChannelGroup;

const styles = {
  button: {
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '10px',
    border: '1px solid black',
    marginTop: '20px',
    width: '50px',
  },
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '1100px',
  },
  h4: {
    marginTop: '0px',
  },
  iconButton: {
    width: '50px',
    marginTop: '0px',
  },
  textField: {
    width: '500px',
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
      <li>Allow field determines which pubkeys can join the group and the order of the group.</li>
    </ul>
  );
};
