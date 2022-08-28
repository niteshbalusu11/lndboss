import { Autocomplete, TextField } from '@mui/material';

import React from 'react';
import { rawApi } from '~shared/raw_api';

// Renders the raw api list for call command

const styles = {
  textField: {
    width: '600px',
  },
};

type Args = {
  setMethod: (method: string) => void;
};

const RawApiList = ({ setMethod }: Args) => {
  const methods = rawApi.calls.map(call => call.method);

  return (
    <>
      <Autocomplete
        id={'rawApiMethodAutoComplete'}
        freeSolo
        options={methods}
        renderInput={params => <TextField {...params} label={'Method'} placeholder={'Method'} id={'rawApiMethod'} />}
        onChange={(_event: any, newValue: any) => {
          setMethod(newValue || '');
        }}
        style={styles.textField}
      />
    </>
  );
};

export default RawApiList;
