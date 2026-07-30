import outputManifest, {
  isAsset,
  type Bundle,
  type OutputManifestParam,
} from "rollup-plugin-output-manifest";
import type { Plugin } from "rollup";

const options: OutputManifestParam = { fileName: "manifest.json" };
const plugin: Plugin = outputManifest(options);
const narrowsAsset = (bundle: Bundle): boolean =>
  isAsset(bundle) ? bundle.fileName.length > 0 : false;

void [plugin, narrowsAsset];
