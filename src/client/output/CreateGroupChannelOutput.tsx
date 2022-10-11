import React from 'react';

/*
  Renders the output of the create-group-channel command.
*/

type Args = {
  data: string | undefined;
};
const CreateGroupChannelOutput = ({ data }: Args) => {
  return (
    <div style={styles.div} id="creategroupchanneloutput">
      {!!data && <pre>{data}</pre>}
    </div>
  );
};

export default CreateGroupChannelOutput;

const styles = {
  div: {
    width: '1100px',
  },
};
