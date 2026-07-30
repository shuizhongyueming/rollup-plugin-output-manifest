const pluginName = "rollup-plugin-output-manifest-prototype";

function isChunk(bundle) {
  return bundle.type === "chunk";
}

function isAsset(bundle) {
  return bundle.type === "asset";
}

const defaultFilter = (bundle) =>
  isAsset(bundle) || (isChunk(bundle) && bundle.isEntry);
const defaultMap = (bundle) => bundle;
const defaultSort = (left, right) =>
  left.fileName > right.fileName ? 1 : -1;
const defaultKeyValueDecorator = (key, value) => ({ [key]: value });
const defaultGenerate = (decorate, seed) => (bundles) =>
  bundles.reduce(
    (manifest, bundle) =>
      bundle.name
        ? { ...manifest, ...decorate(bundle.name, bundle.fileName) }
        : manifest,
    seed,
  );
const defaultSerialize = (manifest) => JSON.stringify(manifest, null, 2);

function outputManifest(options = {}) {
  return { name: pluginName, options };
}

Object.assign(outputManifest, {
  default: outputManifest,
  isChunk,
  isAsset,
  defaultFilter,
  defaultMap,
  defaultSort,
  defaultKeyValueDecorator,
  defaultGenerate,
  defaultSerialize,
});

export {
  defaultFilter,
  defaultGenerate,
  defaultKeyValueDecorator,
  defaultMap,
  defaultSerialize,
  defaultSort,
  isAsset,
  isChunk,
};
export default outputManifest;
