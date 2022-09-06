import * as types from '~shared/types';

import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { axiosGetNoLoading } from '~client/utils/axios';
import { tokensAsBigTokens } from '~client/utils/constants';
import { useLoading } from '~client/hooks/useLoading';

/** GET call to NestJs process to get peers and tags list
  {
    id: <String>,
    label: <String>,
    placeholder: <String>,
    setPeer: <Function>
  }
  @returns
  {
    setPeer: <Function>
  }
 */

type Args = {
  id: string;
  label: string;
  placeholder: string;
  setPeer: (peer: string) => void;
};

const styles = {
  textField: {
    width: '600px',
  },
};

const PeersAndTagsList = ({ id, label, placeholder, setPeer }: Args) => {
  const [peersAndTags, setPeersAndTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const tagsQuery: types.commandTags = {
        icon: '',
        add: '',
        id: '',
        is_avoided: false,
        remove: '',
        tag: '',
      };

      const newArray = [];
      useLoading({ isLoading: true });
      const [responsePeers, responseTags] = await Promise.all([
        axiosGetNoLoading({ path: 'grpc/get-peers-all-nodes', query: {} }),
        axiosGetNoLoading({ path: 'tags', query: tagsQuery }),
      ]);

      if (!!responsePeers) {
        responsePeers.forEach(peers => {
          peers.result.forEach(p => {
            newArray.push(
              `${p.alias}\n${p.public_key}\n${tokensAsBigTokens(p.inbound)}/${tokensAsBigTokens(p.outbound)}\nNode: ${
                peers.node
              }`
            );
          });
        });

        if (!!responseTags) {
          responseTags.forEach(tag => {
            newArray.push(`Tag: \n${tag.alias}`);
          });
        }

        setPeersAndTags(newArray);
        useLoading({ isLoading: false });
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Autocomplete
        id={id}
        freeSolo
        options={peersAndTags}
        renderInput={params => <TextField {...params} label={label} placeholder={placeholder} id={id} />}
        onChange={(_event: any, newValue: any) => {
          setPeer(!!newValue ? newValue.split('\n')[1] : '');
        }}
        style={styles.textField}
      />
    </>
  );
};

export default PeersAndTagsList;
