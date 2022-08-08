import * as types from '~shared/types';

import { Button, CssBaseline, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import commands, { globalCommands } from '../../commands';

import DeleteIcon from '@mui/icons-material/Delete';
import GraphOutput from '~client/output/GraphOutput';
import Head from 'next/head';
import { axiosGet } from '~client/utils/axios';

/*
  Renders the bos graph command
  GET call to the NestJs process to get a node graph info
*/

const GraphCommand = commands.find(n => n.value === 'Graph');

const styles = {
  button: {
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '10px',
    border: '1px solid black',
    marginTop: '20px',
    width: '50px',
  },
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '1000px',
  },
  iconButton: {
    width: '50px',
    marginTop: '0px',
  },
  textField: {
    width: '500px',
  },
  h4: {
    marginTop: '0px',
    fontWeight: 'bold',
  },
};

const Graph = () => {
  const [aliasOrPubkey, setAliasOrPubkey] = useState('');
  const [node, setNode] = useState('');
  const [sort, setSort] = useState('');
  const [filter, setFilter] = useState([{ filter: '' }]);
  const [data, setData] = useState(undefined);

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleAliasOrPubkeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAliasOrPubkey(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSort(event.target.value);
  };

  // ============================================================================================

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

  // ============================================================================================

  const fetchData = async () => {
    const query: types.commandGraph = {
      node,
      sort,
      filters: filter.map(f => f.filter),
      query: aliasOrPubkey,
    };

    const result = await axiosGet({ path: 'graph', query });

    if (!!result) {
      setData(result);
    }
  };
  return (
    <CssBaseline>
      <Head>
        <title>Graph</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{GraphCommand.name}</h2>
          <h4 style={styles.h4}>{GraphCommand.longDescription}</h4>
          <TextField
            type="text"
            placeholder="Node in the graph to look up"
            label={GraphCommand.args.alias_or_pubkey}
            id={GraphCommand.args.alias_or_pubkey}
            onChange={handleAliasOrPubkeyChange}
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
                  label={GraphCommand.flags.filter}
                  name={GraphCommand.flags.filter}
                  placeholder={`${GraphCommand.flags.filter} Filter inbound tag nodes`}
                  value={element.filter || ''}
                  onChange={e => handleFilterChange(index, e)}
                  style={styles.textField}
                  id={`inFilter-${index}`}
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
            placeholder="Sort peers by field "
            label={GraphCommand.flags.sort}
            id={GraphCommand.flags.sort}
            onChange={handleSortChange}
            style={styles.textField}
          />
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
          {!!data ? <GraphOutput data={data.rows} summary={data.summary} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Graph;
