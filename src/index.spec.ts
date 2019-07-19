import { rollup, InputOptions, OutputOptions } from "rollup";
import outputManifest from "./index";
import assert from "assert";
import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { readJSON } from "./utils";

const distPath = path.resolve(__dirname, "../examples/dist/");
const distEntryA = path.resolve(distPath, "pageA.js");
const distEntryB = path.resolve(distPath, "pageB.js");
const distEntryC = path.resolve(distPath, "pageC.js");
const distManifest = path.resolve(distPath, "manifest.json");
// const { promises: fsPromise } = fs;

async function run(inputOptions: InputOptions, outputOptions: OutputOptions) {
  const bundle = await rollup(inputOptions);
  await bundle.generate(outputOptions);
  await bundle.write(outputOptions);
}

describe("outputManifest", function() {
  beforeEach(function() {
    rimraf.sync(distPath);
  });

  describe("rollup works", function() {
    it("single entry", async function() {
      await run(
        { input: "./examples/page-a.js" },
        { file: "./examples/dist/pageA.js", format: "iife" }
      );

      assert(fs.existsSync(distEntryA));
    });

    it("multi entry", async function() {
      await run(
        {
          input: {
            pageA: "./examples/page-a.js",
            pageB: "./examples/page-b.js",
            pageC: "./examples/page-c.js"
          }
        },
        { dir: "./examples/dist/", format: "commonjs" }
      );

      assert(fs.existsSync(distEntryA));
      assert(fs.existsSync(distEntryB));
      assert(fs.existsSync(distEntryC));
    });
  });

  describe("output manifest.json", function() {
    describe("default options", async function() {
      it("should generate manifest.json", async function() {
        await run(
          {
            input: {
              pageA: "./examples/page-a.js",
              pageB: "./examples/page-b.js",
              pageC: "./examples/page-c.js"
            },
            plugins: [outputManifest()]
          },
          {
            dir: "./examples/dist/",
            entryFileNames: "[name]-[hash].js",
            format: "commonjs"
          }
        );
        assert(fs.existsSync(distManifest));
      });
      it("manifest.json should contain all entry name as key", async function() {
        await run(
          {
            input: {
              pageA: "./examples/page-a.js",
              pageB: "./examples/page-b.js",
              pageC: "./examples/page-c.js"
            },
            plugins: [outputManifest()]
          },
          {
            dir: "./examples/dist/",
            entryFileNames: "[name]-[hash].js",
            format: "commonjs"
          }
        );
        const json = await readJSON(distManifest);
        assert(typeof (json as any)["pageA.js"] !== "undefined");
        assert(typeof (json as any)["pageB.js"] !== "undefined");
        assert(typeof (json as any)["pageC.js"] !== "undefined");
      });
    });
  });
});
