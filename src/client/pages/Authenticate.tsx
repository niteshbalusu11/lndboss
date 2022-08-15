import { CssBaseline, FormControlLabel, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import {
  StandardHomeButtonLink,
  StandardSwitch,
  StartFlexBox,
  SubmitButton,
} from '~client/standard_components/app-components';

import Head from 'next/head';
import Router from 'next/router';
import axios from 'axios';
import getConfig from 'next/config';
import { useLoading } from '~client/hooks/useLoading';
import { useNotify } from '~client/hooks/useNotify';

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

/*
  Renders the login page that takes in the macaroon, cert, and socket.
  POST call to the NestJs process to insert credentials.
  Verifies connection to LND.
*/

const styles = {
  form: {
    marginLeft: '20px',
    marginTop: '50px',
    width: '300px',
  },
  input: {
    width: '700px',
    height: '110px',
    marginBottom: '0px',
    marginTop: '0px',
  },
  inputStyle: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    '&::placeholder': {
      fontSize: '15px',
      fontWeight: 'bold',
      color: 'black',
      opacity: '0.9',
    },
  },
  h1: {
    color: 'black',
    marginTop: '50px',
  },
  inputLabel: {
    fontWeight: 'bold',
    color: 'black',
  },
  select: {
    marginBottom: '20px',
  },
};

const Authenticate = () => {
  const [cert, setCert] = useState('');
  const [macaroon, setMacaroon] = useState('');
  const [nodeName, setNodeName] = useState('');
  const [socket, setSocket] = useState('');
  const [defaultNode, setDefaultNode] = useState(true);
  const [authType, setAuthType] = useState('');
  const [networkType, setNetworkType] = useState('');
  const [directorypath, setDirectorypath] = useState('');

  const handleCertChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCert(event.target.value);
  };
  const handleMacaroonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMacaroon(event.target.value);
  };
  const handleNodeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(event.target.value);
  };
  const handleSocketChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSocket(event.target.value);
  };

  const toggleSwitch = () => {
    setDefaultNode((previousState: boolean) => !previousState);
  };

  const handleAuthTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthType(event.target.value);
    setNetworkType('');
    setDirectorypath('');
    setCert('');
    setMacaroon('');
    setSocket('');
  };

  const handleNetworkTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNetworkType(event.target.value);
  };

  const handleDirectoryPathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDirectorypath(event.target.value);
  };

  const handleEvents = async () => {
    useLoading({ isLoading: true });

    const postBody = {
      cert,
      macaroon,
      socket,
      auth_type: authType,
      is_default: defaultNode,
      lnd_directory: directorypath,
      network_type: networkType,
      node: nodeName,
    };

    try {
      const accessToken = localStorage.getItem('accessToken');

      const url = `${apiUrl}/credentials`;

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const response = await axios.post(url, postBody, config);

      const { connection, error, result } = await response.data;

      useLoading({ isLoading: false });

      if (!!error) {
        useNotify({ type: 'error', message: 'Failed to connect to LND' });
      }

      if (!result || !!connection.error) {
        useNotify({ type: 'error', message: 'Failed to connect to LND' });
      }

      if (!!result && !!connection.hasAccess) {
        Router.push('/Commands');
        useNotify({ type: 'success', message: 'Credentials saved and Authenticated to LND! 🚀' });
      }
    } catch (error) {
      useLoading({ isLoading: false });

      useNotify({ type: 'error', message: 'Failed to connect to LND' });
      useNotify({
        type: 'error',
        message: `Status: ${error.response.data.statusCode}\nMessage: ${error.response.data.message}`,
      });
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Authentication</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />

        <Stack spacing={1} sx={styles.form}>
          <h2 style={styles.h1}>Authenticate</h2>
          <InputLabel id="authtype" sx={styles.inputLabel}>
            Pick a Authentication Type (Required)
          </InputLabel>
          <Select
            labelId="authtypelabel"
            id="selectauthtype"
            value={authType}
            onChange={handleAuthTypeChange}
            label="Authentication Type"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={`path`} id={`path`}>
              {`Path to LND Directory`}
            </MenuItem>
            <MenuItem value={`credentials`} id={`credentials`}>
              {`Credentials`}
            </MenuItem>
          </Select>

          {authType !== '' ? (
            <>
              <TextField
                type="text"
                placeholder="Saved Node Name"
                sx={styles.input}
                id="node"
                onChange={handleNodeNameChange}
                inputProps={{
                  sx: styles.inputStyle,
                }}
              />
              <FormControlLabel
                control={<StandardSwitch checked={defaultNode} onChange={toggleSwitch} id="default-node" />}
                label="Is Default Node?"
              />
            </>
          ) : null}

          {authType === 'credentials' ? (
            <>
              <TextField
                type="text"
                placeholder="TLS Cert"
                sx={styles.input}
                inputProps={{
                  sx: styles.inputStyle,
                }}
                id="cert"
                onChange={handleCertChange}
              />
              <TextField
                type="password"
                placeholder="Admin/Nospend Macaroon"
                sx={styles.input}
                inputProps={{
                  sx: styles.inputStyle,
                }}
                id="macaroon"
                onChange={handleMacaroonChange}
              />
              <TextField
                type="text"
                placeholder="Socket (host:port)"
                sx={styles.inputStyle}
                id="socket"
                inputProps={{
                  sx: styles.inputStyle,
                }}
                onChange={handleSocketChange}
              />
              <SubmitButton
                variant="contained"
                onClick={handleEvents}
                disabled={!cert || !macaroon || !nodeName || !socket}
              >
                Authenticate
              </SubmitButton>
            </>
          ) : null}

          {authType === 'path' ? (
            <>
              <InputLabel id="network" sx={styles.inputLabel}>
                Pick a Network (Required)
              </InputLabel>
              <Select
                labelId="networklabel"
                id="selectnetwork"
                value={networkType}
                onChange={handleNetworkTypeChange}
                label="Network Type"
                sx={styles.select}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={`mainnet`} id={`mainnet`}>
                  {`Mainnet (Real Bitcoin)`}
                </MenuItem>
                <MenuItem value={`signet`} id={`signet`}>
                  {`Signet`}
                </MenuItem>
                <MenuItem value={`regtest`} id={`regtest`}>
                  {`Regtest`}
                </MenuItem>
                <MenuItem value={`testnet`} id={`testnet`}>
                  {`Testnet`}
                </MenuItem>
              </Select>
              <TextField
                type="text"
                placeholder="Path to LND Directory"
                sx={styles.input}
                id="directorypath"
                inputProps={{
                  sx: styles.inputStyle,
                }}
                onChange={handleDirectoryPathChange}
              />
              <TextField
                type="text"
                placeholder="Socket (host:port)"
                sx={styles.inputStyle}
                id="socket"
                inputProps={{
                  sx: styles.inputStyle,
                }}
                onChange={handleSocketChange}
              />
              <SubmitButton
                variant="contained"
                onClick={handleEvents}
                disabled={!directorypath || !networkType || !nodeName || !socket}
              >
                Authenticate
              </SubmitButton>
            </>
          ) : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Authenticate;
