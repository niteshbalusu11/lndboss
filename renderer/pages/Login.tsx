import { Alert, CssBaseline, Dialog, TextField } from '@mui/material';
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import SubmitButton from '../standard_components/SubmitButton';
import StandardButtonLink from '../standard_components/StandardButtonLink';
import StartFlexBox from '../standard_components/StartFlexBox';

const styles = createUseStyles({
  form: {
    marginLeft: '50px',
    marginTop: '50px',
  },
  input: {
    width: '700px',
    height: '110px',
    marginBottom: '10px',
    marginTop: '10px',
  },
  inputStyle: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    '&::placeholder': {
      fontSize: '15px',
      fontWeight: 'bold',
      color: 'white',
      opacity: '0.9',
    },
  },
  h1: {
    color: 'black',
    marginTop: '50px',
  },
  sx: {
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(200.96deg, #fedc2a -29.09%, #dd5789 51.77%, #7a2c9e 129.35%)',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'start',
    flexGrow: 1,
  },
});

const Login = () => {
  const [macaroon, setMacaroon] = useState('');
  const [cert, setCert] = useState('');
  const [socket, setSocket] = useState('');
  const [successDialog, setSuccessDialog] = useState(false);
  const [failureDialog, setFailureDialog] = useState(false);

  const classes = styles();

  const handleMacaroonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMacaroon(event.target.value);
  };
  const handleCertChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCert(event.target.value);
  };
  const handleSocketChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSocket(event.target.value);
  };

  const handleEvents = async () => {
    const args = {
      macaroon,
      cert,
      socket,
    };

    const { error, result } = await window.electronAPI.credentialsCreate(args);

    const checkConnection = await window.electronAPI.checkconnectionGet();

    if (!!error) {
      setFailureDialog(true);
    }

    if (!result || !!checkConnection.error) {
      setFailureDialog(true);
    }

    if (!!result && !!checkConnection.publicKey) {
      setSuccessDialog(true);
    }
  };

  const handleSuccessClick = () => {
    setSuccessDialog(!successDialog);
  };

  const handleFailureClick = () => {
    setFailureDialog(!failureDialog);
  };

  return (
    <CssBaseline>
      <StartFlexBox>
        <StandardButtonLink label="Home" destination="/home" />
        <form className={classes.form}>
          <h1 className={classes.h1}>Authenticate</h1>
          <div>
            <TextField
              type="password"
              placeholder="TLS Cert"
              className={classes.input}
              multiline
              id="cert"
              inputProps={{
                className: classes.inputStyle,
              }}
              onChange={handleCertChange}
            />
          </div>
          <div>
            <TextField
              type="password"
              placeholder="Admin/Read-Only Macaroon"
              className={classes.input}
              id="macaroon"
              inputProps={{
                className: classes.inputStyle,
              }}
              onChange={handleMacaroonChange}
            />
          </div>

          <div>
            <TextField
              type="text"
              placeholder="Socket (host:port)"
              className={classes.inputStyle}
              id="socket"
              inputProps={{
                className: classes.inputStyle,
              }}
              onChange={handleSocketChange}
            />
          </div>
          <SubmitButton variant="contained" onClick={handleEvents} disabled={!cert || !macaroon || !socket}>
            Authenticate
          </SubmitButton>
        </form>
        <Dialog open={successDialog} onClose={handleSuccessClick}>
          <Alert severity="success">Credentials saved and Authenticated to LND!</Alert>
        </Dialog>
        <Dialog open={failureDialog} onClose={handleFailureClick}>
          <Alert severity="error">Failed to connect to LND!</Alert>
        </Dialog>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Login;
