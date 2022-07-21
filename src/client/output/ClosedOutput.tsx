import React, { useMemo } from 'react';

import { StandardTableOutput } from '~client/standard_components/app-components';

// Renders the output of the bos closed command

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
    closes: any[];
  };
};

const columns = [
  'PeerPublicKey',
  'PeerAlias',
  'IsLocalForceClose',
  'IsCooperativeClose',
  'IsRemoteForceClose',
  'PeerClosedChannel',
  'BlocksSinceClose',
  'Capacity',
  'ChannelId',
  'ChannelOpen',
  'ChannelClose',
  'ChannelBalanceSpendTxID',
  'ChannelResolutions',
  'IsBreachClose',
  'ClosingFeePaid',
];

const ClosedOutput = ({ data }: Args) => {
  const closes = data.closes;
  const dataSet = [];

  const rows = useMemo(() => {
    closes.forEach(close => {
      const row = [];
      row.push(close.peer_public_key);

      if (!!close.peer_alias) {
        row.push(close.peer_alias);
      } else {
        row.push('');
      }
      if (!!close.is_local_force_close) {
        row.push('✅');
      } else {
        row.push('❌');
      }
      if (!!close.is_cooperative_close) {
        row.push('✅');
      } else {
        row.push('❌');
      }
      if (!!close.is_remote_force_close) {
        row.push('✅');
      } else {
        row.push('❌');
      }
      if (!!close.peer_closed_channel) {
        row.push('✅');
      } else {
        row.push('❌');
      }

      row.push(close.blocks_since_close);

      row.push(close.capacity);

      if (!!close.channel_id) {
        row.push(close.channel_id);
      } else {
        row.push('');
      }

      row.push(close.channel_open);

      row.push(close.channel_close);

      if (!!close.channel_balance_spend) {
        row.push(close.channel_balance_spend);
      } else {
        row.push('');
      }

      if (!!close.channel_resolutions) {
        row.push(JSON.stringify(close.channel_resolutions));
      } else {
        row.push('');
      }

      if (!!close.is_breach_close) {
        row.push('✅');
      } else {
        row.push('❌');
      }

      if (!!close.closing_fee_paid) {
        row.push(close.closing_fee_paid);
      } else {
        row.push('');
      }

      dataSet.push(row);
    });

    return [columns, ...dataSet];
  }, [data]);

  return (
    <div style={styles.div} id={'closedoutput'}>
      {!!closes.length && !!dataSet.length ? (
        <StandardTableOutput data={{ rows }} tableId={'closedOutput'} />
      ) : (
        <h2>No Closed Transactions</h2>
      )}
    </div>
  );
};

export default ClosedOutput;
