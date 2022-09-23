import { Button, CssBaseline, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import commands, { globalCommands } from '../../commands';

import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';
import { PeersAndTagsList } from '~client/standard_components/lndboss';

const FeesCommand = commands.find(n => n.value === 'Fees');

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '700px',
  },
  textField: {
    width: '500px',
  },
  h4: {
    marginTop: '0px',
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
};

const Fees = () => {
  const [cltvDelta, setCltvDelta] = useState(undefined);
  const [feeRate, setFeeRate] = useState(undefined);
  const [node, setNode] = useState(undefined);
  const [formValues, setFormValues] = useState([{ to: '' }]);
  const [peer, setPeer] = useState(undefined);

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleFeeRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeeRate(event.target.value);
  };

  const handleCltvDeltaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCltvDelta(event.target.value);
  };

  // ============================================================================
  const removeFormFields = (i: number) => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const addFormFields = () => {
    setFormValues([...formValues, { to: '' }]);
  };

  return (
    <CssBaseline>
      <Head>
        <title>Fees</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />

        <Stack style={styles.form}>
          <h2>{FeesCommand.name}</h2>
          <h4 style={styles.h4}>{FeesCommand.longDescription}</h4>

          <TextField
            type="text"
            placeholder="Fee Rate"
            label={FeesCommand.flags.set_fee_rate}
            id={FeesCommand.flags.set_fee_rate}
            onChange={handleFeeRateChange}
            style={styles.textField}
          />

          <TextField
            type="text"
            placeholder="Cltv Delta"
            label={FeesCommand.flags.set_cltv_delta}
            id={FeesCommand.flags.set_cltv_delta}
            onChange={handleCltvDeltaChange}
            style={styles.textField}
          />

          {/* <PeersAndTagsList
            setPeer={setOutPeer}
            label={FeesCommand.flags.to}
            placeholder={`${FeesCommand.flags.to} (Set fees to key/tag)`}
            id={FeesCommand.flags.to}
          /> */}

          <>
            <Button href="#text-buttons" onClick={() => addFormFields()} style={styles.button}>
              Add +
            </Button>
            {formValues.map((element, index) => (
              <div key={index}>
                <PeersAndTagsList
                  setPeer={setPeer}
                  label={FeesCommand.flags.to}
                  placeholder={`${FeesCommand.flags.to} (Set fees to key/tag)`}
                  id={`to-${index}`}
                />
                {!!index ? (
                  <IconButton aria-label="delete" onClick={() => removeFormFields(index)} style={styles.iconButton}>
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
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Fees;
