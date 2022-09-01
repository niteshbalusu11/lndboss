import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';

import Router from 'next/router';
import axios from 'axios';
import { clientConstants } from '~client/utils/constants';
import getConfig from 'next/config';
import { useNotify } from '~client/hooks/useNotify';

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;
/*
  Renders the login page
  POST call to the NestJs process to verify credentials and get back JWT token.
*/

const styles = {
  form: {
    marginLeft: '20px',
    marginTop: '100px',
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
};

const Login = () => {
  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const handleAccountNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const loginUser = async () => {
    const url = `${apiUrl}/auth/login`;

    try {
      const response = await axios.post(url, {
        headers: { 'Content-Type': 'application/json' },
        password,
        username,
      });

      const data = await response.data;

      if (!data.accessToken) {
        window.alert('ErrorRetrievingAccessToken');
      }

      localStorage.setItem('accessToken', data.accessToken);

      Router.push(clientConstants.dashboardPage);
      useNotify({ type: 'success', message: 'Successfully logged in' });
    } catch (error) {
      useNotify({
        type: 'error',
        message: `Status: ${error.response.status}\nMessage: ${error.response.data.message}`,
      });
    }
  };

  return (
    <CssBaseline>
      <StartFlexBox>
        <StandardButtonLink destination={clientConstants.registerUrl} label="Setup Credentials" />
        <Stack spacing="3" style={styles.form}>
          <h2>Login</h2>
          <TextField
            type="text"
            placeholder="Account Name"
            label="Account Name"
            id="accountName"
            style={styles.input}
            onChange={handleAccountNameChange}
          />
          <TextField
            type="password"
            placeholder="Password"
            label="Password"
            id="password"
            style={styles.input}
            onChange={handlePasswordChange}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                loginUser();
              }
            }}
          />
          <SubmitButton variant="contained" disabled={!username || !password} onClick={loginUser}>
            Login
          </SubmitButton>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Login;
