import { CssBaseline, FormControlLabel, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  StandardButtonLink,
  StandardSwitch,
  StartFlexBox,
  SubmitButton,
} from '~client/standard_components/app-components';

import Head from 'next/head';
import { axiosPostWithAlert } from '~client/utils/axios';
import { clientConstants } from '~client/utils/constants';
import { useNotify } from '~client/hooks/useNotify';

const { parse } = JSON;

/**
 * Get user preferences settings and render them
 * Update user preferences settings
 */

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '700px',
  },
  h4: {
    marginTop: '0px',
  },
  switch: {
    marginTop: '20px',
    marginBottom: '20px',
    width: '240px',
  },
};

const UserPreferences = () => {
  const [scheduledRebalancing, setScheduledRebalancing] = useState(false);
  const [ambossHealthCheck, setAmbossHealthCheck] = useState(false);

  const handleScheduleRebalancingChange = () => {
    setScheduledRebalancing(previousValue => !previousValue);
  };

  const handleAmbossHealthCheckChange = () => {
    setAmbossHealthCheck(previousValue => !previousValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      const type = 'get';
      const result = await axiosPostWithAlert({ path: 'settings', postBody: { type } });

      if (!!result) {
        try {
          JSON.parse(result.result);
          setScheduledRebalancing(parse(result.result).scheduledRebalancing.is_enabled);
          setAmbossHealthCheck(parse(result.result).ambossHealthCheck.is_enabled);
        } catch (error) {
          // Ignore errors
        }
      }
    };
    fetchData();
  }, []);

  const postData = async () => {
    const settings = {
      ambossHealthCheck: {
        is_enabled: ambossHealthCheck,
      },
      scheduledRebalancing: {
        is_enabled: scheduledRebalancing,
      },
    };

    const type = 'set';

    const result = await axiosPostWithAlert({ path: 'settings', postBody: { settings, type } });

    if (!!result) {
      useNotify({ type: 'success', message: 'Settings saved' });
    }
  };

  return (
    <CssBaseline>
      <Head>
        <title>User Preferences</title>
      </Head>
      <StartFlexBox>
        <StandardButtonLink destination={clientConstants.dashboardPage} label="Dashboard"></StandardButtonLink>
        <Stack spacing={2} style={styles.form}>
          <h1>User Preferences</h1>
          <li>
            <ul>
              Scheduled Rebalancing switch manages turning on/off scheduled rebalances, you will still have to setup
              rebalances you want to run from the rebalance command page.
            </ul>
          </li>
          <li>
            <ul>Amboss Health Check switch turns on/off sending Amboss health check updates to Amboss</ul>
          </li>
          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch
                checked={scheduledRebalancing}
                onChange={handleScheduleRebalancingChange}
                id="scheduledRebalancing"
              />
            }
            label="Scheduled Rebalancing"
          />

          <FormControlLabel
            style={styles.switch}
            control={
              <StandardSwitch
                checked={ambossHealthCheck}
                onChange={handleAmbossHealthCheckChange}
                id="ambossHealthCheck"
              />
            }
            label="Amboss Health Check"
          />
          <SubmitButton onClick={postData}>Update</SubmitButton>
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

export default UserPreferences;
