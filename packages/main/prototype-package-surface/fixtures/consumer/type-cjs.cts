import outputManifest = require("rollup-plugin-output-manifest");
import deepOutputManifest = require("rollup-plugin-output-manifest/src");
import type { Plugin } from "rollup";

const options: outputManifest.OutputManifestParam = {
  fileName: "manifest.json",
};
const plugin: Plugin = outputManifest(options);
const legacyPlugin: Plugin = outputManifest.default(options);
const deepPlugin: Plugin = deepOutputManifest(options);
const serialized: string = outputManifest.defaultSerialize({});

void [plugin, legacyPlugin, deepPlugin, serialized];
