import React, { useState } from 'react';
import { Button, CssBaseline, IconButton, FormControlLabel, Stack, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';
import { StandardButtonLink, StandardSwitch, StartFlexBox, SubmitButton } from '../standard_components';
import commands, { globalCommands } from '../commands';
import * as types from '../types';

const ChartFeesEarnedCommand = commands.find(n => n.value === 'ChartFeesEarned');

/*
  Renders the bos chart-fees-earned command
  IPC to the main process to get fee earnings data
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
};

const ChartFeesEarned = () => {
  const [count, setCount] = useState(false);
  const [forwarded, setForwarded] = useState(false);
  const [formValues, setFormValues] = useState([{ node: '' }]);
  const [days, setDays] = useState('60');
  const [via, setVia] = useState('');

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

  const fetchData = async () => {
    const flags: types.commandChartFeesEarned = {
      via,
      days: !!days ? Number(days) : 60,
      is_count: count,
      is_forwarded: forwarded,
      nodes: formValues.map(n => n.node),
    };

    await window.electronAPI.createChildWindow(flags, 'result/ChartFeesEarnedResult', 'ChartFeesEarnedResult');
  };

  return (
    <CssBaseline>
      <Head>
        <title>Chart Fees Earned</title>
      </Head>
      <StartFlexBox>
        <StandardButtonLink label="Home" destination="/Commands" />
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
          <FormControlLabel
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
              <>
                <TextField
                  type="text"
                  label={globalCommands.node.name}
                  name={globalCommands.node.value}
                  placeholder={globalCommands.node.name}
                  value={element.node || ''}
                  onChange={e => handleChange(index, e)}
                  key={index}
                  style={styles.textField}
                  id={`node-${index}`}
                />
                {!!index ? (
                  <IconButton aria-label="delete" onClick={() => removeFormFields(index)} style={styles.iconButton}>
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </>
            ))}
          </>
          <SubmitButton variant="contained" onClick={fetchData}>
            Run Command
          </SubmitButton>
          {/* {!!data.data.length && <ChartFeesEarnedOutput data={data} />} */}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default ChartFeesEarned;
