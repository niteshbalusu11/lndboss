import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components';

import { createUseStyles } from 'react-jss';
import { usePasswordValidation } from '~client/hooks/usePasswordValidation';

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
  ul: {
    fontWeight: 'bold',
  },
});

const Register = () => {
  const [accountName, setAccountName] = useState('');

  const [password, setPassword] = useState({
    firstPassword: '',
    secondPassword: '',
  });

  const handleAccountNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(event.target.value);
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

  const isDisabled = !validLength || !hasNumber || !upperCase || !lowerCase || !match || !specialChar || !accountName;

  const classes = styles();
  return (
    <CssBaseline>
      <StartFlexBox>
        <StandardButtonLink destination="/auth/Login" label="Login" />
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
            onChange={setFirst}
            inputProps={{
              className: classes.inputStyle,
            }}
          />
          <TextField
            type="password"
            placeholder="Retype Password"
            label="Retype Password"
            id="retypePassword"
            onChange={setSecond}
            className={classes.input}
            inputProps={{
              className: classes.inputStyle,
            }}
          />
          <div>
            <ul className={classes.ul}>
              <li>8 Characters: {!!validLength ? <span>✅</span> : <span>👎</span>}</li>
              <li>Has a Number: {!!hasNumber ? <span>✅</span> : <span>👎</span>}</li>
              <li>UpperCase: {!!upperCase ? <span>✅</span> : <span>👎</span>}</li>
              <li>LowerCase: {!!lowerCase ? <span>✅</span> : <span>👎</span>}</li>
              <li>Special Character: {!!specialChar ? <span>✅</span> : <span>👎</span>}</li>
              <li>Match: {!!match ? <span>✅</span> : <span>👎</span>}</li>
            </ul>
          </div>
          <SubmitButton variant="contained" disabled={isDisabled}>
            Register
          </SubmitButton>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Register;
