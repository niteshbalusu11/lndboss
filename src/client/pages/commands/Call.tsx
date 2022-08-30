import { CssBaseline, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '~client/standard_components/app-components';
import commands, { globalCommands } from '~client/commands';

import { CallOutput } from '~client/output';
import Head from 'next/head';
import { RawApiList } from '~client/standard_components/lndboss';
import { axiosPostWithAlert } from '~client/utils/axios';
import { rawApi } from '~shared/raw_api';
import { useNotify } from '~client/hooks/useNotify';
import validateCallCommandArgs from '~client/utils/validate_call_command_args';

const CallCommand = commands.find(n => n.value === 'Call');
const argument = (n: string) => rawApi.calls.find(s => s.method === n);

/*
  Renders the bos call command
  Passes query parameters to the chart-chain-fees results page
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '700px',
  },
  textField: {
    width: '500px',
  },
  h4: {
    marginTop: '0px',
  },
  switch: {
    width: '100px',
  },
};

const Call = () => {
  const [node, setNode] = useState('');
  const [argumentsArray, setArgumentsArray] = useState(null);
  const [validationArray, setValidationArray] = useState([{ named: '', value: '', type: '', required: false }]);
  const [method, setMethod] = useState('');
  const [data, setData] = useState(null);
  const getArguments = !!method && !!argument(method).arguments ? argument(method).arguments.map(n => n) : [];

  useEffect(() => {
    if (!!method) {
      setArgumentsArray(
        !!argument(method).arguments
          ? argument(method).arguments.map((n: { named: string }) => {
              const obj = {};
              obj[n.named] = '';
              return obj;
            })
          : []
      );

      setValidationArray(
        !!getArguments && !!getArguments.length
          ? getArguments.map(n => {
              return {
                named: n.named,
                value: '',
                type: n.type || '',
                required: !n.optional,
              };
            })
          : [{ named: '', value: '', type: '', required: false }]
      );
    }
  }, [method]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    named: string,
    type: string,
    optional: boolean
  ) => {
    const newFormValues = argumentsArray;
    newFormValues[index][named] = e.target.value;

    setArgumentsArray(newFormValues);

    const newValidationArray = validationArray;
    newValidationArray[index] = { named, value: e.target.value, type, required: !optional };
    setValidationArray(newValidationArray);
  };

  const handeNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNode(event.target.value);
  };

  const fetchData = async () => {
    const { message } = validateCallCommandArgs({ args: validationArray });

    if (!!message) {
      useNotify({ type: 'error', message });
      return;
    }

    const postArgs = {};
    argumentsArray.forEach(n => {
      Object.assign(postArgs, n);
    });

    const result = await axiosPostWithAlert({ path: 'call', postBody: { method, node, postArgs } });

    if (!!result) {
      setData(result.result);
      useNotify({ type: 'success', message: 'Call command completed.' });
    }
  };

  const RenderArguments = () => {
    return (
      <>
        {getArguments.map((n, index) => (
          <div key={n.named}>
            <TextField
              label={n.named}
              placeholder={n.description}
              style={styles.textField}
              required={n.optional !== true}
              id={n.named}
              onChange={e => handleChange(index, e, n.named, n.type, n.optional)}
            />
          </div>
        ))}
      </>
    );
  };

  return (
    <CssBaseline>
      <Head>
        <title>Call</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={2} style={styles.form}>
          <h2>{CallCommand.name}</h2>
          <h4 style={styles.h4}>{CallCommand.description}</h4>
          <RawApiList setMethod={setMethod} />
          <RenderArguments />
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
          {!!data ? <CallOutput data={data} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Call;
