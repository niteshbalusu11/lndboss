import { spawnLightningDocker } from 'ln-docker-daemons';
const address = 'bcrt1qkznf8grqj8ed9xrt8mtxmj5da63cwyk3tl0wh3';
const ports = {
  chain_p2p_port: 2345,
  chain_rpc_port: 3456,
  chain_zmq_block_port: 3345,
  chain_zmq_tx_port: 4445,
  lightning_p2p_port: 5445,
  lightning_rpc_port: 6445,
};

export type SpawnLightningType = {
  cert: string;
  kill: ({}) => Promise<void>;
  macaroon: string;
  socket: string;
};

const spawnLightning = async (): Promise<SpawnLightningType> => {
  const { cert, kill, macaroon, socket }: SpawnLightningType = await spawnLightningDocker({
    chain_p2p_port: ports.chain_p2p_port,
    chain_rpc_port: ports.chain_rpc_port,
    chain_zmq_block_port: ports.chain_zmq_block_port,
    chain_zmq_tx_port: ports.chain_zmq_tx_port,
    generate_address: address,
    lightning_p2p_port: ports.lightning_p2p_port,
    lightning_rpc_port: ports.lightning_rpc_port,
  });

  return { cert, kill, macaroon, socket };
};

export default spawnLightning;
