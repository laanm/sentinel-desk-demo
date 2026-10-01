import { build } from 'esbuild';

await build({
  entryPoints: ['main.tsx'],
  bundle: true,
  minify: true,
  outfile: 'app.js',
  format: 'iife',
  jsx: 'automatic',
  loader: { '.tsx': 'tsx' },
});
