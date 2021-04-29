import outputManifest from 'rollup-plugin-output-manifest'
import postcss from 'rollup-plugin-postcss'

export default {
  input: {
    pageA: './page-a.js',
    pageB: './page-b.js',
    pageC: './page-c.js',
  },
  plugins: [postcss({extract: true}),outputManifest()],
  output: {
    entryFileNames: '[name]-[hash].js',
    assetFileNames: '[name]-[hash].[extname]',
    dir: './dist/',
    format: 'esm',
  },
};
