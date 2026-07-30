"use strict";

const assert = require("node:assert/strict");
const outputManifest = require("rollup-plugin-output-manifest");
const deepOutputManifest = require("rollup-plugin-output-manifest/src");

assert.equal(typeof outputManifest, "function");
assert.equal(outputManifest.default, outputManifest);
assert.equal(typeof outputManifest.isAsset, "function");
assert.equal(typeof outputManifest.defaultSerialize, "function");
assert.equal(deepOutputManifest, outputManifest);
assert.equal(deepOutputManifest.default, deepOutputManifest);
assert.equal(outputManifest({ fileName: "manifest.json" }).name, "rollup-plugin-output-manifest-prototype");
