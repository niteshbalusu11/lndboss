import * as types from '~shared/types';

import { Button, CssBaseline, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import commands, { globalCommands } from '../../commands';

import DeleteIcon from '@mui/icons-material/Delete';
import { FeesOutput } from '~client/output';
import Head from 'next/head';
import Link from 'next/link';
import { axiosPostWithAlert } from '~client/utils/axios';
import { clientConstants } from '~client/utils/constants';

const FeesCommand = commands.find(n => n.value === 'Fees');

/*
  Renders the bos fees command
  POST call to the NestJs process to get fees information
*/

const Fees = () => {
  const [cltvDelta, setCltvDelta] = useState(undefined);
  const [data, setData] = useState(undefined);
  const [feeRate, setFeeRate] = useState(undefined);
  const [formValues, setFormValues] = useState([{ node: '' }]);
  const [node, setNode] = useState(undefined);

  const handleNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    setFormValues([...formValues, { node: '' }]);
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  // ============================================================================

  const fetchData = async () => {
    const query: types.commandFees = {
      node,
      cltv_delta: Number(cltvDelta),
      fee_rate: feeRate,
      to: formValues.map(n => n.node),
    };

    const result = await axiosPostWithAlert({ path: 'fees', postBody: query });

    if (!!result) {
      setData(result);
    }
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

          <Link href={{ pathname: clientConstants.feeStrategyPath }} style={styles.url} target={'_blank'}>
            Click to view current scheduled jobs
          </Link>

          <TextField
            type="text"
            placeholder="Fee Rate (Optional)"
            label={FeesCommand.flags.set_fee_rate}
            id={FeesCommand.flags.set_fee_rate}
            onChange={handleFeeRateChange}
            style={styles.textField}
          />

          <TextField
            type="text"
            placeholder="Cltv Delta (Optional)"
            label={FeesCommand.flags.set_cltv_delta}
            id={FeesCommand.flags.set_cltv_delta}
            onChange={handleCltvDeltaChange}
            style={styles.textField}
          />

          <>
            <Button href="#text-buttons" onClick={() => addFormFields()} style={styles.button}>
              Add +
            </Button>
            {formValues.map((element, index) => (
              <div key={index}>
                <TextField
                  type="text"
                  label="To"
                  name="node"
                  placeholder="Peer key/alias/tag to set fees"
                  value={element.node || ''}
                  onChange={e => handleChange(index, e)}
                  style={styles.textField}
                  id={`key-${index}`}
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
            onChange={handleNodeChange}
            style={styles.textField}
          />

          <SubmitButton onClick={fetchData}>Run Command</SubmitButton>
          {!!data ? <FeesOutput data={data.result}></FeesOutput> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Fees;

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '800px',
  },
  textField: {
    width: '500px',
    marginTop: '10px',
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
  url: {
    fontWeight: 'bold',
    color: 'blue',
  },
};
