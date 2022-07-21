import React, { useMemo } from 'react';

import { StandardTableOutput } from '~client/standard_components/app-components';

// Renders the output of the bos forwards command

const styles = {
  div: {
    minWidth: '700px',
    marginRight: '50px',
  },
  text: {
    fontSize: '15px',
    fontWeight: 'bold',
  },
};

type Args = {
  data: {
    peers: any[];
  };
};

const columns = [
  'Icons',
  'Alias',
  'EarnedInboundFees',
  'EarnedOutboundFees',
  'LastInboundAt',
  'LiquidityInbound',
  'LiquidityOutbound',
  'PublicKey',
];

const ForwardsOutput = ({ data }: Args) => {
  const peers = data.peers;
  const dataSet = [];

  const rows = useMemo(() => {
    peers.forEach(peer => {
      const row = [];

      if (!!peer.icons && !!peer.icons.length) {
        row.push(peer.icons.toString());
      } else {
        row.push('');
      }

      if (!!peer.alias) {
        row.push(peer.alias);
      } else {
        row.push('');
      }

      row.push(peer.earned_inbound_fees);

      row.push(peer.earned_outbound_fees);

      row.push(peer.last_inbound_at);

      row.push(peer.liquidity_inbound);

      row.push(peer.liquidity_outbound);

      row.push(peer.public_key);

      dataSet.push(row);
    });

    return [columns, ...dataSet];
  }, [data]);

  return (
    <div style={styles.div} id={'forwardsoutput'}>
      {!!peers.length && !!dataSet.length ? (
        <StandardTableOutput data={{ rows }} tableId={'forwardsOutput'} />
      ) : (
        <h2>No Forwards To Display</h2>
      )}
    </div>
  );
};

export default ForwardsOutput;
