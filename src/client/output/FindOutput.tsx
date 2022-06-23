import * as YAML from 'json-to-pretty-yaml';

import React from 'react';

// Renders output of bos find command

const styles = {
  pre: {
    fontWeight: 'bold',
  },
};

type Args = {
  data: any[];
};

const FindOutput = ({ data }: Args) => {
  const output = YAML.stringify(data);
  return (
    <div id={'findoutput'}>
      {Object.keys(data).length ? <pre style={styles.pre}>{output}</pre> : <h3>No data found</h3>}
    </div>
  );
};

export default FindOutput;
