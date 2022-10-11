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
import validateAutoFees from '~client/utils/validations/validate_auto_fees';

const splitValue = n => n.split('\n')[1].trim();

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
type FormFieldState = Array<{
  ratios: string[];
  basefees: string[];
  feerates: string[];
  maxhtlcratios: string[];
  ids: string[];
  inactivity: string[];
}>;
const FeeScheduler = () => {
  const [formFields, setFormFields] = useState<FormFieldState>([
    { ratios: [], basefees: [], feerates: [], maxhtlcratios: [], ids: [], inactivity: [] },
  ]);
  const [node, setNode] = useState('');
  const [peersAndTags, setPeersAndTags] = useState([]);

  const handleNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!result) {
      useNotify({ type: 'error', message: 'NoConfigFoundForSavedNode' });
      return;
    }

    const findFeeData = result.configs.find(n => n.node === node);
    if (!findFeeData) {
      useNotify({ type: 'error', message: 'NoConfigFoundForSavedNode' });
      return;
    }
    const [{ config }] = result.configs.filter(n => n.node === node);

    setFormFields(config);
  };

  const fetchData = async () => {
    const messageId = node === '' ? 'lndboss_fee_scheduling-default' : `lndboss_fee_scheduling-${node}`;

    try {
      formFields.forEach((n, index) => {
        validateAutoFees({
          index: index + 1,
          baseFees: n.basefees,
          feeRates: n.feerates,
          maxHtlcRatios: n.maxhtlcratios,
          ratios: n.ratios,
        });
      });
    } catch (error) {
      useNotify({ type: 'error', message: error.message });
      return;
    }

    const configs = {
      node,
      message_id: messageId,
      config: [],
    };

    formFields.forEach(n => {
      const obj = {
        basefees: n.basefees,
        feerates: n.feerates,
        maxhtlcratios: n.maxhtlcratios,
        ids: n.ids,
        inactivity: [],
        ratios: n.ratios,
        parsed_ids: n.ids.map(a => splitValue(a)),
      };

      configs.config.push(obj);
    });

    const postBody = { configs };

    const result = await axiosPostWithAlert({ path: 'fees/save-strategies', postBody });

    if (!!result) {
      useNotify({ type: 'success', message: 'Fee strategies saved' });
    }
  };

  const handleBaseFeesChange = (i: number, e: any, newValue?: any) => {
    if (!!newValue) {
      const newFormValues = [...formFields];
      newFormValues[i].basefees = newValue;
      setFormFields(newFormValues);
    }
  };

  const handleFeeRateChange = (i: number, e: any, newValue?: any) => {
    if (!!newValue) {
      const newFormValues = [...formFields];
      newFormValues[i].feerates = newValue;
      setFormFields(newFormValues);
    }
  };

  const handleIdChange = (i: number, e: any, newValue?: any) => {
    if (!!newValue) {
      const newFormValues = [...formFields];
      newFormValues[i].ids = newValue;
      setFormFields(newFormValues);
    }
  };

  const handleMaxHtlcRatioChange = (i: number, e: any, newValue?: any) => {
    if (!!newValue) {
      const newFormValues = [...formFields];
      newFormValues[i].maxhtlcratios = newValue;
      setFormFields(newFormValues);
    }
  };

  const handleRatioChange = (i: number, e: any, newValue?: any) => {
    if (!!newValue) {
      const newFormValues = [...formFields];
      newFormValues[i].ratios = newValue;
      setFormFields(newFormValues);
    }
  };

  const addFields = () => {
    const object = {
      ratios: [],
      basefees: [],
      feerates: [],
      maxhtlcratios: [],
      ids: [],
      inactivity: [],
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
          <h1>Automated Fees Scheduler</h1>
          <h2>
            To use Automated Fees Scheduler make sure to enable Automated Fees from User Preferences on the Dashboard
            Page.
          </h2>
          <Instructions />
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
                  value={form.ids || []}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={'Peers-Tags List (Optional'}
                      placeholder={'Peers-Tags List (Optional'}
                      id={`id-${index}`}
                      style={styles.textField}
                    />
                  )}
                  onChange={(event, newValue) => handleIdChange(index, event, newValue)}
                />

                <Autocomplete
                  id={`ratio-${index}`}
                  sx={{ display: 'inline-block' }}
                  freeSolo
                  multiple={true}
                  options={form.ratios || []}
                  value={form.ratios || []}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Outbound/Capacity Ratio"
                      placeholder="Outbound/Capacity Ratio"
                      value={form.ratios}
                      style={styles.textField}
                      id={`ratio-${index}`}
                    />
                  )}
                  onChange={(event, newValue) => handleRatioChange(index, event, newValue)}
                />

                <Autocomplete
                  id={`basefees-${index}`}
                  sx={{ display: 'inline-block' }}
                  freeSolo
                  multiple={true}
                  options={form.basefees || []}
                  value={form.basefees || []}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Base Fees (msat, optional)"
                      placeholder="Base Fees (msat)"
                      value={form.basefees}
                      style={styles.textField}
                      id={`basefees-${index}`}
                    />
                  )}
                  onChange={(event, newValue) => handleBaseFeesChange(index, event, newValue)}
                />

                <Autocomplete
                  id={`feerate-${index}`}
                  sx={{ display: 'inline-block' }}
                  freeSolo
                  multiple={true}
                  options={form.feerates || []}
                  value={form.feerates || []}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Fee Rate (ppm)"
                      placeholder="Fee Rate (ppm)"
                      value={form.feerates}
                      style={styles.textField}
                      id={`feerate-${index}`}
                    />
                  )}
                  onChange={(event, newValue) => handleFeeRateChange(index, event, newValue)}
                />

                <Autocomplete
                  id={`maxhtlcratio-${index}`}
                  sx={{ display: 'inline-block' }}
                  freeSolo
                  multiple={true}
                  options={form.maxhtlcratios || []}
                  value={form.maxhtlcratios || []}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="MaxHtlc/Capacity Ratio (Optional)"
                      placeholder="MaxHtlc/Capacity Ratio"
                      value={form.maxhtlcratios}
                      style={styles.textField}
                      id={`maxhtlcratio-${index}`}
                    />
                  )}
                  onChange={(event, newValue) => handleMaxHtlcRatioChange(index, event, newValue)}
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
            onChange={handleNodeChange}
            style={styles.textField}
          />
          <br />
          <div style={{ display: 'inline-block', margin: '0px' }}>
            <SubmitButton onClick={fetchData} style={{ marginRight: '50px' }}>
              Schedule Fees
            </SubmitButton>
            <SubmitButton onClick={fetchDataForSavedNode}>Fetch data for saved node</SubmitButton>
          </div>
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

