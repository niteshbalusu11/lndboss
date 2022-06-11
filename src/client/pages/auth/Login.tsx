import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components';

import { createUseStyles } from 'react-jss';

const styles = createUseStyles({
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
});

const Login = () => {
  const classes = styles();

  const [accountName, setAccountName] = useState('');

  const [password, setPassword] = useState('');

  const handleAccountNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <CssBaseline>
      <StartFlexBox>
        <StandardButtonLink destination="/auth/Register" label="Register" />
        <Stack spacing="3" className={classes.form}>
          <TextField
            type="text"
            placeholder="Account Name"
            label="Account Name"
            id="accountName"
            className={classes.input}
            inputProps={{
              className: classes.inputStyle,
            }}
            onChange={handleAccountNameChange}
          />
          <TextField
            type="password"
            placeholder="Password"
            label="Password"
            id="password"
            className={classes.input}
            inputProps={{
              className: classes.inputStyle,
            }}
            onChange={handlePasswordChange}
          />
          <SubmitButton variant="contained" disabled={!accountName || !password}>
            Login
          </SubmitButton>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Login;
