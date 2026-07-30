import outputManifest, {
  isChunk,
  type Bundle,
  type OutputManifestParam,
} from "rollup-plugin-output-manifest";
import deepOutputManifest from "rollup-plugin-output-manifest/src";
import type { Plugin } from "rollup";

const options: OutputManifestParam = { fileName: "manifest.json" };
const plugin: Plugin = outputManifest(options);
const deepPlugin: Plugin = deepOutputManifest(options);
const narrowsChunk = (bundle: Bundle): boolean =>
  isChunk(bundle) ? bundle.isEntry : false;

void [plugin, deepPlugin, narrowsChunk];
