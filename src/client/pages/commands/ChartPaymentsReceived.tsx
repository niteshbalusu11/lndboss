import * as types from '~shared/types';

import {
  BasicDatePicker,
  StandardHomeButtonLink,
  StandardSwitch,
  StartFlexBox,
  SubmitButton,
} from '~client/standard_components/app-components';
import { Button, CssBaseline, FormControlLabel, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import commands, { globalCommands } from '../../commands';

import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';
import Link from 'next/link';

const ChartPaymentsReceivedCommand = commands.find(n => n.value === 'ChartPaymentsReceived');

/*
  Renders the bos chart-payments-received command
  Passes query parameters to the chart-payments-received results page
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '700px',
  },
  textField: {
    width: '350px',
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
  h4: {
    marginTop: '0px',
  },
  switch: {
    width: '100px',
  },
};

const ChartPaymentsReceived = () => {
  const [count, setCount] = useState<boolean>(false);
  const [days, setDays] = useState('');
  const [endDate, setEndDate] = useState<string | null>(null);
  const [forQuery, setForQuery] = useState<string | null>(null);
  const [formValues, setFormValues] = useState([{ node: '' }]);
  const [startDate, setStartDate] = useState<string | null>(null);

  const handleCountChange = () => {
    setCount(previousValue => !previousValue);
  };

  const handleDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDays(event.target.value);
  };

  const handleForQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForQuery(event.target.value);
  };

  const addFormFields = () => {
    setFormValues([...formValues, { node: '' }]);
  };

  const removeFormFields = (i: number) => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  const flags: types.commandChartPaymentsReceived = {
    days: Number(days) || 0,
    end_date: endDate,
    is_count: count,
    nodes: formValues.map(n => n.node),
    query: forQuery,
    start_date: startDate,
  };

  return (
    <CssBaseline>
      <Head>
        <title>Chart Payments Received</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{ChartPaymentsReceivedCommand.name}</h2>
          <h4 style={styles.h4}>{ChartPaymentsReceivedCommand.description}</h4>
          <TextField
            type="text"
            placeholder={`${ChartPaymentsReceivedCommand.flags.days} (Default 60)`}
            label={`${ChartPaymentsReceivedCommand.flags.days} (Default 60)`}
            id={ChartPaymentsReceivedCommand.flags.days}
            onChange={handleDaysChange}
            style={styles.textField}
          />

          <BasicDatePicker
            label={ChartPaymentsReceivedCommand.flags.start}
            id={ChartPaymentsReceivedCommand.flags.start}
            value={startDate}
            setValue={setStartDate}
          />

          <BasicDatePicker
            label={ChartPaymentsReceivedCommand.flags.end}
            id={ChartPaymentsReceivedCommand.flags.end}
            value={endDate}
            setValue={setEndDate}
          />

          <TextField
            type="text"
            placeholder={`${ChartPaymentsReceivedCommand.flags.for} (Show results for a query)`}
            label={`${ChartPaymentsReceivedCommand.flags.for}`}
            id={ChartPaymentsReceivedCommand.flags.for}
            onChange={handleForQueryChange}
            style={styles.textField}
          />

          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch
                checked={count}
                onChange={handleCountChange}
                id={ChartPaymentsReceivedCommand.flags.count}
              />
            }
            label={ChartPaymentsReceivedCommand.flags.count}
          />

          <>
            <Button href="#text-buttons" onClick={() => addFormFields()} style={styles.button}>
              Add +
            </Button>
            {formValues.map((element, index) => (
              <div key={index}>
                <TextField
                  type="text"
                  label={globalCommands.node.name}
                  name={globalCommands.node.value}
                  placeholder={globalCommands.node.name}
                  value={element.node || ''}
                  onChange={e => handleChange(index, e)}
                  style={styles.textField}
                  id={`node-${index}`}
                />
                {!!index ? (
                  <IconButton aria-label="delete" onClick={() => removeFormFields(index)} style={styles.iconButton}>
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </div>
            ))}
          </>
          <Link href={{ pathname: '/result/ChartPaymentsReceivedResult', query: flags }} passHref>
            <a target="_blank" rel="noreferrer">
              <SubmitButton>Run Command</SubmitButton>
            </a>
          </Link>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default ChartPaymentsReceived;
