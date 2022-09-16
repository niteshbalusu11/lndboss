import * as types from '~shared/types';

import {
  Button,
  CssBaseline,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import {
  StandardHomeButtonLink,
  StandardSwitch,
  StartFlexBox,
  SubmitButton,
} from '~client/standard_components/app-components';
import commands, { globalCommands } from '~client/commands';

import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';
import { OpenOutput } from '~client/output';
import { axiosPostWithAlert } from '~client/utils/axios';
import { useNotify } from '~client/hooks/useNotify';
import validateOpenCommandArgs from '~client/utils/validate_open_command_args';

const knownTypes = ['public', 'private', 'public-trusted', 'private-trusted'];
const OpenCommand = commands.find(n => n.value === 'Open');

/*
  Renders the bos open command
  POST call to the NestJs process to open channels
*/

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

const Open = () => {
  const [avoidBroadcast, setAvoidBroadcast] = useState(false);
  const [data, setData] = useState(undefined);
  const [disabled, setDisabled] = useState(false);
  const [formFields, setFormFields] = useState([{ amount: '', coopCloseAddress: '', give: '', pubkey: '', type: '' }]);
  const [internalFundFeeRate, setInternalFundFeeRate] = useState(undefined);
  const [node, setNode] = useState('');

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handeInternalFundFeeRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalFundFeeRate(event.target.value);
  };

  const handleAvoidBroadcastChange = () => {
    setAvoidBroadcast((previousState: boolean) => !previousState);
  };

  const handleFormChange = (i: number, e: any) => {
    const newFormValues = [...formFields];
    newFormValues[i][e.target.name] = e.target.value;
    setFormFields(newFormValues);
  };

  const fetchData = async () => {
    const messageId = Date.now().toString();
    const capacities = formFields.map(n => n.amount).filter(n => !!n) || [];
    const coopCloseAddresses = formFields.map(n => n.coopCloseAddress).filter(n => !!n) || [];
    const gives = formFields.map(n => Number(n.give)).filter(n => !!n) || [];
    const publicKeys = formFields.map(n => n.pubkey).filter(n => !!n) || [];
    const types = formFields.map(n => n.type).filter(n => !!n) || [];

    const isValid = validateOpenCommandArgs({
      node,
      capacities,
      gives,
      types,
      cooperative_close_addresses: coopCloseAddresses,
      public_keys: publicKeys,
      internal_fund_fee_rate: internalFundFeeRate,
      is_avoiding_broadcast: avoidBroadcast,
    });

    if (!isValid.is_valid) {
      useNotify({ type: 'error', message: isValid.message });
      return;
    }

    const postBody: types.commandOpen = {
      node,
      capacities,
      gives,
      types,
      cooperative_close_addresses: coopCloseAddresses,
      message_id: messageId,
      public_keys: publicKeys,
      internal_fund_fee_rate: internalFundFeeRate,
      is_avoiding_broadcast: avoidBroadcast,
    };

    const result = await axiosPostWithAlert({ path: 'validate-open', postBody });

    if (!!result) {
      Confirm.show(
        'Confirm Channel Open',
        'Open Channels?',
        'Yes',
        'No',
        async () => {
          const result = await axiosPostWithAlert({ path: 'open', postBody });
          if (!!result) {
            setData(result);
            useNotify({ type: 'success', message: 'Channels opened' });
            setDisabled(previousValue => !previousValue);
          }
        },
        () => {
          useNotify({ type: 'info', message: 'Open Cancelled' });
        },
        {}
      );
    }
  };

  const addFields = () => {
    const object = {
      amount: '',
      coopCloseAddress: '',
      give: '',
      pubkey: '',
      type: '',
    };

    setFormFields([...formFields, object]);
  };

  const removeFields = index => {
    const data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  return (
    <CssBaseline>
      <Head>
        <title>Open</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{OpenCommand.name}</h2>
          <h4>{OpenCommand.longDescription}</h4>
          {formFields.map((form, index) => {
            return (
              <div key={index}>
                <TextField
                  type="text"
                  label={OpenCommand.args.peerPublicKeys}
                  name={'pubkey'}
                  placeholder={OpenCommand.args.peerPublicKeys}
                  onChange={event => handleFormChange(index, event)}
                  style={styles.textField}
                  id={`pubkey-${index}`}
                />

                <TextField
                  type="text"
                  label={OpenCommand.flags.amount}
                  name={'amount'}
                  placeholder={OpenCommand.flags.amount}
                  onChange={event => handleFormChange(index, event)}
                  style={styles.textField}
                  id={`amount-${index}`}
                />

                <TextField
                  type="text"
                  label={OpenCommand.flags.coopCloseAddress}
                  name={'coopCloseAddress'}
                  placeholder={OpenCommand.flags.coopCloseAddress}
                  onChange={event => handleFormChange(index, event)}
                  style={styles.textField}
                  id={`address-${index}`}
                />

                <TextField
                  type="text"
                  label={OpenCommand.flags.give}
                  name={'give'}
                  placeholder={`${OpenCommand.flags.give} (Gift amount to peer)`}
                  onChange={event => handleFormChange(index, event)}
                  style={styles.textField}
                  id={`give-${index}`}
                />

                <FormControl sx={{ minWidth: 120, marginLeft: '10px' }}>
                  <InputLabel id="channel-type" style={styles.inputLabel}>
                    Type (Default Public)
                  </InputLabel>
                  <Select
                    label={'Type'}
                    onChange={event => handleFormChange(index, event)}
                    name={'type'}
                    style={styles.select}
                    placeholder={'type'}
                    value={formFields[index].type}
                  >
                    <MenuItem id={knownTypes[0]} value={knownTypes[0]}>
                      {knownTypes[0]}
                    </MenuItem>
                    <MenuItem id={knownTypes[1]} value={knownTypes[1]}>
                      {knownTypes[1]}
                    </MenuItem>
                    <MenuItem id={knownTypes[2]} value={knownTypes[2]}>
                      {knownTypes[2]}
                    </MenuItem>
                    <MenuItem id={knownTypes[3]} value={knownTypes[3]}>
                      {knownTypes[3]}
                    </MenuItem>
                  </Select>
                </FormControl>

                <IconButton aria-label="delete" onClick={() => removeFields(index)} style={styles.iconButton}>
                  <DeleteIcon />
                </IconButton>
              </div>
            );
          })}
          <Button href="#text-buttons" onClick={addFields} style={styles.button}>
            Add +
          </Button>
          <TextField
            type="text"
            label={OpenCommand.flags.internalFundAtFeeRate}
            name={OpenCommand.flags.internalFundAtFeeRate}
            id={OpenCommand.flags.internalFundAtFeeRate}
            placeholder={'OnChain Fee Rate'}
            onChange={handeInternalFundFeeRateChange}
            style={styles.textField}
          />
          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch
                checked={avoidBroadcast}
                onChange={handleAvoidBroadcastChange}
                id={OpenCommand.flags.avoidBroadcast}
              />
            }
            label={OpenCommand.flags.avoidBroadcast}
          />
          <TextField
            type="text"
            placeholder={globalCommands.node.name}
            label={globalCommands.node.name}
            id={globalCommands.node.value}
            onChange={handeNodeChange}
            style={styles.textField}
          />
          <br />
          <SubmitButton onClick={fetchData} disabled={disabled}>
            Validate and Open Channels
          </SubmitButton>
          {!!data ? <OpenOutput data={data.result} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Open;
