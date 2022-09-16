import { CopyText } from '~client/standard_components/app-components';
import React from 'react';
import { Typography } from '@mui/material';
const substring = (n: string) => n.slice(0, 20) + '......' + n.slice(-20);

/*
  Renders the output of the Open command.
*/

const styles = {
  div: {
    marginTop: '20px',
    marginLeft: '10px',
  },
  qr: {
    height: '250px',
    width: '250px',
    padding: '5px',
  },
  text: {
    fontSize: '15px',
    fontWeight: 'bold',
    display: 'inline-block',
  },
};

type Data = {
  data: {
    transaction: string;
    transaction_id: string;
  };
};

const OpenOutput = ({ data }: Data) => {
  return (
    <div>
      <Typography color="black" variant="h3" style={styles.text}>
        {`Transaction: ${data.transaction_id}`}
      </Typography>
      <CopyText text={data.transaction_id} />
      <br />
      <Typography color="black" variant="h3" style={styles.text}>
        {`Raw Transaction: ${substring(data.transaction)}`}
      </Typography>
      <CopyText text={data.transaction} />
    </div>
  );
};

export default OpenOutput;
