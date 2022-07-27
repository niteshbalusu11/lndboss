import * as YAML from 'json-to-pretty-yaml';

import React, { useMemo } from 'react';

import { StandardTableOutput } from '~client/standard_components/app-components';
import stripAnsi from 'strip-ansi';

// Renders the table output of the bos peers command

const styles = {
  div: {
    minWidth: '700px',
    marginRight: '50px',
  },
  text: {
    fontSize: '15px',
    fontWeight: 'bold',
  },
  pre: {
    fontWeight: 'bold',
  },
};

type Args = {
  data: {
    peers: any[];
    rows: any[];
  };
  isComplete: boolean;
};
const PeersOutput = ({ data, isComplete }: Args) => {
  console.log(data);
  const RenderOutput = () => {
    if (!isComplete && !!data.rows) {
      const dataSet = [];
      data.rows.forEach((row: string[]) => {
        const newRow = [];
        row.forEach((n: string) => {
          newRow.push(stripAnsi(String(n)));
        });
        dataSet.push(newRow);
      });

      const rows = useMemo(() => {
        return dataSet;
      }, [dataSet]);

      return !!rows.length ? (
        <StandardTableOutput data={{ rows }} tableId={'forwardsOutput'} />
      ) : (
        <h2>NoPeersDataToDisplay</h2>
      );
    }

    if (!!data.peers) {
      const output = YAML.stringify(data);
      return (
        <div id={'findoutput'}>
          {Object.keys(data).length ? <pre style={styles.pre}>{output}</pre> : <h3>NoPeersDataToDisplay</h3>}
        </div>
      );
    }
  };

  return <RenderOutput />;
};

export default PeersOutput;
