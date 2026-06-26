import { config } from 'dotenv';
import { envFilePaths } from './env-file-paths';

let loaded = false;

export function loadEnvFiles(): void {
  if (loaded) {
    return;
  }

  for (const path of envFilePaths) {
    config({ path, override: false, quiet: true });
  }

  loaded = true;
}
