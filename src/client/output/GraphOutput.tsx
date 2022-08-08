import React from 'react';
import { StandardTableOutput } from '~client/standard_components/app-components';

// Renders the output of the bos graph command

type Props = {
  data: string[];
};
const GraphOutput = ({ data }: Props) => {
  return (
    <div>
      {!!data ? <StandardTableOutput data={{ rows: data }} tableId="graphOutput" /> : <h2>No Output to display</h2>}
    </div>
  );
};

export default GraphOutput;
