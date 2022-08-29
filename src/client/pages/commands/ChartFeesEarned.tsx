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

const ChartFeesEarnedCommand = commands.find(n => n.value === 'ChartFeesEarned');

/*
  Renders the bos chart-fees-earned command
  Passes query parameters to the chart-fees-earned results page
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '700px',
  },
  textField: {
    width: '380px',
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

const ChartFeesEarned = () => {
  const [count, setCount] = useState(false);
  const [forwarded, setForwarded] = useState(false);
  const [formValues, setFormValues] = useState([{ node: '' }]);
  const [days, setDays] = useState('');
  const [via, setVia] = useState('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleCountChange = () => {
    setCount((previousState: boolean) => !previousState);
  };

  const handleDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDays(event.target.value);
  };

  const handleForwardedChange = () => {
    setForwarded((previousState: boolean) => !previousState);
  };

  const handleViaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVia(event.target.value);
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

  const flags: types.commandChartFeesEarned = {
    via,
    days: Number(days) || 0,
    end_date: endDate,
    is_count: count,
    is_forwarded: forwarded,
    nodes: formValues.map(n => n.node) || [''],
    start_date: startDate,
  };

  return (
    <CssBaseline>
      <Head>
        <title>Chart Fees Earned</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{ChartFeesEarnedCommand.name}</h2>
          <h4 style={styles.h4}>{ChartFeesEarnedCommand.description}</h4>
          <TextField
            type="text"
            placeholder="Routing fees earned via a specified node or tag"
            label={ChartFeesEarnedCommand.args.via}
            id={ChartFeesEarnedCommand.args.via}
            onChange={handleViaChange}
            style={styles.textField}
          />
          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch checked={count} onChange={handleCountChange} id={ChartFeesEarnedCommand.flags.count} />
            }
            label={ChartFeesEarnedCommand.flags.count}
          />
          <TextField
            type="text"
            placeholder={`${ChartFeesEarnedCommand.flags.days} (Default 60)`}
            label={`${ChartFeesEarnedCommand.flags.days} (Default 60)`}
            id={ChartFeesEarnedCommand.flags.days}
            onChange={handleDaysChange}
            style={styles.textField}
          />

          <BasicDatePicker
            label={ChartFeesEarnedCommand.flags.start}
            id={ChartFeesEarnedCommand.flags.start}
            value={startDate}
            setValue={setStartDate}
          />
          <BasicDatePicker
            label={ChartFeesEarnedCommand.flags.end}
            id={ChartFeesEarnedCommand.flags.end}
            value={endDate}
            setValue={setEndDate}
          />

          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch
                checked={forwarded}
                onChange={handleForwardedChange}
                id={ChartFeesEarnedCommand.flags.forwarded}
              />
            }
            label={ChartFeesEarnedCommand.flags.forwarded}
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
          <Link href={{ pathname: '/result/ChartFeesEarnedResult', query: flags }} passHref>
            <a target="_blank" rel="noreferrer">
              <SubmitButton>Run Command</SubmitButton>
            </a>
          </Link>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default ChartFeesEarned;
