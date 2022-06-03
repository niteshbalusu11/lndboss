import spawnLightning from './spawn_lightning.js';
import * as lnd from '../../main/lnd';
import { SpawnLightningType } from './spawn_lightning';
let lightning: SpawnLightningType;

const startGlobalContainer = async () => {
  try {
    lightning = await spawnLightning();
    const node = 'testnode1';

    const { error } = await lnd.putSavedCredentials({
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
  } catch (error) {
    throw error;
  }
};

const returnGlobalLightning = async () => {
  return lightning;
};

const killGlobalContainer = async () => {
  try {
    await lightning.kill({});
  } catch (error) {
    throw error;
  }
};

export { killGlobalContainer, returnGlobalLightning, startGlobalContainer };
