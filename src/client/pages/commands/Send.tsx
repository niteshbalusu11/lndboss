import * as types from '~shared/types';

import { Button, CssBaseline, FormControlLabel, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import {
  StandardHomeButtonLink,
  StandardSwitch,
  StartFlexBox,
  SubmitButton,
} from '~client/standard_components/app-components';
import commands, { globalCommands } from '~client/commands';

import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';
import Link from 'next/link';

const SendCommand = commands.find(n => n.value === 'Send');

/*
  Renders the bos send command
  GET call to the NestJs process to execute a keysend or lnurl pay
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
  pre: {
    fontWeight: 'bold',
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
  url: {
    fontWeight: 'bold',
    color: 'blue',
  },
};

const Send = () => {
  const [node, setNode] = useState('');
  const [amount, setAmount] = useState('');
  const [avoid, setAvoid] = useState([{ avoid: '' }]);
  const [destination, setDestination] = useState('');
  const [inPeer, setInPeer] = useState(undefined);
  const [isDryrun, setIsDryRun] = useState(false);
  const [outPeer, setOutPeer] = useState(undefined);
  const [maxFee, setMaxFee] = useState('1337');
  const [maxFeeRate, setMaxFeeRate] = useState('');
  const [message, setMessage] = useState('');
  const [isOmittingMessageFrom, setIsOmittingMessageFrom] = useState(false);

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleDestinationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(event.target.value);
  };

  const addAvoidFields = () => {
    setAvoid([...avoid, { avoid: '' }]);
  };

  const removeAvoidFields = (i: number) => {
    const newFormValues = [...avoid];
    newFormValues.splice(i, 1);
    setAvoid(newFormValues);
  };

  const handleAvoidChange = (i: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormValues = [...avoid];
    newFormValues[i].avoid = e.target.value;
    setAvoid(newFormValues);
  };

  const handleDryrunChange = () => {
    setIsDryRun((previousState: boolean) => !previousState);
  };

  const handleInPeerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInPeer(e.target.value);
  };

  const handleOutPeerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOutPeer(e.target.value);
  };

  const handleIsOmittingMessageFromChange = () => {
    setIsOmittingMessageFrom((previousState: boolean) => !previousState);
  };

  const handleMaxFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxFee(e.target.value);
  };

  const handleMaxFeeRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxFeeRate(e.target.value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const flags: types.commandSend = {
    amount,
    destination,
    message,
    node,
    avoid: avoid.map(n => n.avoid),
    in_through: inPeer,
    is_dry_run: isDryrun,
    is_omitting_message_from: isOmittingMessageFrom,
    max_fee: Number(maxFee),
    max_fee_rate: Number(maxFeeRate),
    out_through: outPeer,
  };

  return (
    <CssBaseline>
      <Head>
        <title>Send</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{SendCommand.name}</h2>
          <h4>{SendCommand.longDescription}</h4>
          <TextField
            type="text"
            placeholder={`${SendCommand.args.destination} (Pubkey/lnurl/lightning address)`}
            label={SendCommand.args.destination}
            id={SendCommand.args.destination}
            onChange={handleDestinationChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder={`${SendCommand.flags.amount} (Amount to send to destination, (default 1))`}
            label={SendCommand.flags.amount}
            id={SendCommand.flags.amount}
            onChange={handleAmountChange}
            style={styles.textField}
          />
          <>
            <Button href="#text-buttons" onClick={() => addAvoidFields()} style={styles.button}>
              Add +
            </Button>
            {avoid.map((element, index) => (
              <div key={index}>
                <TextField
                  type="text"
                  label={SendCommand.flags.avoid}
                  name={SendCommand.flags.avoid}
                  placeholder={`${SendCommand.flags.avoid} (Avoid forwarding through)`}
                  value={element.avoid}
                  onChange={e => handleAvoidChange(index, e)}
                  style={styles.textField}
                  id={`avoid-${index}`}
                />
                {!!index ? (
                  <IconButton aria-label="delete" onClick={() => removeAvoidFields(index)} style={styles.iconButton}>
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </div>
            ))}
          </>
          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch checked={isDryrun} onChange={handleDryrunChange} id={SendCommand.flags.is_dry_run} />
            }
            label={SendCommand.flags.is_dry_run}
          />
          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch
                checked={isOmittingMessageFrom}
                onChange={handleIsOmittingMessageFromChange}
                id={SendCommand.flags.is_omitting_message_from}
              />
            }
            label={SendCommand.flags.is_omitting_message_from}
          />
          <TextField
            type="text"
            placeholder={`${SendCommand.flags.max_fee} (Maximum fee to pay)`}
            label={SendCommand.flags.max_fee}
            id={SendCommand.flags.max_fee}
            onChange={handleMaxFeeChange}
            style={styles.textField}
          />

          <TextField
            type="text"
            placeholder={`${SendCommand.flags.max_fee_rate} (Maximum fee rate to pay)`}
            label={SendCommand.flags.max_fee_rate}
            id={SendCommand.flags.max_fee_rate}
            onChange={handleMaxFeeRateChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder={`${SendCommand.flags.message} (Message to include with payment)`}
            label={SendCommand.flags.message}
            id={SendCommand.flags.message}
            onChange={handleMessageChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder={`${SendCommand.flags.in_through} (Route in through a specific node)`}
            label={SendCommand.flags.in_through}
            id={SendCommand.flags.in_through}
            onChange={handleInPeerChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder={`${SendCommand.flags.out_through} (Route out through a specific peer)`}
            label={SendCommand.flags.out_through}
            id={SendCommand.flags.out_through}
            onChange={handleOutPeerChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder={globalCommands.node.name}
            label={globalCommands.node.name}
            id={globalCommands.node.value}
            onChange={handeNodeChange}
            style={styles.textField}
          />
          <Link href={{ pathname: `/result/SendResult`, query: flags }} passHref>
            <a target="_blank" rel="noreferrer">
              <SubmitButton>Run Command</SubmitButton>
            </a>
          </Link>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Send;
