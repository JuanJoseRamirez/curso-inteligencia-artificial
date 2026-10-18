import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Local development uses /. GitHub Actions derives the project URL from its repository.
const [owner, repository] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
export default defineConfig({
  site: process.env.SITE_URL || (owner ? `https://${owner.toLowerCase()}.github.io` : 'http://localhost:4322'),
  base: process.env.BASE_PATH || (repository ? `/${repository}` : '/'),
  integrations: [react()],
  output: 'static',
});
