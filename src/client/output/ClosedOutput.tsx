import JSONPretty from 'react-json-pretty';
import React from 'react';

// Renders the output of the bos closed command

const styles = {
  div: {
    marginTop: '100px',
    marginLeft: '10px',
  },
  text: {
    fontSize: '15px',
    fontWeight: 'bold',
  },
};

type Args = {
  data: {
    closes: any[];
  };
};

const ClosedOutput = ({ data }: Args) => {
  const closes = data.closes;

  return (
    <div style={styles.div} id={'closedoutput'}>
      {!!closes.length ? (
        <JSONPretty id="json-pretty" data={closes} style={styles.text}></JSONPretty>
      ) : (
        <h2>No Closed Transactions</h2>
      )}
    </div>
  );
};

export default ClosedOutput;
