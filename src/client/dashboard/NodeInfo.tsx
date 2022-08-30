import React, { useEffect, useState } from 'react';

import { CopyText } from '~client/standard_components/app-components';
import Title from './Title';
import Typography from '@mui/material/Typography';
import { axiosGetNoLoading } from '~client/utils/axios';
import { selectedSavedNode } from '~client/utils/constants';

const substring = n => n.slice(0, 20) + '......' + n.slice(-20);

// Renders the node info section of the dashboard.

const styles = {
  text: {
    marginBottom: '10px',
    display: 'inline-block',
  },
  textMargin: {
    marginBottom: '10px',
  },
};

const NodeInfo = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const query = {
        node: selectedSavedNode(),
      };

      const result = await axiosGetNoLoading({ path: 'grpc/get-wallet-info', query });

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
          <Typography color="black" variant="body2" style={styles.text}>
            {`Pubkey: ${data.public_key}`}
          </Typography>
          <CopyText text={data.public_key} />
          {!!data.uris && !!data.uris.length
            ? data.uris.map((uri, index) => (
                <div key={index}>
                  <Typography color="black" variant="body2" style={styles.text}>{`URI: ${substring(uri)}`}</Typography>
                  <CopyText text={uri} />
                </div>
              ))
            : null}
          <Typography color="black" variant="body2" style={styles.textMargin}>
            {`Synced To Chain: ${!!data.is_synced_to_chain ? '✅' : '❌'}`}
          </Typography>
          <Typography color="black" variant="body2" style={styles.textMargin}>
            {`Synced To Graph: ${!!data.is_synced_to_graph ? '✅' : '❌'}`}
          </Typography>
          <Typography color="black" variant="body2" style={styles.textMargin}>
            {`Current Block Height: ${data.current_block_height}`}
          </Typography>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default NodeInfo;
