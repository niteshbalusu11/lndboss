import { startGlobalContainer } from './global_spawn_lightning';

async function globalSetup() {
  await startGlobalContainer();
  console.log('======================Started Global Container======================');
}

export default globalSetup;
