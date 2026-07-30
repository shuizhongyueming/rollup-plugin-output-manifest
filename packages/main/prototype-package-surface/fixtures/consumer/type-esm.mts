import outputManifest, {
  defaultSerialize,
  isChunk,
  type Bundle,
  type OutputManifestParam,
} from "rollup-plugin-output-manifest";
import deepOutputManifest from "rollup-plugin-output-manifest/src";
import type { Plugin } from "rollup";

const options: OutputManifestParam = { fileName: "manifest.json" };
const plugin: Plugin = outputManifest(options);
const legacyPlugin: Plugin = outputManifest.default(options);
const deepPlugin: Plugin = deepOutputManifest(options);
const serialized: string = defaultSerialize({});
const narrowsChunk = (bundle: Bundle): boolean =>
  isChunk(bundle) ? bundle.isEntry : false;

void [plugin, legacyPlugin, deepPlugin, serialized, narrowsChunk];
