import * as YAML from 'json-to-pretty-yaml';

import React from 'react';

const stringify = (obj: any) => JSON.stringify(obj, null, 2);

// Renders the output of bos price command

const styles = {
  pre: {
    fontWeight: 'bold',
  },
};

type Args = {
  data: object;
  file: boolean;
};

const ManageOutput = ({ data, file }: Args) => {
  if (!data || !Object.keys(data).length) {
    return <h3>No data found</h3>;
  }

  if (!!file) {
    return (
      <a
        href={`data:text/json;charset=utf-8,${encodeURIComponent(stringify(data))}`}
        download={'price.json'}
        id="priceJson"
      >
        Results are ready, click here to download
      </a>
    );
  }

  const output = YAML.stringify(data);

  return <pre style={styles.pre}>{output}</pre>;
};

const PriceOutput = ({ data, file }: Args) => {
  return (
    <div id="priceoutput">
      <ManageOutput data={data} file={file} />
    </div>
  );
};

export default PriceOutput;
