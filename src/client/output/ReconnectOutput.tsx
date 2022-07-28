import * as YAML from 'json-to-pretty-yaml';

import React from 'react';

// Renders output of bos reconnect command

const styles = {
  pre: {
    fontWeight: 'bold',
  },
};

type Args = {
  data: any[];
};

const ReconnectOutput = ({ data }: Args) => {
  const output = YAML.stringify(data);
  return (
    <div id={'reconnectOutput'}>
      {Object.keys(data).length ? <pre style={styles.pre}>{output}</pre> : <h3>No data found</h3>}
    </div>
  );
};

export default ReconnectOutput;
