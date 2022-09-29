import { Autocomplete, Button, CssBaseline, IconButton, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import { axiosPost, axiosPostWithAlert } from '~client/utils/axios';

import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';
import fetchPeersAndTags from '~client/utils/fetch_peers_and_tags';
import { globalCommands } from '~client/commands';
import { useLoading } from '~client/hooks/useLoading';
import { useNotify } from '~client/hooks/useNotify';
import validateAutoFees from '~client/utils/validate_auto_fees';

/*
  Renders the fee scheduler page
  POST call to the NestJs process to schedule auto fees
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '2500px',
  },
  textField: {
    width: '220px',
    marginLeft: '10px',
  },
  h4: {
    marginTop: '0px',
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
  formControl: {
    marginLeft: '10px',
    width: '100px',
  },
};
const FeeScheduler = () => {
  const [formFields, setFormFields] = useState([{ ratio: '', basefees: '', feerate: '', maxhtlcratio: '', id: [] }]);
  const [node, setNode] = useState('');
  const [peersAndTags, setPeersAndTags] = useState([]);

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        useLoading({ isLoading: true });
        const { list } = await fetchPeersAndTags({});
        const result = await axiosPost({ path: 'fees/getfile', postBody: {} });

        setPeersAndTags(list);

        if (!!result) {
          const [{ config }] = result.configs.filter(n => n.node === '');
          setFormFields(config);
        }

        useLoading({ isLoading: false });
      } catch (err) {
        useLoading({ isLoading: false });
      }
    };

    fetchData();
  }, []);

  const fetchDataForSavedNode = async () => {
    const result = await axiosPostWithAlert({ path: 'fees/getfile', postBody: {} });
    const findFeeData = result.configs.find(n => n.node === node);
    if (!findFeeData) {
      useNotify({ type: 'error', message: 'NoConfigFoundForSavedNode' });
      return;
    }
    const [{ config }] = result.configs.filter(n => n.node === node);
    setFormFields(config);
  };

  const fetchData = async () => {
    const baseFees = formFields.map(n => n.basefees) || [];
    const feeRate = formFields.map(n => n.feerate) || [];
    const maxHtlcRatio = formFields.map(n => n.maxhtlcratio) || [];
    const messageId = node === '' ? 'lndboss_fee_scheduling-default' : `lndboss_fee_scheduling-${node}`;
    const ratio = formFields.map(n => n.ratio) || [];

    const isValid = validateAutoFees({ baseFees, feeRate, maxHtlcRatio, ratio });

    if (!isValid.is_valid) {
      useNotify({ type: 'error', message: isValid.message });
      return;
    }

    const postBody = { configs: [] };

    const configs = {
      node,
      config: [],
    };

    formFields.forEach(n => {
      const obj = {
        basefees: '',
        feerate: '',
        maxhtlcratio: '',
        messageid: messageId,
        id: [],
        parsed_id: [],
        ratio: '',
      };

      obj.basefees = n.basefees;
      obj.feerate = n.feerate;
      obj.maxhtlcratio = n.maxhtlcratio;
      obj.id = n.id;
      obj.parsed_id = n.id.map(a => {
        if (!a || a === '') {
          return a;
        }
        const splitValue = a.split('\n')[1].trim();

        return splitValue;
      });
      obj.ratio = n.ratio;

      configs.config.push(obj);
    });

    postBody.configs.push(configs);

    const result = await axiosPostWithAlert({ path: 'fees/save-strategies', postBody });

    if (!!result) {
      useNotify({ type: 'success', message: 'Fee strategies saved' });
    }
  };

  const handleFormChange = (i: number, e: any, newValue?: any) => {
    if (!!newValue) {
      const newFormValues = [...formFields];
      newFormValues[i].id = newValue;
      setFormFields(newFormValues);
      return;
    }

    const newFormValues = [...formFields];
    newFormValues[i][e.target.name] = e.target.value;
    setFormFields(newFormValues);
  };

  const addFields = () => {
    const object = {
      ratio: '',
      basefees: '',
      feerate: '',
      maxhtlcratio: '',
      id: [],
    };

    setFormFields([...formFields, object]);
  };

  const removeFields = index => {
    const data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  return (
    <CssBaseline>
      <Head>
        <title>Fee Scheduler</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>Automated Fees</h2>
          {formFields.map((form, index) => {
            return (
              <div key={index}>
                <br />
                <br />
                <Autocomplete
                  id={`id-${index}`}
                  sx={{ display: 'inline-block' }}
                  freeSolo
                  multiple={true}
                  options={peersAndTags}
                  value={form.id || []}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={'Peers-Tags List (Optional'}
                      placeholder={'Peers-Tags List (Optional'}
                      id={`id-${index}`}
                      style={styles.textField}
                    />
                  )}
                  onChange={(event, newValue) => handleFormChange(index, event, newValue)}
                />

                <TextField
                  type="text"
                  label="Outbound/Capacity Ratio"
                  name={'ratio'}
                  placeholder="Outbound/Capacity Ratio"
                  onChange={event => handleFormChange(index, event)}
                  style={styles.textField}
                  id={`ratio-${index}`}
                  value={form.ratio || ''}
                />

                <TextField
                  type="text"
                  label="Base Fees (msat, optional)"
                  name={'basefees'}
                  placeholder="Base Fees (msat)"
                  onChange={event => handleFormChange(index, event)}
                  style={styles.textField}
                  id={`basefees-${index}`}
                  value={form.basefees || ''}
                />

                <TextField
                  type="text"
                  label="Fee Rate (ppm)"
                  name={'feerate'}
                  placeholder="Fee Rate (ppm)"
                  onChange={event => handleFormChange(index, event)}
                  style={styles.textField}
                  id={`feerate-${index}`}
                  value={form.feerate || ''}
                />

                <TextField
                  type="text"
                  label="MaxHtlc/Capacity Ratio (Optional)"
                  name={'maxhtlcratio'}
                  placeholder="MaxHtlc/Capacity Ratio"
                  onChange={event => handleFormChange(index, event)}
                  style={styles.textField}
                  id={`maxhtlcratio-${index}`}
                  value={form.maxhtlcratio || ''}
                />

                <IconButton aria-label="delete" onClick={() => removeFields(index)} style={styles.iconButton}>
                  <DeleteIcon />
                </IconButton>
              </div>
            );
          })}
          <Button href="#text-buttons" onClick={addFields} style={styles.button}>
            Add +
          </Button>
          <TextField
            type="text"
            placeholder={globalCommands.node.name}
            label={globalCommands.node.name}
            id={globalCommands.node.value}
            onChange={handeNodeChange}
            style={styles.textField}
          />
          <br />
          <SubmitButton onClick={fetchData}>Schedule Fees</SubmitButton>
          <SubmitButton onClick={fetchDataForSavedNode}>Fetch data for saved node</SubmitButton>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default FeeScheduler;

export async function getServerSideProps() {
  return {
    props: {},
  };
}
