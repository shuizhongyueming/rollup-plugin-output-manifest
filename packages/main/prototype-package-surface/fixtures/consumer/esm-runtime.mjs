import assert from "node:assert/strict";
import outputManifest, {
  defaultSerialize,
  isChunk,
} from "rollup-plugin-output-manifest";
import deepOutputManifest from "rollup-plugin-output-manifest/src";

assert.equal(typeof outputManifest, "function");
assert.equal(outputManifest.default, outputManifest);
assert.equal(typeof isChunk, "function");
assert.equal(typeof defaultSerialize, "function");
assert.equal(deepOutputManifest, outputManifest);
assert.equal(deepOutputManifest.default, deepOutputManifest);
assert.equal(outputManifest({ fileName: "manifest.json" }).name, "rollup-plugin-output-manifest-prototype");

const packageNamespace = await import("rollup-plugin-output-manifest");
assert.equal(packageNamespace.default.default, outputManifest);
