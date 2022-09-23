import React from 'react';
import { StandardTableOutput } from '~client/standard_components/app-components';

// Renders the output of the bos fees command

type Props = {
  data: {
    rows: string[][];
  };
};

const FeesOutput = ({ data }: Props) => {
  return (
    <div style={{ marginTop: '30px' }}>
      {!!data ? <StandardTableOutput data={data} tableId="feesOutput" /> : <h2>No Output to display</h2>}
    </div>
  );
};

export default FeesOutput;
