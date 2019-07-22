import { rollup, InputOptions, OutputOptions } from "rollup";
import outputManifest, { defaultSort, defaultGenerate } from "./index";
import assert from "assert";
import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { readJSON } from "./utils";
import YAML from "json-to-pretty-yaml";

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
    describe("default options", function() {
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
    describe("custom options", function() {
      it("can change manifest file name", async function() {
        await run(
          {
            input: {
              pageA: "./examples/page-a.js",
              pageB: "./examples/page-b.js",
              pageC: "./examples/page-c.js"
            },
            plugins: [outputManifest({ fileName: "assets.json" })]
          },
          {
            dir: "./examples/dist/",
            entryFileNames: "[name]-[hash].js",
            format: "commonjs"
          }
        );
        assert(fs.existsSync(path.resolve(distPath, "assets.json")));
      });

      it("can change key's suffix", async function() {
        await run(
          {
            input: {
              pageA: "./examples/page-a.js",
              pageB: "./examples/page-b.js",
              pageC: "./examples/page-c.js"
            },
            plugins: [outputManifest({ nameSuffix: "" })]
          },
          {
            dir: "./examples/dist/",
            entryFileNames: "[name]-[hash].js",
            format: "commonjs"
          }
        );
        const json = await readJSON(distManifest);
        assert(typeof (json as any)["pageA"] !== "undefined");
        assert(typeof (json as any)["pageB"] !== "undefined");
        assert(typeof (json as any)["pageC"] !== "undefined");
      });

      it("can add publicPath for chunk", async function() {
        const publicPath = "https://www.test.com/some/path/";
        await run(
          {
            input: {
              pageA: "./examples/page-a.js",
              pageB: "./examples/page-b.js",
              pageC: "./examples/page-c.js"
            },
            plugins: [outputManifest({ publicPath })]
          },
          {
            dir: "./examples/dist/",
            entryFileNames: "[name]-[hash].js",
            format: "commonjs"
          }
        );
        const json = await readJSON(distManifest);
        const res = Object.values(json).every(p => p.indexOf(publicPath) === 0);
        assert(res);
      });

      it("can add basePath for name key", async function() {
        const basePath = "site/";
        await run(
          {
            input: {
              pageA: "./examples/page-a.js",
              pageB: "./examples/page-b.js",
              pageC: "./examples/page-c.js"
            },
            plugins: [outputManifest({ basePath })]
          },
          {
            dir: "./examples/dist/",
            entryFileNames: "[name]-[hash].js",
            format: "commonjs"
          }
        );
        const json = await readJSON(distManifest);
        const res = Object.keys(json).every(k => k.indexOf(basePath) === 0);
        assert(res);
      });

      it("can merge key/value pair exits in the manifest.json", async function() {
        const existsKey = "index.css";
        const existsValue = "index-sdf8asdf.css";
        if (!fs.existsSync(distPath)) {
          fs.mkdirSync(distPath, { recursive: true });
        }
        await fs.promises.writeFile(
          distManifest,
          JSON.stringify({ [existsKey]: existsValue })
        );
        await run(
          {
            input: {
              pageA: "./examples/page-a.js",
              pageB: "./examples/page-b.js",
              pageC: "./examples/page-c.js"
            },
            plugins: [outputManifest({ isMerge: true })]
          },
          {
            dir: "./examples/dist/",
            entryFileNames: "[name]-[hash].js",
            format: "commonjs"
          }
        );
        const json = await readJSON(distManifest);
        assert((json as any)[existsKey] === existsValue);
      });

      it("can change the output path of the mainfest", async function() {
        const outputPath = path.resolve(distPath, "../");
        await run(
          {
            input: {
              pageA: "./examples/page-a.js",
              pageB: "./examples/page-b.js",
              pageC: "./examples/page-c.js"
            },
            plugins: [outputManifest({ outputPath })]
          },
          {
            dir: "./examples/dist/",
            entryFileNames: "[name]-[hash].js",
            format: "commonjs"
          }
        );

        const manifestPath = path.resolve(outputPath, "manifest.json");
        assert(fs.existsSync(manifestPath));
        await fs.promises.unlink(manifestPath);
      });

      it("can use filter to remove some entry from manifest", async function() {
        await run(
          {
            input: {
              pageA: "./examples/page-a.js",
              pageB: "./examples/page-b.js",
              pageC: "./examples/page-c.js"
            },
            plugins: [
              outputManifest({
                filter: chunk => chunk.isEntry && chunk.name !== "pageA"
              })
            ]
          },
          {
            dir: "./examples/dist/",
            entryFileNames: "[name]-[hash].js",
            format: "commonjs"
          }
        );

        const json = await readJSON(distManifest);
        assert(typeof (json as any)["pageA.js"] === "undefined");
        assert(typeof (json as any)["pageB.js"] !== "undefined");
        assert(typeof (json as any)["pageC.js"] !== "undefined");
      });

      it("can use map to change the key name", async function() {
        await run(
          {
            input: {
              pageA: "./examples/page-a.js",
              pageB: "./examples/page-b.js",
              pageC: "./examples/page-c.js"
            },
            plugins: [
              outputManifest({
                map: chunk => ({ ...chunk, name: chunk.name.toUpperCase() })
              })
            ]
          },
          {
            dir: "./examples/dist/",
            entryFileNames: "[name]-[hash].js",
            format: "commonjs"
          }
        );

        const json = await readJSON(distManifest);
        assert(typeof (json as any)["PAGEA.js"] !== "undefined");
        assert(typeof (json as any)["PAGEB.js"] !== "undefined");
        assert(typeof (json as any)["PAGEC.js"] !== "undefined");
      });

      it("can use sort to change the order of key", async function() {
        await run(
          {
            input: {
              pageA: "./examples/page-a.js",
              pageB: "./examples/page-b.js",
              pageC: "./examples/page-c.js"
            },
            plugins: [
              outputManifest({
                sort: (chunkA, chunkB) => {
                  if (chunkA.name === "pageC") {
                    return -1;
                  }
                  return defaultSort(chunkA, chunkB);
                }
              })
            ]
          },
          {
            dir: "./examples/dist/",
            entryFileNames: "[name]-[hash].js",
            format: "commonjs"
          }
        );

        const fileContent = await fs.promises.readFile(distManifest, {
          encoding: "utf-8"
        });
        const fileLines = fileContent.split(/\r?\n/);
        const secondLine = fileLines[1].trim();
        assert(secondLine.indexOf("pageC.js") === 1);
      });
      it("can use generate to add some extra key/value pair", async function() {
        const existsKey = "index.css";
        const existsValue = "index-sdf8asdf.css";
        await run(
          {
            input: {
              pageA: "./examples/page-a.js",
              pageB: "./examples/page-b.js",
              pageC: "./examples/page-c.js"
            },
            plugins: [
              outputManifest({
                generate: (keyValueDecorator, seed) =>
                  defaultGenerate(keyValueDecorator, {
                    ...seed,
                    [existsKey]: existsValue
                  })
              })
            ]
          },
          {
            dir: "./examples/dist/",
            entryFileNames: "[name]-[hash].js",
            format: "commonjs"
          }
        );

        const json = await readJSON(distManifest);
        assert((json as any)[existsKey] === existsValue);
      });
      it("can use serialize to output yaml content", async function() {
        await run(
          {
            input: {
              pageA: "./examples/page-a.js",
              pageB: "./examples/page-b.js",
              pageC: "./examples/page-c.js"
            },
            plugins: [
              outputManifest({
                fileName: "manifest.yaml",
                serialize: manifest => YAML.stringify(manifest)
              })
            ]
          },
          {
            dir: "./examples/dist/",
            entryFileNames: "[name]-[hash].js",
            format: "commonjs"
          }
        );

        const manifestPath = path.resolve(distPath, "manifest.yaml");
        assert(fs.existsSync(manifestPath));
        const fileContent = await fs.promises.readFile(manifestPath, {
          encoding: "utf-8"
        });
        const fileLines = fileContent.split(/\r?\n/);
        assert(fileLines[0].indexOf("pageA.js") === 0);
        assert(fileLines[1].indexOf("pageB.js") === 0);
        assert(fileLines[2].indexOf("pageC.js") === 0);
      });
    });
  });
});
