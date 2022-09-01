import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';

import Head from 'next/head';
import Router from 'next/router';
import axios from 'axios';
import { clientConstants } from '~client/utils/constants';
import getConfig from 'next/config';
import { useNotify } from '~client/hooks/useNotify';
import { usePasswordValidation } from '~client/hooks/usePasswordValidation';

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

/*
  Renders the register page
  POST call to the NestJs process to insert auth credentials and redirect to login page on success.
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '700px',
  },
  textField: {
    width: '300px',
    marginTop: '10px',
  },
  h4: {
    marginTop: '0px',
  },
  ul: {
    fontWeight: 'bold',
  },
};

const Register = () => {
  const [username, setUserName] = useState('');

  const [password, setPassword] = useState({
    firstPassword: '',
    secondPassword: '',
  });

  const handleAccountNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const [validLength, hasNumber, upperCase, lowerCase, match, specialChar]: boolean[] = usePasswordValidation({
    firstPassword: password.firstPassword,
    secondPassword: password.secondPassword,
    requiredLength: 8,
  });

  const setFirst = (event: { target: { value: string } }) => {
    setPassword({ ...password, firstPassword: event.target.value });
  };
  const setSecond = (event: { target: { value: string } }) => {
    setPassword({ ...password, secondPassword: event.target.value });
  };

  const isDisabled = !validLength || !hasNumber || !upperCase || !lowerCase || !match || !specialChar || !username;

  const fetchData = async () => {
    const url = `${apiUrl}/auth/register`;

    try {
      const response = await axios.post(url, {
        headers: { 'Content-Type': 'application/json' },
        password: password.firstPassword,
        username,
      });

      const result: boolean = await response.data;

      if (!!result) {
        Router.push('/auth/Login');
        useNotify({ type: 'success', message: 'Account created successfully' });
      } else {
        useNotify({ type: 'error', message: 'Failed to create account' });
      }
    } catch (error) {
      useNotify({
        type: 'error',
        message: `Status: ${error.response.status}\nMessage: ${error.response.data.message}`,
      });
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Balance</title>
      </Head>
      <StartFlexBox>
        <StandardButtonLink destination={clientConstants.loginUrl} label="Login" />
        <Stack spacing="3" style={styles.form}>
          <h2>Setup Credentials</h2>
          <TextField
            type="text"
            placeholder="Account Name"
            label="Account Name"
            id="accountName"
            style={styles.textField}
            onChange={handleAccountNameChange}
          />
          <TextField
            type="password"
            placeholder="Password"
            label="Password"
            id="password"
            style={styles.textField}
            onChange={setFirst}
          />
          <TextField
            type="password"
            placeholder="Retype Password"
            label="Retype Password"
            id="retypePassword"
            onChange={setSecond}
            style={styles.textField}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                fetchData();
              }
            }}
          />
          <div>
            <ul style={styles.ul}>
              <li>8 Characters: {!!validLength ? <span>✅</span> : <span>👎</span>}</li>
              <li>Has a Number: {!!hasNumber ? <span>✅</span> : <span>👎</span>}</li>
              <li>UpperCase: {!!upperCase ? <span>✅</span> : <span>👎</span>}</li>
              <li>LowerCase: {!!lowerCase ? <span>✅</span> : <span>👎</span>}</li>
              <li>Special Character: {!!specialChar ? <span>✅</span> : <span>👎</span>}</li>
              <li>Match: {!!match ? <span>✅</span> : <span>👎</span>}</li>
            </ul>
          </div>
          <SubmitButton variant="contained" disabled={isDisabled} onClick={fetchData}>
            Create Account
          </SubmitButton>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Register;
