import { CopyText } from '~client/standard_components/app-components';
import React from 'react';

const substring = n => n.slice(0, 20) + '......' + n.slice(-20);

/*
  Renders the output of the Encrypt command.
*/

type Args = {
  data: {
    encrypted: string;
    to: string;
  };
};
const EncryptOutput = ({ data }: Args) => {
  return (
    <div style={styles.div}>
      <p style={styles.text}>{`Encrypted: ${substring(data.encrypted)}`}</p>
      <CopyText text={data.encrypted} />
      <p style={styles.text}>{`To: ${data.to}`}</p>
    </div>
  );
};

export default EncryptOutput;

const styles = {
  div: {
    marginTop: '100px',
    marginLeft: '10px',
  },
  text: {
    fontSize: '15px',
    fontWeight: 'bold',
    display: 'inline-block',
  },
};
