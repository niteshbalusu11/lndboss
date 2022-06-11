import { SpawnLightningType } from './spawn_lightning';
import { putSavedCredentials } from '../../src/server/lnd';
import spawnLightning from './spawn_lightning.js';

let lightning: SpawnLightningType;

const startGlobalContainer = async () => {
  lightning = await spawnLightning();
  const node = 'testnode1';

  const { error } = await putSavedCredentials({
    cert: lightning.cert,
    macaroon: lightning.macaroon,
    socket: lightning.socket,
    node,
    is_default: false,
  });

  if (!!error) {
    throw new Error(error);
  }

  return lightning;
};

const returnGlobalLightning = async () => {
  return lightning;
};

const killGlobalContainer = async () => {
  await lightning.kill({});
};

export { killGlobalContainer, returnGlobalLightning, startGlobalContainer };
