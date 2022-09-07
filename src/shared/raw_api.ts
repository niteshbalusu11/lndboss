export const rawApi = {
  calls: [
    {
      arguments: [
        {
          description: 'Node identity hex encoded public key',
          named: 'public_key',
          type: 'public_key',
        },
        {
          description: 'Node network address host:port',
          named: 'socket',
        },
      ],
      method: 'addPeer',
    },
    {
      arguments: [
        {
          description: 'Add advertised node network address host:port',
          named: 'socket',
        },
      ],
      method: 'addExternalSocket',
    },
    {
      arguments: [
        {
          description: 'Raw hex encoded signed raw transaction',
          named: 'transaction',
        },
        {
          description: 'Transaction description label',
          named: 'description',
          optional: true,
        },
      ],
      method: 'broadcastChainTransaction',
    },
    {
      arguments: [
        {
          description: 'Id of invoice to cancel',
          named: 'id',
          type: 'hash',
        },
      ],
      method: 'cancelHodlInvoice',
    },
    {
      arguments: [
        {
          description: 'Id of pending channel to cancel',
          named: 'id',
          type: 'hash',
        },
      ],
      method: 'cancelPendingChannel',
    },
    {
      arguments: [
        {
          description: 'Chain address format: np2wpkh, p2wpkh or p2tr',
          named: 'format',
        },
      ],
      method: 'createChainAddress',
    },
    {
      arguments: [
        {
          description: 'Final CLTV delta',
          named: 'cltv_delta',
          optional: true,
          type: 'number',
        },
        {
          description: 'Description',
          named: 'description',
          optional: true,
        },
        {
          description: 'Hash',
          named: 'id',
          optional: true,
          type: 'hash',
        },
        {
          description: 'Millitokens to request',
          named: 'mtokens',
          optional: true,
        },
      ],
      method: 'createHodlInvoice',
    },
    {
      arguments: [
        {
          description: 'Final CLTV delta',
          named: 'cltv_delta',
          optional: true,
          type: 'number',
        },
        {
          description: 'Description',
          named: 'description',
          optional: true,
        },
        {
          description: 'Use predefined hex encoded secret preimage',
          named: 'secret',
          optional: true,
        },
        {
          description: 'Millitokens to request',
          named: 'mtokens',
          optional: true,
        },
        {
          description: 'Include private channels in the payment request?',
          named: 'is_including_private_channels',
          type: 'boolean',
        },
      ],
      method: 'createInvoice',
    },
    {
      arguments: [
        {
          description: 'BOLT 11 encoded payment request',
          named: 'request',
        },
      ],
      method: 'decodePaymentRequest',
    },
    {
      method: 'deleteForwardingReputations',
    },
    {
      arguments: [
        {
          description: 'Hex-encoded payment preimage hash',
          named: 'id',
          type: 'hash',
        },
      ],
      method: 'deletePayment',
    },
    {
      method: 'deletePayments',
    },
    {
      arguments: [
        {
          description: 'Conflicting confirmed transaction',
          named: 'confirmed_transaction',
        },
        {
          description: 'Stuck pending transaction',
          named: 'pending_transaction',
        },
        {
          description: 'Stuck pending channel transaction output index',
          named: 'pending_transaction_vout',
          type: 'number',
        },
      ],
      method: 'deletePendingChannel',
    },
    {
      arguments: [
        {
          description: 'Key family for shared key',
          named: 'key_family',
          optional: true,
          type: 'number',
        },
        {
          description: 'Key index for shared key',
          named: 'key_index',
          optional: true,
          type: 'number',
        },
        {
          description: 'Partner hex encoded public key',
          named: 'partner_public_key',
          type: 'public_key',
        },
      ],
      method: 'diffieHellmanComputeSecret',
    },
    {
      arguments: [
        {
          description: 'Channel to disable funding hex-encoded tx id',
          named: 'transaction_id',
          type: 'hash',
        },
        {
          description: 'Channel to disable funding transaction output index',
          named: 'transaction_vout',
          type: 'number',
        },
      ],
      method: 'disableChannel',
    },
    {
      arguments: [
        {
          description: 'Watchtower identity public key',
          named: 'public_key',
          type: 'public_key',
        },
      ],
      method: 'disconnectWatchtower',
    },
    {
      arguments: [
        {
          description: 'Channel to enable funding hex-encoded tx id',
          named: 'transaction_id',
          type: 'hash',
        },
        {
          description: 'Channel to enable funding transaction output index',
          named: 'transaction_vout',
          type: 'number',
        },
        {
          description: 'Force enable of channel and override auto-disable?',
          named: 'is_force_enable',
          type: 'boolean',
        },
      ],
      method: 'enableChannel',
    },
    {
      arguments: [
        {
          description: 'Base PSBT to fund',
          named: 'psbt',
        },
        {
          description: 'Fee rate per vbyte to use for funding',
          named: 'fee_tokens_per_vbyte',
          optional: true,
        },
      ],
      method: 'fundPsbt',
    },
    {
      method: 'getAccessIds',
    },
    {
      method: 'getAutopilot',
    },
    {
      arguments: [
        {
          description: 'Funding transaction id hex string',
          named: 'transaction_id',
          type: 'hash',
        },
        {
          description: 'Funding transaction output index number',
          named: 'transaction_vout',
          type: 'number',
        },
      ],
      method: 'getBackup',
    },
    {
      method: 'getBackups',
    },
    {
      method: 'getChainBalance',
    },
    {
      arguments: [
        {
          description: 'Confirm within n target blocks',
          named: 'confirmation_target',
          optional: true,
          type: 'number',
        },
      ],
      method: 'getChainFeeRate',
    },
    {
      arguments: [
        {
          description: 'Confirmed after block height number',
          named: 'after',
          optional: true,
          type: 'number',
        },
        {
          description: 'Confirmed before block height number',
          named: 'before',
          optional: true,
          type: 'number',
        },
      ],
      method: 'getChainTransactions',
    },
    {
      arguments: [
        {
          description: 'Channel id',
          named: 'id',
          type: 'channel',
        },
      ],
      method: 'getChannel',
    },
    {
      method: 'getChannelBalance',
    },
    {
      arguments: [
        {
          description: 'Only channels with public key hex string',
          named: 'partner_public_key',
          optional: true,
          type: 'public_key',
        },
      ],
      method: 'getChannels',
    },
    {
      method: 'getClosedChannels',
    },
    {
      method: 'getConnectedWatchtowers',
    },
    {
      arguments: [
        {
          description: 'Results limit',
          named: 'limit',
          optional: true,
          type: 'number',
        },
        {
          description: 'Paging token',
          named: 'token',
          optional: true,
        },
      ],
      method: 'getFailedPayments',
    },
    {
      method: 'getFeeRates',
    },
    {
      arguments: [
        {
          description: 'From node hex encoded public key',
          named: 'from',
          type: 'public_key',
        },
        {
          description: 'Millitokens to send',
          named: 'mtokens',
        },
        {
          description: 'To node hex encoded public key',
          named: 'to',
          type: 'public_key',
        },
      ],
      method: 'getForwardingConfidence',
    },
    {
      method: 'getForwardingReputations',
    },
    {
      arguments: [
        {
          description: 'Results limit',
          named: 'limit',
          optional: true,
          type: 'number',
        },
        {
          description: 'Paging token',
          named: 'token',
          optional: true,
        },
      ],
      method: 'getForwards',
    },
    {
      method: 'getHeight',
    },
    {
      method: 'getIdentity',
    },
    {
      arguments: [
        {
          description: 'Invoice hex encoded payment hash',
          named: 'id',
          type: 'hash',
        },
      ],
      method: 'getInvoice',
    },
    {
      arguments: [
        {
          description: 'Results limit',
          named: 'limit',
          optional: true,
          type: 'number',
        },
        {
          description: 'Paging token',
          named: 'token',
          optional: true,
        },
      ],
      method: 'getInvoices',
    },
    {
      method: 'getLockedUtxos',
    },
    {
      method: 'getMasterPublicKeys',
    },
    {
      method: 'getMethods',
    },
    {
      method: 'getNetworkCentrality',
    },
    {
      method: 'getNetworkGraph',
    },
    {
      method: 'getNetworkInfo',
    },
    {
      arguments: [
        {
          description: 'Node hex encoded public key id',
          named: 'public_key',
          type: 'public_key',
        },
      ],
      method: 'getNode',
    },
    {
      method: 'getPathfindingSettings',
    },
    {
      arguments: [
        {
          description: 'Payment hex encoded payment hash',
          named: 'id',
          type: 'hash',
        },
      ],
      method: 'getPayment',
    },
    {
      arguments: [
        {
          description: 'Results limit',
          named: 'limit',
          optional: true,
          type: 'number',
        },
        {
          description: 'Paging token',
          named: 'token',
          optional: true,
        },
      ],
      method: 'getPayments',
    },
    {
      method: 'getPeers',
    },
    {
      method: 'getPendingChainBalance',
    },
    {
      method: 'getPendingChannels',
    },
    {
      arguments: [
        {
          description: 'Results limit',
          named: 'limit',
          optional: true,
          type: 'number',
        },
        {
          description: 'Paging token',
          named: 'token',
          optional: true,
        },
      ],
      method: 'getPendingPayments',
    },
    {
      arguments: [
        {
          description: 'Key family number',
          named: 'family',
          type: 'number',
        },
        {
          description: 'Key index number',
          named: 'index',
          optional: true,
        },
      ],
      method: 'getPublicKey',
    },
    {
      method: 'getSweepTransactions',
    },
    {
      method: 'getTowerServerInfo',
    },
    {
      arguments: [
        {
          description: 'Maximum confirmations for UTXO',
          named: 'max_confirmations',
          optional: true,
          type: 'number',
        },
        {
          description: 'Minimum confirmations for UTXO',
          named: 'min_confirmations',
          optional: true,
          type: 'number',
        },
      ],
      method: 'getUtxos',
    },
    {
      method: 'getWalletInfo',
    },
    {
      method: 'getWalletVersion',
    },
    {
      arguments: [
        {
          description: 'Lock identifier hex encoded nonce',
          named: 'id',
          optional: true,
          type: 'hash',
        },
        {
          description: 'UTXO hex encoded transaction id',
          named: 'transaction_id',
          type: 'hash',
        },
        {
          description: 'UTXO hex encoded transaction output index',
          named: 'transaction_vout',
          type: 'number',
        },
      ],
      method: 'lockUtxo',
    },
    {
      arguments: [
        {
          description: 'Funded PSBT Hex String',
          named: 'psbt',
        },
      ],
      method: 'partiallySignPsbt',
    },
    {
      arguments: [
        {
          description: 'BOLT 11 encoded payment request',
          named: 'request',
        },
        {
          description: 'Final forwarding node public key',
          named: 'incoming_peer',
          optional: true,
          type: 'public_key',
        },
        {
          description: 'Maximum fee millitokens to pay',
          named: 'max_fee_mtokens',
          optional: true,
        },
        {
          description: 'Maximum millitokens to pay in a single path',
          named: 'max_path_mtokens',
          optional: true,
        },
        {
          description: 'Millitokens to pay on a zero invoice',
          named: 'mtokens',
          optional: true,
        },
        {
          description: 'Pay out specific channel',
          named: 'outgoing_channel_id',
          optional: true,
        },
        {
          description: 'Max milliseconds to spend finding a route',
          named: 'pathfinding_timeout',
          optional: true,
        },
      ],
      method: 'pay',
    },
    {
      arguments: [
        {
          description: 'Remove advertised node network address host:port',
          named: 'socket',
        },
      ],
      method: 'removeExternalSocket',
    },
    {
      arguments: [
        {
          description: 'Peer hex encoded public key id',
          named: 'public_key',
          type: 'public_key',
        },
      ],
      method: 'removePeer',
    },
    {
      arguments: [
        {
          description: 'Child fee bumping payment chain fee tokens/vbyte',
          named: 'fee_tokens_per_vbyte',
          optional: true,
          type: 'number',
        },
        {
          description: 'UTXO hex encoded transaction id',
          named: 'transaction_id',
          type: 'hash',
        },
        {
          description: 'UTXO transaction output index number',
          named: 'transaction_vout',
          type: 'number',
        },
      ],
      method: 'requestChainFeeIncrease',
    },
    {
      arguments: [
        {
          description: 'Hex encoded message',
          named: 'message',
        },
        {
          description: 'Node public key to send to',
          named: 'public_key',
          type: 'public_key',
        },
        {
          description: 'Message type',
          named: 'type',
          optional: true,
          type: 'number',
        },
      ],
      method: 'sendMessageToPeer',
    },
    {
      arguments: [
        {
          description: 'Hex encoded secret preimage',
          named: 'secret',
        },
      ],
      method: 'settleHodlInvoice',
    },
    {
      arguments: [
        {
          description: 'Message to sign',
          named: 'message',
        },
      ],
      method: 'signMessage',
    },
    {
      arguments: [
        {
          description: 'Funded PSBT to sign and finalize',
          named: 'psbt',
        },
      ],
      method: 'signPsbt',
    },
    {
      method: 'stopDaemon',
    },
    {
      arguments: [
        {
          description: 'Lock identifier hex encoded nonce',
          named: 'id',
          type: 'hash',
        },
        {
          description: 'UTXO hex encoded transaction id',
          named: 'transaction_id',
          type: 'hash',
        },
        {
          description: 'UTXO hex encoded transaction output index',
          named: 'transaction_vout',
          type: 'number',
        },
      ],
      method: 'unlockUtxo',
    },
    {
      arguments: [
        {
          description: 'Alias to use for node identity',
          named: 'alias',
        },
      ],
      method: 'updateAlias',
    },
    {
      arguments: [
        {
          description: 'Transaction label',
          named: 'description',
        },
        {
          description: 'Transaction hex encoded id',
          named: 'id',
          type: 'hash',
        },
      ],
      method: 'updateChainTransaction',
    },
    {
      arguments: [
        {
          description: 'Color value for node advertisement: ex #000000',
          named: 'color',
        },
      ],
      method: 'updateColor',
    },
    {
      arguments: [
        {
          description: 'Watchtower identity hex-encoded public key',
          named: 'public_key',
          type: 'public_key',
        },
        {
          description: 'Add network socket: host:port',
          named: 'add_socket',
          optional: true,
        },
        {
          description: 'Add network socket: host:port',
          named: 'remove_socket',
          optional: true,
        },
      ],
      method: 'updateConnectedWatchtower',
    },
    {
      arguments: [
        {
          description: 'Assumed success count out of 1 million attempts',
          named: 'baseline_success_rate',
          optional: true,
          type: 'number',
        },
        {
          description: 'Maximum historic payment records to keep',
          named: 'max_payment_records',
          optional: true,
          type: 'number',
        },
        {
          description: 'Node avoidance due to failure rate out of 1 million',
          named: 'node_ignore_rate',
          optional: true,
          type: 'number',
        },
        {
          description: 'Failure penalty half life milliseconds',
          named: 'penalty_half_life_ms',
          optional: true,
          type: 'number',
        },
      ],
      method: 'updatePathfindingSettings',
    },
    {
      arguments: [
        {
          description: 'Base fee millitokens to charge to forward',
          named: 'base_fee_mtokens',
          optional: true,
        },
        {
          description: 'CLTV delta to add to forward or use minimal default',
          named: 'cltv_delta',
          optional: true,
          type: 'number',
        },
        {
          description: 'Proportional fee rate ppm or use a minimal default',
          named: 'fee_rate',
          optional: true,
          type: 'number',
        },
        {
          description: 'Maximum payment forward amount millitokens',
          named: 'max_htlc_mtokens',
          optional: true,
        },
        {
          description: 'Minimum payment forward amount millitokens',
          named: 'min_htlc_mtokens',
          optional: true,
        },
        {
          description: 'Set only on channel with funding transaction id',
          named: 'transaction_id',
          optional: true,
          type: 'hash',
        },
        {
          description: 'Set only on channel with funding transaction vout',
          named: 'transaction_vout',
          optional: true,
          type: 'number',
        },
      ],
      method: 'updateRoutingFees',
    },
    {
      arguments: [
        {
          description: 'Message that was signed',
          named: 'message',
        },
        {
          description: 'Message signature',
          named: 'signature',
        },
      ],
      method: 'verifyMessage',
    },
  ],
};
