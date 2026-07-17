import fs from 'fs';
import path from 'path';
import { SiteConfig } from './config-types';
import { DEFAULT_SITE_CONFIG } from './default-config';

export function getSiteConfig(): SiteConfig {
  const CONFIG_FILE_PATH = path.join(process.cwd(), 'lib', 'config.json');
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const fileData = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      return JSON.parse(fileData);
    }
  } catch (error) {
    console.error('Error reading config file, falling back to default:', error);
  }
  return DEFAULT_SITE_CONFIG;
}
