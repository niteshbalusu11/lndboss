import * as YAML from 'json-to-pretty-yaml';

import React from 'react';
import { StandardTableOutput } from '~client/standard_components/app-components';

// Renders the output of the bos graph command

type Props = {
  data: string[][];
  summary: object;
};

const styles = {
  pre: {
    fontWeight: 'bold',
  },
};
const GraphOutput = ({ data, summary }: Props) => {
  const output = YAML.stringify(summary);

  return (
    <div>
      <pre style={styles.pre}>{output}</pre>
      {!!data ? <StandardTableOutput data={{ rows: data }} tableId="graphOutput" /> : <h2>No Output to display</h2>}
    </div>
  );
};

export default GraphOutput;
