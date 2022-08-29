import * as types from '~shared/types';

import { Button, CssBaseline, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import commands, { globalCommands } from '~client/commands';

import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';
import Link from 'next/link';

const PayCommand = commands.find(n => n.value === 'Pay');

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
  const [avoid, setAvoid] = useState([{ avoid: '' }]);
  const [inPeer, setInPeer] = useState(undefined);
  const [out, setOut] = useState([{ out: '' }]);
  const [maxFee, setMaxFee] = useState('1337');
  const [maxPaths, setMaxPaths] = useState('');
  const [message, setMessage] = useState('');
  const [paymentRequest, setPaymentRequest] = useState('');

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
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
  // =====================================================================================
  const addOutFields = () => {
    setOut([...out, { out: '' }]);
  };

  const removeOutFields = (i: number) => {
    const newFormValues = [...out];
    newFormValues.splice(i, 1);
    setOut(newFormValues);
  };

  const handleOutChange = (i: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormValues = [...out];
    newFormValues[i].out = e.target.value;
    setOut(newFormValues);
  };

  // =====================================================================================
  const handleInPeerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInPeer(e.target.value);
  };

  const handleMaxFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxFee(e.target.value);
  };

  const handleMaxPathsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPaths(e.target.value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handlePaymentRequestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentRequest(e.target.value);
  };

  const flags: types.commandPay = {
    message,
    node,
    avoid: avoid.map(n => n.avoid),
    in_through: inPeer,
    max_fee: Number(maxFee),
    max_paths: Number(maxPaths),
    out: out.map(n => n.out),
    request: paymentRequest,
  };

  return (
    <CssBaseline>
      <Head>
        <title>Pay</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{PayCommand.name}</h2>
          <h4>{PayCommand.description}</h4>
          <TextField
            type="text"
            placeholder={`${PayCommand.args.request} (Payment Request)`}
            label={PayCommand.args.request}
            id={PayCommand.args.request}
            onChange={handlePaymentRequestChange}
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
                  label={PayCommand.flags.avoid}
                  name={PayCommand.flags.avoid}
                  placeholder={`${PayCommand.flags.avoid} (Avoid forwarding through)`}
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
          <TextField
            type="text"
            placeholder={`${PayCommand.flags.max_fee} (Maximum fee to pay)`}
            label={PayCommand.flags.max_fee}
            id={PayCommand.flags.max_fee}
            onChange={handleMaxFeeChange}
            style={styles.textField}
          />

          <TextField
            type="text"
            placeholder={`${PayCommand.flags.max_paths} (Maximum paths to use)`}
            label={PayCommand.flags.max_paths}
            id={PayCommand.flags.max_paths}
            onChange={handleMaxPathsChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder={`${PayCommand.flags.message} (Message to include with payment)`}
            label={PayCommand.flags.message}
            id={PayCommand.flags.message}
            onChange={handleMessageChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder={`${PayCommand.flags.in} (Route in through a specific node)`}
            label={PayCommand.flags.in}
            id={PayCommand.flags.in}
            onChange={handleInPeerChange}
            style={styles.textField}
          />

          <>
            <Button href="#text-buttons" onClick={() => addOutFields()} style={styles.button}>
              Add +
            </Button>
            {out.map((element, index) => (
              <div key={index}>
                <TextField
                  type="text"
                  label={PayCommand.flags.out}
                  name={PayCommand.flags.out}
                  placeholder={`${PayCommand.flags.out} (Make first hop through peer)`}
                  value={element.out}
                  onChange={e => handleOutChange(index, e)}
                  style={styles.textField}
                  id={`out-${index}`}
                />
                {!!index ? (
                  <IconButton aria-label="delete" onClick={() => removeOutFields(index)} style={styles.iconButton}>
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
            onChange={handeNodeChange}
            style={styles.textField}
          />
          <Link href={{ pathname: `/result/PayResult`, query: flags }} passHref>
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
