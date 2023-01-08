import React from 'react';

/*
  Renders the output of the Decrypt command.
*/

type Args = {
  data: {
    message: string;
    with_alias: string;
    with_public_key: string;
  };
};
const DecryptOutput = ({ data }: Args) => {
  return (
    <div style={styles.style}>
      <div style={styles.headerStyle}>
        <strong>Result</strong>
      </div>

      <pre style={styles.preStyle}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DecryptOutput;

const styles = {
  headerStyle: {
    backgroundColor: '#193549',
    padding: '5px 10px',
    fontFamily: 'monospace',
    color: '#ffc600',
  },
  preStyle: {
    display: 'block',
    padding: '10px 30px',
    margin: '0',
    overflow: 'scroll',
  },
  style: {
    backgroundColor: '#1f4662',
    color: '#fff',
    fontSize: '12px',
  },
};
