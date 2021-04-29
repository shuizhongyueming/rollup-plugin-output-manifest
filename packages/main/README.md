# Rollup Manifest Plugin

Rollup plugin for generating an chunk manifest. Inspired by [webpack-manifest-plugin](https://github.com/danethurber/webpack-manifest-plugin)

## Install

```shell
npm install --save-dev rollup-plugin-output-manifest
```

## Usage

In your `rollup.config.js`

```javascript
import outputManifest from 'rollup-plugin-output-manifest';
// or const outputManifest = require('rollup-plugin-output-manifest').default;

export default {
  // ...
  plugins: [
    // ...
    outputManifest(),
  ],
};
```

This will generate a `manifest.json` file in your root output directory with a mapping of all source file names to their corresponding output file, for example:

```json
{
  "index": "index-6492d26f.js"
}
```

More examples you can look at the `index.spec.ts`

## API

```javascript
import outputManifest from 'rollup-plugin-output-manifest';

export default {
  // ...
  plugins: [
    // ...
    outputManifest(options),
  ],
};
```

The type `Bundle` is an union of [OutputChunk][1] and [OutputAsset][2]

```typescript
type Bundle = OutputChunk | OutputAsset;
```

### `options.fileName`

Type: `String`

Default: `manifest.json`

The manifest filename in your output directory.

### `options.nameSuffix`

Type: `String`

Default: `''`

The suffix for all keys in the manifest json object.

### `options.nameWithExt`

Type: `Boolean`

Default: `true`,

Set an ext for key which is same as the value in manifest json object. We add this option for support of assets which has different ext than the entry.

### `options.isMerge`

Type: `Boolean`

Default: `false`

Merge the existing key/value pair in the target manifest file or just override it.

### `options.publicPath`

Type: `String`

Default: `outputOptions.dir || path.dirname(outputOptions.file)`

A path prefix that will be added to values of the manifest.

### `options.publicSuffix`

Type: `String`

A suffix that will be added to values of the manifest. Useful for adding a query string, for example.

### `options.basePath`

Type: `String`

A path prefix for all keys. Useful for including your output path in the manifest.

### `options.filter`

Type: `(bundle: Bundle) => boolean`

Filter out chunks.

### `options.map`

Type: `(bundle: Bundle) => Bundle`

Modify chunk details before the manifest is created.

### `options.sort`

Type: `(bundleA: Bundle, bundleB: Bundle) => number`

Sort chunk before they are passed to `generate`.

### `options.keyValueDecorator`

Type: `(k: string, v: string, opt: OutputManifestParam) => {[k: string]: string}`

You can set your own rule to set key/value.

### `options.generate`

Type: `(keyValueDecorator: KeyValueDecorator, seed: object, opt: OutputManifestParam) => (chunks: Bundle[]) => object`

Default:

```typescript
(keyValueDecorator: KeyValueDecorator, seed: object, opt: OutputManifestParam) => (chunks) =>
  chunks.reduce((manifest, { name, fileName }) => {
    if (name) {
      return {
        ...manifest,
        ...keyValueDecorator(name, fileName, opt),
      };
    }
    return manifest;
  }, seed);
```

Create the manifest. It can return anything as long as it's serialisable by `JSON.stringify`.

By default, Bundle without an `name` attribute will be omitted;

### `options.serialize`

Type: `(manifest: object) => string`

Default: `(manifest) => JSON.stringify(manifest, null, 2)`

Output manifest file in different format then json (e.g. yaml).

## Contribution

```shell
$ git clone https://github.com/shuizhongyueming/rollup-plugin-output-manifest.git
$ cd packages/main
$ yarn install
$ yarn build # for build
$ yarn test # for test
```

## License

MIT

[1]: https://github.com/rollup/rollup/blob/e66d7be5e736e7b47c6e8ac5cb7c6365903baeff/src/rollup/types.d.ts#L497
[2]: https://github.com/rollup/rollup/blob/e66d7be5e736e7b47c6e8ac5cb7c6365903baeff/src/rollup/types.d.ts#L469
