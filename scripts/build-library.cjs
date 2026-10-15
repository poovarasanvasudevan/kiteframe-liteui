const esbuild = require('esbuild');

const entries = {
  index: 'src/widgets/index.js',
  pages: 'src/pages/index.js',
};
const external = ['react', 'react-dom', 'lucide-react'];

async function build() {
  await esbuild.build({ entryPoints: entries, outdir: 'dist', outExtension: { '.js': '.mjs' }, bundle: true, format: 'esm', platform: 'browser', target: 'es2020', jsx: 'automatic', external, logLevel: 'info' });
  await esbuild.build({ entryPoints: entries, outdir: 'dist', outExtension: { '.js': '.cjs' }, bundle: true, format: 'cjs', platform: 'browser', target: 'es2020', jsx: 'automatic', external, plugins: [{ name: 'external-styles', setup(builder) { builder.onLoad({ filter: /\.css$/ }, () => ({ contents: '', loader: 'js' })); } }], logLevel: 'info' });
}

build().catch(error => { console.error(error); process.exitCode = 1; });
