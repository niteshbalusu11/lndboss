import { killGlobalContainer } from './global_spawn_lightning';

async function globalTeardown() {
  await killGlobalContainer();
  console.log('======================Stopped Global Container======================');
}

export default globalTeardown;
