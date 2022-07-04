import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { StandardButtonLink, StandardTableOutput, StartFlexBox, SubmitButton } from '~client/standard_components';

import Head from 'next/head';
import { axiosGet } from '~client/utils/axios';
import { globalCommands } from '~client/commands';
import { useNotify } from '~client/hooks/useNotify';

/*
  Renders rebalance schedules
  GET call to Nest JS Process to get rebalance schedules
  GET call to Nest JS Process to delete a rebalance schedules
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    minWidth: '400px',
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
  url: {
    fontWeight: 'bold',
    color: 'blue',
  },
};

const columns = [
  'ID',
  'Node',
  'Schedule',
  'InPeer',
  'OutPeer',
  'Avoid',
  'InFilters',
  'MaxFee',
  'MaxFeeRate',
  'MaxRebalance',
  'OutFilters',
  'TimeoutMinutes',
];

const RebalanceScheduler = () => {
  const [node, setNode] = useState('');
  const [rows, setRows] = useState([]);
  const [id, setId] = useState('');
  const dataSet = [];

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value);
  };

  const DisplayTable = () => {
    if (!!rows && !!rows.length) {
      return <StandardTableOutput data={{ rows }} tableId={'scheduledRebalances'} />;
    }

    return <h2>No Scheduled Rebalances</h2>;
  };

  const fetchDataOnClick = async () => {
    const query = {
      node,
    };
    const data = await axiosGet({ path: 'rebalance/getrebalances', query });
    if (!!data && !!data.getTriggers && !!data.getTriggers.length) {
      const { getTriggers } = data;
      setTableData(getTriggers);
    } else {
      setRows([]);
    }
  };

  const fetchRebalanceDelete = async () => {
    const query = {
      node,
      invoice_id: id,
    };
    const data = await axiosGet({ path: 'rebalance/deleterebalance', query });

    if (!!data) {
      useNotify({ type: 'success', message: 'Rebalance Schedule Deleted' });
      fetchDataOnClick();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const query = {
        node,
      };
      const data = await axiosGet({ path: 'rebalance/getrebalances', query });
      if (!!data && !!data.getTriggers && !!data.getTriggers.length) {
        const { getTriggers } = data;
        setTableData(getTriggers);
      } else {
        setRows([]);
      }
    };

    fetchData();
  }, []);

  const setTableData = (getTriggers: any) => {
    if (!!getTriggers && !!getTriggers.length) {
      getTriggers.forEach(trigger => {
        const row = [];

        row.push(trigger.id);

        const rebalanceData = JSON.parse(trigger.rebalance_data);

        !!rebalanceData.node ? row.push(rebalanceData.node) : row.push('Default');

        row.push(rebalanceData.schedule);

        row.push(rebalanceData.in_through);
        row.push(rebalanceData.out_through);

        !!rebalanceData.avoid.length ? row.push(rebalanceData.avoid.join(', ')) : row.push('');

        !!rebalanceData.in_filters.length ? row.push(rebalanceData.in_filters.join(', ')) : row.push('');

        row.push(rebalanceData.max_fee);
        row.push(rebalanceData.max_fee_rate);
        row.push(rebalanceData.max_rebalance);

        !!rebalanceData.out_filters.length ? row.push(rebalanceData.out_filters.join(', ')) : row.push('');

        row.push(rebalanceData.timeout_minutes);

        dataSet.push(row);
      });
      setRows([columns, ...dataSet]);
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>Rebalance Scheduler</title>
      </Head>
      <StartFlexBox>
        <StandardButtonLink destination="/Commands" label="Home" />
        <Stack spacing={3} style={styles.form}>
          <h2>Rebalance Schedules</h2>
          <a href={'/Rebalance'} target="blank" id="rebalance" style={styles.url}>
            Click here to schedule rebalances.
          </a>
          <TextField
            type="text"
            placeholder={globalCommands.node.name}
            label={globalCommands.node.name}
            id={globalCommands.node.value}
            onChange={handeNodeChange}
            style={styles.textField}
          />
          <SubmitButton onClick={fetchDataOnClick}>Fetch Rebalances For Saved Node</SubmitButton>
          <DisplayTable />
          <h3>Enter a Rebalance ID to remove schedule</h3>
          <TextField
            type="text"
            placeholder={'Enter Rebalance ID to delete'}
            label={'Rebalance ID'}
            id={'rebalanceId'}
            onChange={handleIdChange}
            style={styles.textField}
          />
          <SubmitButton onClick={fetchRebalanceDelete}>Delete Schedule</SubmitButton>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default RebalanceScheduler;
