import { InputLabel, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';

import ProgressBar from '../app-components/ProgressBar';
import { axiosGet } from '~client/utils/axios';

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '700px',
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
  inputLabel: {
    fontWeight: 'bold',
    color: 'black',
  },
  select: {
    width: '700px',
  },
  switch: {
    width: '100px',
  },
};

const PeersList = () => {
  const [peers, setPeers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosGet({ path: 'grpc/get-peers-all-nodes', query: {} });

      if (!!response) {
        setPeers(response);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div>
        <InputLabel id="accounting-category" style={styles.inputLabel}>
          Pick a value (Required)
        </InputLabel>
        <Select labelId="category" id="category" label="Accounting Category" style={styles.select}></Select>
      </div>
      {peers.map(peer =>
        peer.result.map((p, index) => (
          <ProgressBar
            bgcolor="#148707"
            completed={(p.outbound / p.capacity) * 100}
            key={index}
            display={`Alias: ${p.alias} Local: ${p.outbound} Remote: ${p.inbound} Node: ${peer.node}`}
            id={p.public_key}
          />
        ))
      )}
    </>
  );
};

export default PeersList;
