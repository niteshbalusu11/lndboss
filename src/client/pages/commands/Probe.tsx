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

const ProbeCommand = commands.find(n => n.value === 'Probe');

/*
  Renders the bos probe command
  GET call to the NestJs process to execute to probe a node on the network.
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

const Probe = () => {
  const [node, setNode] = useState('');
  const [amount, setAmount] = useState('');
  const [avoid, setAvoid] = useState([{ avoid: '' }]);
  const [destination, setDestination] = useState('');
  const [findMax, setFindMax] = useState(false);
  const [inPeer, setInPeer] = useState(undefined);
  const [maxPaths, setMaxPaths] = useState('');
  const [outPeer, setOutPeer] = useState([{ outPeer: '' }]);

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

  const handleFindMaxChange = () => {
    setFindMax((previousState: boolean) => !previousState);
  };

  const handleInPeerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInPeer(event.target.value);
  };

  const handleMaxPathsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPaths(event.target.value);
  };

  const addOutPeerFields = () => {
    setOutPeer([...outPeer, { outPeer: '' }]);
  };

  const removeOutPeerFields = (i: number) => {
    const newFormValues = [...outPeer];
    newFormValues.splice(i, 1);
    setOutPeer(newFormValues);
  };

  const handleOutPeerChange = (i: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormValues = [...outPeer];
    newFormValues[i].outPeer = e.target.value;
    setOutPeer(newFormValues);
  };

  const flags: types.commandProbe = {
    destination,
    node,
    avoid: avoid.map(n => n.avoid),
    find_max: findMax,
    in_through: inPeer,
    max_paths: Number(maxPaths),
    out: outPeer.map(n => n.outPeer),
    tokens: amount,
  };

  return (
    <CssBaseline>
      <Head>
        <title>Probe Command</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{ProbeCommand.name}</h2>
          <h4>{ProbeCommand.longDescription}</h4>
          <TextField
            type="text"
            placeholder={`${ProbeCommand.args.to} (Pubkey)`}
            label={ProbeCommand.args.to}
            id={ProbeCommand.args.to}
            onChange={handleDestinationChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder={`${ProbeCommand.args.amount} (Amount to probe destination, (default 1))`}
            label={ProbeCommand.args.amount}
            id={ProbeCommand.args.amount}
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
                  label={ProbeCommand.flags.avoid}
                  name={ProbeCommand.flags.avoid}
                  placeholder={`${ProbeCommand.flags.avoid} (Avoid forwarding via node/chan/tag)`}
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
              <StandardSwitch checked={findMax} onChange={handleFindMaxChange} id={ProbeCommand.flags.find_max} />
            }
            label={ProbeCommand.flags.find_max}
          />
          <TextField
            type="text"
            placeholder={`${ProbeCommand.flags.in} (Route through specific peer of destination)`}
            label={ProbeCommand.flags.in}
            id={ProbeCommand.flags.in}
            onChange={handleInPeerChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder={`${ProbeCommand.flags.max_paths} (Maximum paths to use for find-max)`}
            label={ProbeCommand.flags.max_paths}
            id={ProbeCommand.flags.max_paths}
            onChange={handleMaxPathsChange}
            style={styles.textField}
          />
          <>
            <Button href="#text-buttons" onClick={() => addOutPeerFields()} style={styles.button}>
              Add +
            </Button>
            {outPeer.map((element, index) => (
              <div key={index}>
                <TextField
                  type="text"
                  label={ProbeCommand.flags.out}
                  name={ProbeCommand.flags.out}
                  placeholder={`${ProbeCommand.flags.out} (Make first hop through peer)`}
                  value={element.outPeer}
                  onChange={e => handleOutPeerChange(index, e)}
                  style={styles.textField}
                  id={`outPeer-${index}`}
                />
                {!!index ? (
                  <IconButton aria-label="delete" onClick={() => removeOutPeerFields(index)} style={styles.iconButton}>
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
          <Link href={{ pathname: `/result/ProbeResult`, query: flags }} passHref>
            <a target="_blank" rel="noreferrer">
              <SubmitButton>Run Command</SubmitButton>
            </a>
          </Link>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Probe;
