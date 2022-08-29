import * as types from '~shared/types';

import {
  Button,
  CssBaseline,
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

import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';
import Link from 'next/link';

const LnurlCommand = commands.find(n => n.value === 'Lnurl');

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '700px',
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
  inputLabel: {
    fontWeight: 'bold',
    color: 'black',
  },
  select: {
    width: '300px',
  },
};

const Lnurl = () => {
  const [node, setNode] = useState('');
  const [amount, setAmount] = useState('');
  const [avoid, setAvoid] = useState([{ avoid: '' }]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [lnurlFunction, setLnurlFunction] = useState('');
  const [maxFee, setMaxFee] = useState('');
  const [maxPaths, setMaxPaths] = useState('');
  const [out, setOut] = useState([{ out: '' }]);
  const [url, setUrl] = useState('');

  const handleLnurlFunctionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLnurlFunction(event.target.value);
  };

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleMaxFeeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxFee(event.target.value);
  };

  const handleMaxPathsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPaths(event.target.value);
  };

  // ==================== Avoid ====================
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

  // ==================== Out ====================

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

  // ========================================

  const handleIsPrivateChange = () => {
    setIsPrivate((previousState: boolean) => !previousState);
  };

  const flags: types.commandLnurl = {
    node,
    url,
    amount: Number(amount),
    avoid: avoid.map(n => n.avoid),
    function: lnurlFunction,
    is_private: isPrivate,
    max_fee: Number(maxFee),
    max_paths: Number(maxPaths),
    out: out.map(n => n.out),
  };

  return (
    <CssBaseline>
      <Head>
        <title>Lnurl</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{LnurlCommand.name}</h2>
          <h4>{LnurlCommand.longDescription}</h4>
          <div>
            <InputLabel id="lnurl-function" style={styles.inputLabel}>
              Pick a value (Required)
            </InputLabel>
            <Select
              labelId="function"
              id="function"
              value={lnurlFunction}
              onChange={handleLnurlFunctionChange}
              label="Lnurl Function"
              style={styles.select}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={LnurlCommand.args.auth} id={LnurlCommand.args.auth}>
                {LnurlCommand.args.auth}
              </MenuItem>
              <MenuItem value={LnurlCommand.args.channel} id={LnurlCommand.args.channel}>
                {LnurlCommand.args.channel}
              </MenuItem>
              <MenuItem value={LnurlCommand.args.pay} id={LnurlCommand.args.pay}>
                {LnurlCommand.args.pay}
              </MenuItem>
              <MenuItem value={LnurlCommand.args.withdraw} id={LnurlCommand.args.withdraw}>
                {LnurlCommand.args.withdraw}
              </MenuItem>
            </Select>
          </div>

          <TextField
            type="text"
            placeholder={`${LnurlCommand.flags.url} (Lnurl/Lightning Address)`}
            label={LnurlCommand.flags.url}
            id={LnurlCommand.flags.url}
            onChange={handleUrlChange}
            style={styles.textField}
          />

          {lnurlFunction === 'channel' && (
            <FormControlLabel
              control={
                <StandardSwitch
                  checked={isPrivate}
                  onChange={handleIsPrivateChange}
                  id={LnurlCommand.flags.is_private}
                />
              }
              style={styles.switch}
              label={LnurlCommand.flags.is_private}
            />
          )}

          {lnurlFunction === 'pay' && (
            <>
              <>
                <Button href="#text-buttons" onClick={() => addAvoidFields()} style={styles.button}>
                  Add +
                </Button>
                {avoid.map((element, index) => (
                  <div key={index}>
                    <TextField
                      type="text"
                      label={LnurlCommand.flags.avoid}
                      name={LnurlCommand.flags.avoid}
                      placeholder={`${LnurlCommand.flags.avoid} (Avoid forwarding through)`}
                      value={element.avoid}
                      onChange={e => handleAvoidChange(index, e)}
                      style={styles.textField}
                      id={`avoid-${index}`}
                    />
                    {!!index ? (
                      <IconButton
                        aria-label="delete"
                        onClick={() => removeAvoidFields(index)}
                        style={styles.iconButton}
                      >
                        <DeleteIcon />
                      </IconButton>
                    ) : null}
                  </div>
                ))}
              </>

              <>
                <Button href="#text-buttons" onClick={() => addOutFields()} style={styles.button}>
                  Add +
                </Button>
                {out.map((element, index) => (
                  <div key={index}>
                    <TextField
                      type="text"
                      label={LnurlCommand.flags.out}
                      name={LnurlCommand.flags.out}
                      placeholder={`${LnurlCommand.flags.out} (Make first hop through peer)`}
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
                style={styles.textField}
                id={LnurlCommand.flags.max_fee}
                label={LnurlCommand.flags.max_fee}
                value={maxFee}
                onChange={handleMaxFeeChange}
              />
              <TextField
                style={styles.textField}
                id={LnurlCommand.flags.max_paths}
                label={LnurlCommand.flags.max_paths}
                value={maxPaths}
                onChange={handleMaxPathsChange}
              />
            </>
          )}

          {(lnurlFunction === 'withdraw' || lnurlFunction === 'pay') && (
            <TextField
              style={styles.textField}
              id={LnurlCommand.flags.amount}
              label={LnurlCommand.flags.amount}
              value={amount}
              onChange={handleAmountChange}
            />
          )}

          <TextField
            type="text"
            placeholder={globalCommands.node.name}
            label={globalCommands.node.name}
            id={globalCommands.node.value}
            onChange={handeNodeChange}
            style={styles.textField}
          />
          <Link href={{ pathname: `/result/LnurlResult`, query: flags }} passHref>
            <a target="_blank" rel="noreferrer">
              <SubmitButton>Run Command</SubmitButton>
            </a>
          </Link>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Lnurl;
