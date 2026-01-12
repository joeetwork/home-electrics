import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 3001,
  authToken: process.env.AUTH_TOKEN,
  givEnergyBaseUrl: 'https://api.givenergy.cloud/v1'
};
