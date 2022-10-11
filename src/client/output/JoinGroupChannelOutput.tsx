import React from 'react';

/*
  Renders the output of the join-group-channel command.
*/

type Args = {
  data: string | undefined;
};
const JoinGroupChannelOutput = ({ data }: Args) => {
  return (
    <div style={styles.div} id="creategroupchanneloutput">
      {!!data && <pre>{data}</pre>}
    </div>
  );
};

export default JoinGroupChannelOutput;

const styles = {
  div: {
    width: '1100px',
  },
};
