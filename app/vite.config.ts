import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import path from 'path';
import fs from 'fs';

const terraformResourcesPath = path.join(process.cwd(), '../deployment/resources/terraform.resources.json');
const terraformResources = JSON.parse(fs.readFileSync(terraformResourcesPath, 'utf8'));

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    resolve: {
      alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
    },
    // define env variables here
    define: {
      'process.env': {
        TERRAFORM_ENV: terraformResources,
      },
    },
  };
});
