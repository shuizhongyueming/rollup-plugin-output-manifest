const outputManifest = require('rollup-plugin-output-manifest').default;

module.exports = {
  input: {
    pageA: './page-a.js',
    pageB: './page-b.js',
    pageC: './page-c.js',
  },
  plugins: [outputManifest()],
  output: {
    dir: './dist/',
    entryFileNames: '[name]-[hash].js',
    format: 'commonjs',
  },
};
