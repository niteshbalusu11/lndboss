import React, { useMemo } from 'react';

import { StandardTableOutput } from '~client/standard_components/app-components';
import { removeStyling } from '~client/utils/constants';

const isNumber = (n: number | UtxosResult) => typeof n === 'number';

// Renders the output of the bos utxos command

type UtxosResult = {
  utxos: [
    {
      address: string;
      amount: string;
      confirmations?: number;
      outpoint: string;
      is_unconfirmed?: boolean;
      locked?: string;
      lock_expires_at?: string;
      related_description?: string;
      related_channels?: string[];
    }
  ];
};
type Props = {
  data: {
    result: number | UtxosResult;
  };
};

const columns = [
  'Address',
  'Amount',
  'Confirmations',
  'Outpoint',
  'IsUnconfirmed',
  'Locked',
  'LockExpiresAt',
  'RelatedDescription',
  'RelatedChannels',
];
const UtxosOutput = ({ data }: Props) => {
  if (!!isNumber(data.result)) {
    return (
      <div>
        <pre style={styles.pre}>{`Count is: ${data.result}`}</pre>
      </div>
    );
  }

  const utxos = typeof data.result === 'object' ? data.result.utxos : ([] as any);
  const dataSet: any = [];

  const rows = useMemo(() => {
    utxos.forEach(utxo => {
      const row: any = [];

      row.push(utxo.address);

      row.push(removeStyling(utxo.amount));

      utxo.confirmations !== undefined ? row.push(utxo.confirmations) : row.push('');

      row.push(utxo.outpoint);

      utxo.is_unconfirmed !== undefined ? row.push(String(utxo.is_unconfirmed)) : row.push('');

      utxo.locked !== undefined ? row.push(utxo.locked) : row.push('');

      utxo.lock_expires_at !== undefined ? row.push(utxo.lock_expires_at) : row.push('');

      utxo.related_description !== undefined ? row.push(utxo.related_description) : row.push('');

      utxo.related_channels !== undefined && !!utxo.related_channels.length
        ? row.push(utxo.related_channels.join(', '))
        : row.push('');

      dataSet.push(row);
    });

    return [columns, ...dataSet];
  }, [data]);

  return (
    <div style={styles.div} id={'utxosoutput'}>
      {!!utxos.length && !!dataSet.length ? (
        <StandardTableOutput data={{ rows }} tableId={'utxosOutput'} />
      ) : (
        <h2>No Utxos To Display</h2>
      )}
    </div>
  );
};

export default UtxosOutput;

const styles = {
  div: {
    minWidth: '700px',
    marginRight: '50px',
  },
  pre: {
    fontWeight: 'bold',
  },
};
