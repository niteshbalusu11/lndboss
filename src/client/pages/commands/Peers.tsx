import * as types from '~shared/types';

import { Button, CssBaseline, FormControlLabel, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import {
  StandardHomeButtonLink,
  StandardSwitch,
  StartFlexBox,
  SubmitButton,
} from '~client/standard_components/app-components';
import commands, { globalCommands } from '~client/commands';

import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';
import PeersOutput from '~client/output/PeersOutput';
import { axiosGet } from '~client/utils/axios';

/*
  Renders the bos peers command
  GET call to the NestJs process to peers information
*/

const PeersCommand = commands.find(n => n.value === 'Peers');

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
  switch: {
    width: '100px',
  },
  url: {
    fontWeight: 'bold',
    color: 'blue',
  },
};

const Peers = () => {
  const [node, setNode] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [feeDays, setFeeDays] = useState('');
  const [filter, setFilter] = useState([{ filter: '' }]);
  const [idleDays, setIdleDays] = useState('');
  const [omit, setOmit] = useState([{ omit: '' }]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [sort, setSort] = useState('');
  const [tags, setTags] = useState([{ tags: '' }]);
  const [data, setData] = useState(undefined);

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleIsActiveChange = () => {
    setIsActive((previousValue: boolean) => !previousValue);
  };

  const handleIsCompleteChange = () => {
    setIsComplete((previousValue: boolean) => !previousValue);
  };

  const handleIsOfflineChange = () => {
    setIsOffline((previousValue: boolean) => !previousValue);
  };

  const handleFeeDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeeDays(event.target.value);
  };

  const handleIdleDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIdleDays(event.target.value);
  };

  const handleIsPrivateChange = () => {
    setIsPrivate((previousValue: boolean) => !previousValue);
  };

  const handleIsPublicChange = () => {
    setIsPublic((previousValue: boolean) => !previousValue);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSort(event.target.value);
  };

  const addFilterFields = () => {
    setFilter([...filter, { filter: '' }]);
  };

  const removeFilterFields = (i: number) => {
    const newFormValues = [...filter];
    newFormValues.splice(i, 1);
    setFilter(newFormValues);
  };

  const handleFilterChange = (i: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormValues = [...filter];
    newFormValues[i].filter = e.target.value;
    setFilter(newFormValues);
  };

  const addOmitFields = () => {
    setOmit([...omit, { omit: '' }]);
  };

  const removeOmitFields = (i: number) => {
    const newFormValues = [...omit];
    newFormValues.splice(i, 1);
    setOmit(newFormValues);
  };

  const handleOmitChange = (i: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormValues = [...omit];
    newFormValues[i].omit = e.target.value;
    setOmit(newFormValues);
  };

  const addTagsFields = () => {
    setTags([...tags, { tags: '' }]);
  };

  const removeTagsFields = (i: number) => {
    const newFormValues = [...tags];
    newFormValues.splice(i, 1);
    setTags(newFormValues);
  };

  const handleTagsChange = (i: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormValues = [...tags];
    newFormValues[i].tags = e.target.value;
    setTags(newFormValues);
  };

  const fetchData = async () => {
    const query: types.commandPeers = {
      node,
      earnings_days: feeDays,
      idle_days: Number(idleDays),
      is_active: isActive,
      is_table: !isComplete,
      is_private: isPrivate,
      is_public: isPublic,
      is_offline: isOffline,
      omit: omit.map(n => n.omit),
      sort_by: sort,
      tags: tags.map(n => n.tags),
      filters: filter.map(n => n.filter),
    };

    const result = await axiosGet({ path: 'peers', query });

    if (!!result) {
      setData(result);
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Peers</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h1>{PeersCommand.name}</h1>
          <h4>{PeersCommand.longDescription}</h4>
          <FormControlLabel
            control={
              <StandardSwitch checked={isActive} onChange={handleIsActiveChange} id={PeersCommand.flags.active} />
            }
            label={PeersCommand.flags.active}
          />
          <FormControlLabel
            control={
              <StandardSwitch checked={isComplete} onChange={handleIsCompleteChange} id={PeersCommand.flags.complete} />
            }
            label={PeersCommand.flags.complete}
          />
          <TextField
            type="text"
            placeholder={`${PeersCommand.flags.fee_days} Include fees earned over n days`}
            label={PeersCommand.flags.fee_days}
            id={PeersCommand.flags.fee_days}
            onChange={handleFeeDaysChange}
            style={styles.textField}
          />

          <>
            <Button href="#text-buttons" onClick={() => addFilterFields()} style={styles.button}>
              Add +
            </Button>
            {filter.map((element, index) => (
              <div key={index}>
                <TextField
                  type="text"
                  label={PeersCommand.flags.filter}
                  name={PeersCommand.flags.filter}
                  placeholder={`${PeersCommand.flags.filter} Filter formula to apply`}
                  value={element.filter || ''}
                  onChange={e => handleFilterChange(index, e)}
                  style={styles.textField}
                  id={`filter-${index}`}
                />
                {!!index ? (
                  <IconButton aria-label="delete" onClick={() => removeFilterFields(index)} style={styles.iconButton}>
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </div>
            ))}
          </>

          <TextField
            type="text"
            placeholder={`${PeersCommand.flags.idle_days} No receives or routes for n days`}
            label={PeersCommand.flags.idle_days}
            id={PeersCommand.flags.idle_days}
            onChange={handleIdleDaysChange}
            style={styles.textField}
          />

          <FormControlLabel
            control={
              <StandardSwitch checked={isOffline} onChange={handleIsOfflineChange} id={PeersCommand.flags.offline} />
            }
            label={PeersCommand.flags.offline}
          />

          <>
            <Button href="#text-buttons" onClick={() => addOmitFields()} style={styles.button}>
              Add +
            </Button>
            {omit.map((element, index) => (
              <div key={index}>
                <TextField
                  type="text"
                  label={PeersCommand.flags.omit}
                  name={PeersCommand.flags.omit}
                  placeholder={`${PeersCommand.flags.omit} Omit peer with public key`}
                  value={element.omit || ''}
                  onChange={e => handleOmitChange(index, e)}
                  style={styles.textField}
                  id={`omit-${index}`}
                />
                {!!index ? (
                  <IconButton aria-label="delete" onClick={() => removeOmitFields(index)} style={styles.iconButton}>
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </div>
            ))}
          </>

          <FormControlLabel
            control={
              <StandardSwitch checked={isPrivate} onChange={handleIsPrivateChange} id={PeersCommand.flags.private} />
            }
            label={PeersCommand.flags.private}
          />

          <FormControlLabel
            control={
              <StandardSwitch checked={isPublic} onChange={handleIsPublicChange} id={PeersCommand.flags.public} />
            }
            label={PeersCommand.flags.public}
          />

          <TextField
            type="text"
            placeholder={`${PeersCommand.flags.sort} Sort results by peer attribute`}
            label={PeersCommand.flags.sort}
            id={PeersCommand.flags.sort}
            onChange={handleSortChange}
            style={styles.textField}
          />

          <>
            <Button href="#text-buttons" onClick={() => addTagsFields()} style={styles.button}>
              Add +
            </Button>
            {tags.map((element, index) => (
              <div key={index}>
                <TextField
                  type="text"
                  label={PeersCommand.flags.tag}
                  name={PeersCommand.flags.tag}
                  placeholder={`${PeersCommand.flags.tag} Only show peers in a tag`}
                  value={element.tags || ''}
                  onChange={e => handleTagsChange(index, e)}
                  style={styles.textField}
                  id={`tag-${index}`}
                />
                {!!index ? (
                  <IconButton aria-label="delete" onClick={() => removeTagsFields(index)} style={styles.iconButton}>
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
          {!!data && (!!data.rows || data.peers) ? <PeersOutput data={data} isComplete={isComplete} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Peers;
