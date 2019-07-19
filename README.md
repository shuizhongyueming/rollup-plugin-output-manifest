# Rollup Manifest Plugin

Rollup plugin for generating an chunk manifest. Inspired by [webpack-manifest-plugin](https://github.com/danethurber/webpack-manifest-plugin)

## Install

```
npm install --save-dev rollup-plugin-output-manifest
```

## Usage

In your `rollup.config.js`

```javascript
import outputManifest from 'rollup-plugin-output-manifest';

export default {
  // ...
  plugins: [
    // ...
    outputManifest(),
  ]
}
```

This will generate a `manifest.json` file in your root output directory with a mapping of all source file names to their corresponding output file, for example:

```json
{
  "index": "index-6492d26f.js"
}
```

## API

```javascript
import outputManifest from 'rollup-plugin-output-manifest';

export default {
  // ...
  plugins: [
    // ...
    outputManifest(options),
  ]
}
```

### `options.fileName`

Type: `String`

Default: `manifest.json`

The manifest filename in your output directory.

### `options.publicPath`

Type: `String`

Default: `outputOptions.dir || path.dirname(outputOptions.file)`

A path prefix that will be added to values of the manifest.

### `options.basePath`

Type: `String`

A path prefix for all keys. Useful for including your output path in the manifest.

### `options.filter`

Type: `(bundle: OutputChunk) => boolean`

Filter out chunks. [OutputChunk typings][1]


### `options.map`

Type: `(bundle: OutputChunk) => OutputChunk`

Modify chunk details before the manifest is created. [OutputChunk typings][1]

### `options.sort`

Type: `(bundleA: OutputChunk, bundleB: OutputChunk) => number`

Sort chunk before they are passed to `generate`. [OutputChunk typings][1]

### `options.generate`

Type: `(bundles: OutputChunk[]) => object`

Default: `(chunks) => chunks.reduce((manifest, {name, fileName}) => ({...manifest, [name]: fileName}), {})`

Create the manifest. It can return anything as long as it's serialisable by `JSON.stringify`. [OutputChunk typings][1]

### `options.serialize`

Type: `(manifest: object) => string`

Default: `(manifest) => JSON.stringify(manifest, null, 2)`

Output manifest file in different format then json (i.e. yaml).

## License

MIT

[1]: https://github.com/rollup/rollup/blob/e66d7be5e736e7b47c6e8ac5cb7c6365903baeff/src/rollup/types.d.ts#L497

