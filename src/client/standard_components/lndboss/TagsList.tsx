import * as types from '~shared/types';

import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { axiosGet } from '~client/utils/axios';

type Args = {
  id: string;
  label: string;
  placeholder: string;
  setTag: (peer: string) => void;
};

const styles = {
  textField: {
    width: '400px',
  },
};

const TagsList = ({ id, label, placeholder, setTag }: Args) => {
  const [tags, setTags] = useState([]);

  const query: types.commandTags = {
    icon: '',
    add: '',
    id: '',
    is_avoided: false,
    remove: '',
    tag: '',
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await axiosGet({ path: 'tags', query });

      if (!!result) {
        setTags(result);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Autocomplete
        id={id}
        freeSolo
        options={tags.map(tag => tag.alias)}
        renderInput={params => <TextField {...params} label={label} placeholder={placeholder} id={id} />}
        onChange={(_event: any, newValue: any) => {
          setTag(!!newValue ? newValue : '');
        }}
        style={styles.textField}
      />
    </>
  );
};

export default TagsList;
