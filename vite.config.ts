import { defineConfig } from 'vite';

// Base path für GitHub Pages (wird automatisch von GitHub Actions gesetzt)
const base = process.env.GITHUB_PAGES === 'true' ? '/TheReturnOfTheBattleship/' : '/';

export default defineConfig({
  base,
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});

