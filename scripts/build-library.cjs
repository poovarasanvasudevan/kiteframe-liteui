const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const outdir = path.join(root, 'dist');
const external = ['react', 'react-dom', 'lucide-react'];

async function build() {
  if (path.dirname(outdir) !== root || path.basename(outdir) !== 'dist') {
    throw new Error('Unexpected output directory');
  }
  fs.rmSync(outdir, { recursive: true, force: true });

  const options = {
    absWorkingDir: root,
    entryPoints: { index: 'src/lib/index.ts' },
    outdir,
    bundle: true,
    platform: 'browser',
    target: 'es2020',
    jsx: 'automatic',
    external,
    logLevel: 'info',
  };

  await esbuild.build({ ...options, outExtension: { '.js': '.mjs' }, format: 'esm' });
  await esbuild.build({
    ...options,
    outExtension: { '.js': '.cjs' },
    format: 'cjs',
    plugins: [{
      name: 'external-styles',
      setup(builder) {
        builder.onLoad({ filter: /\.css$/ }, () => ({ contents: '', loader: 'js' }));
      },
    }],
  });

  execFileSync(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', 'tsconfig.lib.json'], {
    cwd: root,
    stdio: 'inherit',
  });
}

build().catch(error => { console.error(error); process.exitCode = 1; });
