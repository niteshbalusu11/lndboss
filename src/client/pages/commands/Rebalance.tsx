import * as types from '~shared/types';

import { Button, CssBaseline, FormControlLabel, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import {
  ReactCron,
  StandardHomeButtonLink,
  StandardSwitch,
  StartFlexBox,
  SubmitButton,
} from '~client/standard_components/app-components';
import commands, { globalCommands } from '../../commands';

import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';
import Link from 'next/link';
import { PeersAndTagsList } from '~client/standard_components/lndboss';
import { axiosPost } from '~client/utils/axios';
import { clientConstants } from '~client/utils/constants';
import { useNotify } from '~client/hooks/useNotify';

const RebalanceCommand = commands.find(n => n.value === 'Rebalance');

/*
  Renders the bos balance command
  GET call to the NestJs process to execute a rebalance
*/

const Rebalance = () => {
  const [node, setNode] = useState('');
  const [amount, setAmount] = useState('');
  const [avoid, setAvoid] = useState([{ avoid: '' }]);
  const [inFilter, setInFilter] = useState([{ inFilter: '' }]);
  const [outFilter, setOutFilter] = useState([{ outFilter: '' }]);
  const [inTargetOutbound, setInTargetOutbound] = useState(undefined);
  const [outTargetInbound, setOutTargetInbound] = useState(undefined);
  const [inPeer, setInPeer] = useState(undefined);
  const [isStrictMaxFeeRate, setIsStrictMaxFeeRate] = useState(false);
  const [outPeer, setOutPeer] = useState(undefined);
  const [maxFee, setMaxFee] = useState('1337');
  const [maxFeeRate, setMaxFeeRate] = useState('250');
  const [timeout, setTimeout] = useState('5');
  const [schedule, setSchedule] = useState('30 5 * * 1,6');
  const [cronUrl, setCronUrl] = useState('https://crontab.guru/#30_5_*_*_1,6');

  const handleScheduleChange = (newSchedule: string) => {
    setSchedule(newSchedule);
  };

  const handleCronUrlChange = (newCronUrl: string) => {
    setCronUrl(newCronUrl);
  };

  const handleNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  // ============================================================================================
  const addAvoidFields = () => {
    setAvoid([...avoid, { avoid: '' }]);
  };

  const removeAvoidFields = (i: number) => {
    const newFormValues = [...avoid];
    newFormValues.splice(i, 1);
    setAvoid(newFormValues);
  };

  const handleAvoidChange = (i: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormValues = [...avoid];
    newFormValues[i].avoid = e.target.value;
    setAvoid(newFormValues);
  };

  // ============================================================================================

  const addInFilterFields = () => {
    setInFilter([...inFilter, { inFilter: '' }]);
  };

  const removeInFilterFields = (i: number) => {
    const newFormValues = [...inFilter];
    newFormValues.splice(i, 1);
    setInFilter(newFormValues);
  };

  const handleInFilterChange = (i: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormValues = [...inFilter];
    newFormValues[i].inFilter = e.target.value;
    setInFilter(newFormValues);
  };

  // ============================================================================================

  const addOutFilterFields = () => {
    setOutFilter([...outFilter, { outFilter: '' }]);
  };

  const removeOutFilterFields = (i: number) => {
    const newFormValues = [...outFilter];
    newFormValues.splice(i, 1);
    setOutFilter(newFormValues);
  };

  const handleOutFilterChange = (i: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormValues = [...outFilter];
    newFormValues[i].outFilter = e.target.value;
    setOutFilter(newFormValues);
  };

  // ============================================================================================

  const handleInTargetOutboundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInTargetOutbound(e.target.value);
  };

  const handleOutTargetInboundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOutTargetInbound(e.target.value);
  };

  const handleMaxFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxFee(e.target.value);
  };

  const handleMaxFeeRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxFeeRate(e.target.value);
  };

  const handleAvoidHighFeeRoutes = () => {
    setIsStrictMaxFeeRate((previousState: boolean) => !previousState);
  };

  const handleTimeoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(e.target.value);
  };

  const flags: types.commandRebalance = {
    node,
    schedule,
    avoid: avoid.map(n => n.avoid),
    in_filters: inFilter.map(n => n.inFilter),
    in_outbound: inTargetOutbound,
    in_through: inPeer,
    is_strict_max_fee_rate: isStrictMaxFeeRate,
    max_fee: Number(maxFee),
    max_fee_rate: Number(maxFeeRate),
    max_rebalance: amount,
    out_filters: outFilter.map(n => n.outFilter),
    out_inbound: outTargetInbound,
    out_through: outPeer,
    timeout_minutes: Number(timeout),
  };

  const fetchData = async () => {
    const flags: types.commandRebalance = {
      node,
      schedule,
      avoid: avoid.map(n => n.avoid),
      in_filters: inFilter.map(n => n.inFilter),
      in_outbound: inTargetOutbound,
      in_through: inPeer,
      is_strict_max_fee_rate: isStrictMaxFeeRate,
      max_fee: Number(maxFee),
      max_fee_rate: Number(maxFeeRate),
      max_rebalance: amount,
      message_id: Date.now().toString(),
      out_filters: outFilter.map(n => n.outFilter),
      out_inbound: outTargetInbound,
      out_through: outPeer,
      timeout_minutes: Number(timeout),
    };

    if (schedule.startsWith('*')) {
      useNotify({ type: 'error', message: 'Running a job every minute is bad...' });
    }
    await axiosPost({ path: 'rebalance/schedule', postBody: flags });

    useNotify({ type: 'success', message: 'Added schedule' });
  };

  return (
    <CssBaseline>
      <Head>
        <title>Rebalance</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <Instructions />

          <PeersAndTagsList
            setPeer={setOutPeer}
            label={RebalanceCommand.flags.out_through}
            placeholder={`${RebalanceCommand.flags.out_through} (Route out through a specific peer)`}
            id={RebalanceCommand.flags.out_through}
          />

          <PeersAndTagsList
            setPeer={setInPeer}
            label={RebalanceCommand.flags.in_through}
            placeholder={`${RebalanceCommand.flags.in_through} (Route in through a specific peer)`}
            id={RebalanceCommand.flags.in_through}
          />

          <TextField
            type="text"
            placeholder={`${RebalanceCommand.flags.max_rebalance} (Maximum amount to rebalance)`}
            label={RebalanceCommand.flags.max_rebalance}
            id={RebalanceCommand.flags.max_rebalance}
            onChange={handleAmountChange}
            style={styles.textField}
          />

          <TextField
            type="text"
            placeholder={`${RebalanceCommand.flags.max_fee} (Maximum fee to pay)`}
            label={RebalanceCommand.flags.max_fee}
            id={RebalanceCommand.flags.max_fee}
            onChange={handleMaxFeeChange}
            style={styles.textField}
          />

          <TextField
            type="text"
            placeholder={`${RebalanceCommand.flags.max_fee_rate} (Maximum fee rate to pay)`}
            label={RebalanceCommand.flags.max_fee_rate}
            id={RebalanceCommand.flags.max_fee_rate}
            onChange={handleMaxFeeRateChange}
            style={styles.textField}
          />

          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch
                checked={isStrictMaxFeeRate}
                onChange={handleAvoidHighFeeRoutes}
                id={RebalanceCommand.flags.is_strict_max_fee_rate}
              />
            }
            label={RebalanceCommand.flags.is_strict_max_fee_rate}
          />

          <>
            <Button href="#text-buttons" onClick={() => addAvoidFields()} style={styles.button}>
              Add +
            </Button>
            {avoid.map((element, index) => (
              <div key={index}>
                <TextField
                  type="text"
                  label={RebalanceCommand.flags.avoid}
                  name={RebalanceCommand.flags.avoid}
                  placeholder={`${RebalanceCommand.flags.avoid} (Avoid forwarding through)`}
                  value={element.avoid}
                  onChange={e => handleAvoidChange(index, e)}
                  style={styles.textField}
                  id={`avoid-${index}`}
                />
                {!!index ? (
                  <IconButton aria-label="delete" onClick={() => removeAvoidFields(index)} style={styles.iconButton}>
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </div>
            ))}
          </>

          <>
            <Button href="#text-buttons" onClick={() => addInFilterFields()} style={styles.button}>
              Add +
            </Button>
            {inFilter.map((element, index) => (
              <div key={index}>
                <TextField
                  type="text"
                  label={RebalanceCommand.flags.in_filters}
                  name={RebalanceCommand.flags.in_filters}
                  placeholder={`${RebalanceCommand.flags.in_filters} Filter inbound tag nodes`}
                  value={element.inFilter || ''}
                  onChange={e => handleInFilterChange(index, e)}
                  style={styles.textField}
                  id={`inFilter-${index}`}
                />
                {!!index ? (
                  <IconButton aria-label="delete" onClick={() => removeInFilterFields(index)} style={styles.iconButton}>
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </div>
            ))}
          </>

          <>
            <Button href="#text-buttons" onClick={() => addOutFilterFields()} style={styles.button}>
              Add +
            </Button>
            {outFilter.map((element, index) => (
              <div key={index}>
                <TextField
                  type="text"
                  label={RebalanceCommand.flags.out_filters}
                  name={RebalanceCommand.flags.out_filters}
                  placeholder={`${RebalanceCommand.flags.out_filters} (Filter outbound tag nodes)`}
                  value={element.outFilter || ''}
                  onChange={e => handleOutFilterChange(index, e)}
                  style={styles.textField}
                  id={`outFilter-${index}`}
                />
                {!!index ? (
                  <IconButton
                    aria-label="delete"
                    onClick={() => removeOutFilterFields(index)}
                    style={styles.iconButton}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </div>
            ))}
          </>

          <TextField
            type="text"
            placeholder={`${RebalanceCommand.flags.in_outbound} (Balance up to outbound amount)`}
            label={RebalanceCommand.flags.in_outbound}
            id={RebalanceCommand.flags.in_outbound}
            onChange={handleInTargetOutboundChange}
            style={styles.textField}
          />

          <TextField
            type="text"
            placeholder={`${RebalanceCommand.flags.out_inbound} (Balance up to inbound amount)`}
            label={RebalanceCommand.flags.out_inbound}
            id={RebalanceCommand.flags.out_inbound}
            onChange={handleOutTargetInboundChange}
            style={styles.textField}
          />

          <TextField
            type="text"
            placeholder={`${RebalanceCommand.flags.timeout_minutes} (Default: 5, Time-out route search after N minutes)`}
            label={RebalanceCommand.flags.timeout_minutes}
            id={RebalanceCommand.flags.timeout_minutes}
            onChange={handleTimeoutChange}
            style={styles.textField}
          />

          <TextField
            type="text"
            placeholder={globalCommands.node.name}
            label={globalCommands.node.name}
            id={globalCommands.node.value}
            onChange={handleNodeChange}
            style={styles.textField}
          />
          <Link href={{ pathname: `/result/RebalanceResult`, query: flags }} style={styles.link} target={'_blank'}>
            <SubmitButton>Run Manual Rebalance</SubmitButton>
          </Link>

          <ReactCron handleScheduleChange={handleScheduleChange} handleCronUrlChange={handleCronUrlChange} />
          <Link href={cronUrl} target={'_blank'} id="cronguruUrl" style={styles.url}>
            Click here to validate your schedule.
          </Link>
          <Link href={{ pathname: clientConstants.rebalanceSchedulerUrl }} target={'_blank'} style={styles.url}>
            Click to view current scheduled jobs
          </Link>
          <SubmitButton variant="contained" onClick={fetchData}>
            Add Schedule
          </SubmitButton>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Rebalance;

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    minWidth: '700px',
  },
  textField: {
    width: '500px',
  },
  pre: {
    fontWeight: 'bold',
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
  link: {
    width: '250px',
  },
  switch: {
    width: '100px',
  },
};

const Instructions = () => {
  return (
    <>
      <h1>Auto Rebalance Scheduler</h1>
      <h3>
        To use Automated Rebalancing make sure to enable Scheduled Rebalances from User Preferences on the Dashboard
        Page.
      </h3>
      <ul>
        <li>It is recommended that you manually test a rebalance before auto scheduling.</li>
        <li>Select all rebalance parameters from the fields below, select a schedule and then click add schedule.</li>
      </ul>

      <Link href={{ pathname: clientConstants.rebalanceSchedulerUrl }} target={'_blank'} style={styles.url}>
        Click to view current scheduled jobs
      </Link>

      <h1>Manual Rebalance</h1>
      <h4>Change the liquidity of two peers.</h4>
      <ul>
        <li>Specifying target liquidity you can use CAPACITY/2, other formulas.</li>
        <li>You can specify tags for --avoid, --in, --out (see help tags)</li>
        <li>--amount can take m/k variables: 5*m for 5 million, 250*k = 0.0025.</li>
        <li>--avoid can take a channel id or a public key to avoid.</li>
        <li>--avoid can take a public_key/public_key to avoid a directed pair.</li>
        <li>--avoid can take a FORMULA/public_key to avoid inbound peers.</li>
        <li>--avoid can take a public_key/FORMULA to avoid outbound peers.</li>
        <li>--avoid FORMULA variables: FEE_RATE, BASE_FEE, HEIGHT, AGE.</li>
        <li>--in decreases the inbound liquidity with a specific peer/tag.</li>
        <li>--in-filter/--out-filter vars: CAPACITY/HEIGHTS/INBOUND_LIQUIDITY.</li>
        <li>--in-filter/--out-filter vars: OUTBOUND_LIQUIDITY/PENDING_PAYMENTS</li>
      </ul>

      <h4>
        NOTE: THERE IS NO WAY TO STOP AN IN-FLIGHT REBALANCE OTHER THAN RESTARTING THE APP, DOUBLE CHECK BEFORE RUNNING.
        REBALANCE AUTO TIMEOUT IS 5MINS IF NOT SPECIFIED.
      </h4>
    </>
  );
};
