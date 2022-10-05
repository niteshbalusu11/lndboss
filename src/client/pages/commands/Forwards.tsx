import * as types from '~shared/types';

import { Button, CssBaseline, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import commands, { globalCommands } from '~client/commands';

import DeleteIcon from '@mui/icons-material/Delete';
import { ForwardsOutput } from '~client/output';
import Head from 'next/head';
import { axiosGet } from '~client/utils/axios';

const ForwardsCommand = commands.find(n => n.value === 'Forwards');

/*
  Renders the bos forwards command
  GET call to the NestJs process to forwards information
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    minWidth: '700px',
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
  textField: {
    width: '300px',
  },
  h4: {
    marginTop: '0px',
  },
};

const Forwards = () => {
  const [days, setDays] = useState('');
  const [data, setData] = useState(undefined);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState('');
  const [node, setNode] = useState('');
  const [formValues, setFormValues] = useState([{ tag: '' }]);

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDays(event.target.value);
  };

  const handleFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFrom(event.target.value);
  };

  const handleToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTo(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSort(event.target.value);
  };

  // ====================================================================
  const addFormFields = () => {
    setFormValues([...formValues, { tag: '' }]);
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
  // ====================================================================

  const fetchData = async () => {
    const query: types.commandForwards = {
      from,
      node,
      sort,
      to,
      days: Number(days),
      tags: formValues.map(n => n.tag),
    };

    const result = await axiosGet({ path: 'forwards', query });

    if (!!result) {
      setData(result);
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Forwards</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{ForwardsCommand.name}</h2>
          <h4 style={styles.h4}>{ForwardsCommand.longDescription}</h4>
          <TextField
            type="text"
            placeholder="Days (optional)"
            label={ForwardsCommand.flags.days}
            id={ForwardsCommand.flags.days}
            onChange={handleDaysChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder="From Public Key (optional)"
            label={ForwardsCommand.flags.from}
            id={ForwardsCommand.flags.from}
            onChange={handleFromChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder="Sort by earnings/liquidity (optional)"
            label={ForwardsCommand.flags.sort}
            id={ForwardsCommand.flags.sort}
            onChange={handleSortChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder="To Public Key (optional)"
            label={ForwardsCommand.flags.to}
            id={ForwardsCommand.flags.to}
            onChange={handleToChange}
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
                  label={ForwardsCommand.flags.tag}
                  name="tag"
                  placeholder={ForwardsCommand.flags.tag}
                  value={element.tag || ''}
                  onChange={e => handleChange(index, e)}
                  style={styles.textField}
                  id={`tag-${index}`}
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
          <SubmitButton variant="contained" onClick={fetchData}>
            Run Command
          </SubmitButton>
          {!!data ? <ForwardsOutput data={data} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Forwards;
