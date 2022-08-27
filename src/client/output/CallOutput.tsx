import * as YAML from 'json-to-pretty-yaml';

import React from 'react';

// Renders output of bos call command

const styles = {
  pre: {
    fontWeight: 'bold',
  },
};

type Args = {
  data: any[];
};

const CallOutput = ({ data }: Args) => {
  const output = YAML.stringify(data);
  return (
    <div id={'callOutput'}>
      {Object.keys(data).length ? <pre style={styles.pre}>{output}</pre> : <h3>No data found</h3>}
    </div>
  );
};

export default CallOutput;
