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

const ChartFeesPaidCommand = commands.find(n => n.value === 'ChartFeesPaid');

/*
  Renders the bos chart-fees-paid command
  Passes query parameters to the chart-fees-paid results page
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

const ChartFeesPaid = () => {
  const [days, setDays] = useState('');
  const [formValues, setFormValues] = useState([{ node: '' }]);
  const [inNode, setInNode] = useState('');
  const [outNode, setOutNode] = useState('');
  const [isMostFees, setIsMostFees] = useState(false);
  const [isMostForwarded, setIsMostForwarded] = useState(false);
  const [isNetwork, setIsNetwork] = useState(false);
  const [isPeer, setIsPeer] = useState(false);
  const [isRebalances, setIsRebalances] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const addFormFields = () => {
    setFormValues([...formValues, { node: '' }]);
  };

  const handleDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDays(event.target.value);
  };

  const handleInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInNode(event.target.value);
  };

  const handleIsNetworkChange = () => {
    setIsNetwork((previousState: boolean) => !previousState);
  };

  const handleIsPeerChange = () => {
    setIsPeer((previousState: boolean) => !previousState);
  };

  const handleIsRebalanceChange = () => {
    setIsRebalances((previousState: boolean) => !previousState);
  };

  const handleMostFeesTableChange = () => {
    setIsMostFees((previousState: boolean) => !previousState);
  };
  const handleMostForwardedTableChange = () => {
    setIsMostForwarded((previousState: boolean) => !previousState);
  };

  const handleOutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOutNode(event.target.value);
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

  const flags: types.commandChartFeesPaid = {
    days: Number(days) || 0,
    end_date: endDate,
    in: inNode,
    is_most_fees_table: isMostFees,
    is_most_forwarded_table: isMostForwarded,
    is_network: isNetwork,
    is_rebalances_only: isRebalances,
    is_peer: isPeer,
    nodes: formValues.map(n => n.node),
    out: outNode,
    start_date: startDate,
  };

  return (
    <CssBaseline>
      <Head>
        <title>Chart Fees Paid</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{ChartFeesPaidCommand.name}</h2>
          <h4 style={styles.h4}>{ChartFeesPaidCommand.longDescription}</h4>
          <TextField
            type="text"
            placeholder={`${ChartFeesPaidCommand.flags.days} (Default 60)`}
            label={`${ChartFeesPaidCommand.flags.days} (Default 60)`}
            id={ChartFeesPaidCommand.flags.days}
            onChange={handleDaysChange}
            style={styles.textField}
          />

          <BasicDatePicker
            label={ChartFeesPaidCommand.flags.start}
            id={ChartFeesPaidCommand.flags.start}
            value={startDate}
            setValue={setStartDate}
          />
          <BasicDatePicker
            label={ChartFeesPaidCommand.flags.end}
            id={ChartFeesPaidCommand.flags.end}
            value={endDate}
            setValue={setEndDate}
          />

          <TextField
            type="text"
            placeholder={`${ChartFeesPaidCommand.flags.in}`}
            label={`${ChartFeesPaidCommand.flags.in}`}
            id={ChartFeesPaidCommand.flags.in}
            onChange={handleInChange}
            style={styles.textField}
          />
          <TextField
            type="text"
            placeholder={`${ChartFeesPaidCommand.flags.out}`}
            label={`${ChartFeesPaidCommand.flags.out}`}
            id={ChartFeesPaidCommand.flags.out}
            onChange={handleOutChange}
            style={styles.textField}
          />
          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch
                checked={isMostFees}
                onChange={handleMostFeesTableChange}
                id={ChartFeesPaidCommand.flags.is_most_fees_table}
              />
            }
            label={ChartFeesPaidCommand.flags.is_most_fees_table}
          />

          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch
                checked={isMostForwarded}
                onChange={handleMostForwardedTableChange}
                id={ChartFeesPaidCommand.flags.is_most_forwarded_table}
              />
            }
            label={ChartFeesPaidCommand.flags.is_most_forwarded_table}
          />
          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch
                checked={isNetwork}
                onChange={handleIsNetworkChange}
                id={ChartFeesPaidCommand.flags.is_network}
              />
            }
            label={ChartFeesPaidCommand.flags.is_network}
          />
          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch checked={isPeer} onChange={handleIsPeerChange} id={ChartFeesPaidCommand.flags.is_peer} />
            }
            label={ChartFeesPaidCommand.flags.is_peer}
          />
          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch
                checked={isRebalances}
                onChange={handleIsRebalanceChange}
                id={ChartFeesPaidCommand.flags.is_rebalances_only}
              />
            }
            label={ChartFeesPaidCommand.flags.is_rebalances_only}
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
          <Link href={{ pathname: '/result/ChartFeesPaidResult', query: flags }} passHref>
            <a target="_blank" rel="noreferrer">
              <SubmitButton>Run Command</SubmitButton>
            </a>
          </Link>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default ChartFeesPaid;
