import React, { useEffect, useState } from 'react';

import Title from './Title';
import Typography from '@mui/material/Typography';
import { axiosGet } from '~client/utils/axios';
import { selectedSavedNode } from '~client/utils/constants';

// Renders the node info section of the dashboard.

const styles = {
  textMargin: {
    marginBottom: '10px',
  },
};

const NodeInfo = () => {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const query = {
        node: selectedSavedNode(),
      };

      const result = await axiosGet({ path: 'grpc/get-wallet-info', query });

      if (!!result) {
        setData(result);
      }
    };

    fetchData();
  }, []);
  return (
    <React.Fragment>
      <Title>Node Info</Title>
      {!!data ? (
        <div>
          <Typography
            color="black"
            variant="body1"
            style={styles.textMargin}
          >{`Pubkey: ${data.public_key}`}</Typography>
          <Typography color="black" variant="body1" style={styles.textMargin}>
            {`Synced To Chain: ${!!data.is_synced_to_chain ? '✅' : '❌'}`}
          </Typography>
          <Typography color="black" variant="body1" style={styles.textMargin}>
            {`Synced To Graph: ${!!data.is_synced_to_graph ? '✅' : '❌'}`}
          </Typography>
          <Typography color="black" variant="body1">
            {`Current Block Height: ${data.current_block_height}`}
          </Typography>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default NodeInfo;
