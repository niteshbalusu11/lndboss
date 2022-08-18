import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { axiosGet } from '~client/utils/axios';
import { tokensAsBigTokens } from '~client/utils/constants';

/** GET call to NestJs process to get peers list
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

const PeersList = ({ id, label, placeholder, setPeer }: Args) => {
  const [peers, setPeers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const newArray = [];
      const response = await axiosGet({ path: 'grpc/get-peers-all-nodes', query: {} });

      if (!!response) {
        response.forEach(peers => {
          peers.result.forEach(p => {
            newArray.push(
              `${p.alias}\n${p.public_key}\n${tokensAsBigTokens(p.outbound)}/${tokensAsBigTokens(p.inbound)}\nNode: ${
                peers.node
              }`
            );
          });
        });

        setPeers(newArray);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Autocomplete
        id={id}
        freeSolo
        options={peers}
        renderInput={params => <TextField {...params} label={label} placeholder={placeholder} id={id} />}
        onChange={(_event: any, newValue: any) => {
          setPeer(!!newValue ? newValue.split('\n')[1] : '');
        }}
        style={styles.textField}
      />
    </>
  );
};

export default PeersList;
