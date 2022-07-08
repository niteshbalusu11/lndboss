import dotenv from 'dotenv';
import { join } from 'path';
import { startGlobalContainer } from './global_spawn_lightning';

// Read from default ".env" file.
dotenv.config();

// Alternatively, read from "../my.env" file.
dotenv.config({ path: join(__dirname, '../../.env') });

async function globalSetup() {
  await startGlobalContainer();
  console.log('======================Started Global Container======================');
}

export default globalSetup;