const Instructions = () => {
  return (
    <ul>
      <h3>Important Notes:</h3>
      <li>
        Saved Node field is only required if you control multiple nodes with lndboss, leave it blank if you only run one
        node.
      </li>
      <li>Atleast one Outbound/Capacity Ratio is required.</li>
      <li>Peers-Tags are optional, not selecting will make the policy apply to all peers.</li>
      <li>
        Every field can take multiple values, type a value and hit enter and it will turn into a bubble (IMPORTANT).
      </li>
      <li>Policies execute in order, row by row. Policies set in row 1 will apply to peers/tags selected in row 1.</li>
      <li>If you want to set different policies to different peers/tags then click the add button to add a new row.</li>
      <li>You could also add a new row for the same set of peers if you just want it to look cleaner.</li>
      <li>
        If you set two 2 ratios in row 1, you can only set 0 or 2 base fees, feerates and maxhtlc ratios. Length must
        match or be null
      </li>

      <br />
      <h3>Peers-Tags list (optional)</h3>
      <li>Pick peers and tags to apply the policies to.</li>
      <li>Not picking a peer or tag will make the policy apply to all your peers.</li>

      <br />
      <h3>Outbound/Capacity Ratio Range (required):</h3>
      <li>Ratio range between current outbound liquidity to the total capacity of the channel.</li>
      <li>
        Example outbound/capacity ratio range: 0.5-0.7 This implies the policy applies when outbound liquidity is 50-70%
        of the total capacity.
      </li>
      <li>
        Multiple ratio ranges can be added in the same field, just type a range and hit enter and it turns into a
        bubble.
      </li>

      <br />
      <h3>Base Fees (msat, optional):</h3>
      <li>Base fees in milli sats to apply, multiple values can be set in the same field.</li>
      <li>Default base fees is 1000msat or 1sat if left blank.</li>

      <br />
      <h3>Fee Rate (ppm, optional):</h3>
      <li>Fee Rate in ppm to apply, multple values can be set in the same field.</li>
      <li>Default fee rate is 1ppm if left blank.</li>

      <br />
      <h3>MaxHtlc/Capacity Ratio (optional):</h3>
      <li>Ratio between MaxHtlc Size and Capacity of the channel.</li>
      <li>
        Example: 0.3 would imply set the maxhtlc to 30% of the total capacity for a given outbound/capacity ratio.
      </li>
      <li>
        If left blank, it will default to the current maxhtlc value of the channel. Multiple values can be set, just
        type a value and hit enter.
      </li>
    </ul>
  );
};
