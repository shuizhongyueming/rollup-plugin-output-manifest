"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rollup_1 = require("rollup");
const index_1 = tslib_1.__importStar(require("./index"));
const assert_1 = tslib_1.__importDefault(require("assert"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const rimraf_1 = tslib_1.__importDefault(require("rimraf"));
const utils_1 = require("./utils");
const json_to_pretty_yaml_1 = tslib_1.__importDefault(require("json-to-pretty-yaml"));
const distPath = path_1.default.resolve(__dirname, "../examples/dist/");
const distEntryA = path_1.default.resolve(distPath, "pageA.js");
const distEntryB = path_1.default.resolve(distPath, "pageB.js");
const distEntryC = path_1.default.resolve(distPath, "pageC.js");
const distManifest = path_1.default.resolve(distPath, "manifest.json");
// const { promises: fsPromise } = fs;
async function run(inputOptions, outputOptions) {
    const bundle = await rollup_1.rollup(inputOptions);
    await bundle.generate(outputOptions);
    await bundle.write(outputOptions);
}
describe("outputManifest", function () {
    beforeEach(function () {
        rimraf_1.default.sync(distPath);
    });
    describe("rollup works", function () {
        it("single entry", async function () {
            await run({ input: "./examples/page-a.js" }, { file: "./examples/dist/pageA.js", format: "iife" });
            assert_1.default(fs_1.default.existsSync(distEntryA));
        });
        it("multi entry", async function () {
            await run({
                input: {
                    pageA: "./examples/page-a.js",
                    pageB: "./examples/page-b.js",
                    pageC: "./examples/page-c.js"
                }
            }, { dir: "./examples/dist/", format: "commonjs" });
            assert_1.default(fs_1.default.existsSync(distEntryA));
            assert_1.default(fs_1.default.existsSync(distEntryB));
            assert_1.default(fs_1.default.existsSync(distEntryC));
        });
    });
    describe("output manifest.json", function () {
        describe("default options", function () {
            it("should generate manifest.json", async function () {
                await run({
                    input: {
                        pageA: "./examples/page-a.js",
                        pageB: "./examples/page-b.js",
                        pageC: "./examples/page-c.js"
                    },
                    plugins: [index_1.default()]
                }, {
                    dir: "./examples/dist/",
                    entryFileNames: "[name]-[hash].js",
                    format: "commonjs"
                });
                assert_1.default(fs_1.default.existsSync(distManifest));
            });
            it("manifest.json should contain all entry name as key", async function () {
                await run({
                    input: {
                        pageA: "./examples/page-a.js",
                        pageB: "./examples/page-b.js",
                        pageC: "./examples/page-c.js"
                    },
                    plugins: [index_1.default()]
                }, {
                    dir: "./examples/dist/",
                    entryFileNames: "[name]-[hash].js",
                    format: "commonjs"
                });
                const json = await utils_1.readJSON(distManifest);
                assert_1.default(typeof json["pageA.js"] !== "undefined");
                assert_1.default(typeof json["pageB.js"] !== "undefined");
                assert_1.default(typeof json["pageC.js"] !== "undefined");
            });
        });
        describe("custom options", function () {
            it("can change manifest file name", async function () {
                await run({
                    input: {
                        pageA: "./examples/page-a.js",
                        pageB: "./examples/page-b.js",
                        pageC: "./examples/page-c.js"
                    },
                    plugins: [index_1.default({ fileName: "assets.json" })]
                }, {
                    dir: "./examples/dist/",
                    entryFileNames: "[name]-[hash].js",
                    format: "commonjs"
                });
                assert_1.default(fs_1.default.existsSync(path_1.default.resolve(distPath, "assets.json")));
            });
            it("can change key's suffix", async function () {
                await run({
                    input: {
                        pageA: "./examples/page-a.js",
                        pageB: "./examples/page-b.js",
                        pageC: "./examples/page-c.js"
                    },
                    plugins: [index_1.default({ nameSuffix: "" })]
                }, {
                    dir: "./examples/dist/",
                    entryFileNames: "[name]-[hash].js",
                    format: "commonjs"
                });
                const json = await utils_1.readJSON(distManifest);
                assert_1.default(typeof json["pageA"] !== "undefined");
                assert_1.default(typeof json["pageB"] !== "undefined");
                assert_1.default(typeof json["pageC"] !== "undefined");
            });
            it("can add publicPath for chunk", async function () {
                const publicPath = "https://www.test.com/some/path/";
                await run({
                    input: {
                        pageA: "./examples/page-a.js",
                        pageB: "./examples/page-b.js",
                        pageC: "./examples/page-c.js"
                    },
                    plugins: [index_1.default({ publicPath })]
                }, {
                    dir: "./examples/dist/",
                    entryFileNames: "[name]-[hash].js",
                    format: "commonjs"
                });
                const json = await utils_1.readJSON(distManifest);
                const res = Object.values(json).every(p => p.indexOf(publicPath) === 0);
                assert_1.default(res);
            });
            it("can add basePath for name key", async function () {
                const basePath = "site/";
                await run({
                    input: {
                        pageA: "./examples/page-a.js",
                        pageB: "./examples/page-b.js",
                        pageC: "./examples/page-c.js"
                    },
                    plugins: [index_1.default({ basePath })]
                }, {
                    dir: "./examples/dist/",
                    entryFileNames: "[name]-[hash].js",
                    format: "commonjs"
                });
                const json = await utils_1.readJSON(distManifest);
                const res = Object.keys(json).every(k => k.indexOf(basePath) === 0);
                assert_1.default(res);
            });
            it("can merge key/value pair exits in the manifest.json", async function () {
                const existsKey = "index.css";
                const existsValue = "index-sdf8asdf.css";
                if (!fs_1.default.existsSync(distPath)) {
                    fs_1.default.mkdirSync(distPath, { recursive: true });
                }
                await fs_1.default.promises.writeFile(distManifest, JSON.stringify({ [existsKey]: existsValue }));
                await run({
                    input: {
                        pageA: "./examples/page-a.js",
                        pageB: "./examples/page-b.js",
                        pageC: "./examples/page-c.js"
                    },
                    plugins: [index_1.default({ isMerge: true })]
                }, {
                    dir: "./examples/dist/",
                    entryFileNames: "[name]-[hash].js",
                    format: "commonjs"
                });
                const json = await utils_1.readJSON(distManifest);
                assert_1.default(json[existsKey] === existsValue);
            });
            it("can change the output path of the mainfest", async function () {
                const outputPath = path_1.default.resolve(distPath, "../");
                await run({
                    input: {
                        pageA: "./examples/page-a.js",
                        pageB: "./examples/page-b.js",
                        pageC: "./examples/page-c.js"
                    },
                    plugins: [index_1.default({ outputPath })]
                }, {
                    dir: "./examples/dist/",
                    entryFileNames: "[name]-[hash].js",
                    format: "commonjs"
                });
                const manifestPath = path_1.default.resolve(outputPath, "manifest.json");
                assert_1.default(fs_1.default.existsSync(manifestPath));
                await fs_1.default.promises.unlink(manifestPath);
            });
            it("can use filter to remove some entry from manifest", async function () {
                await run({
                    input: {
                        pageA: "./examples/page-a.js",
                        pageB: "./examples/page-b.js",
                        pageC: "./examples/page-c.js"
                    },
                    plugins: [
                        index_1.default({
                            filter: chunk => chunk.isEntry && chunk.name !== "pageA"
                        })
                    ]
                }, {
                    dir: "./examples/dist/",
                    entryFileNames: "[name]-[hash].js",
                    format: "commonjs"
                });
                const json = await utils_1.readJSON(distManifest);
                assert_1.default(typeof json["pageA.js"] === "undefined");
                assert_1.default(typeof json["pageB.js"] !== "undefined");
                assert_1.default(typeof json["pageC.js"] !== "undefined");
            });
            it("can use map to change the key name", async function () {
                await run({
                    input: {
                        pageA: "./examples/page-a.js",
                        pageB: "./examples/page-b.js",
                        pageC: "./examples/page-c.js"
                    },
                    plugins: [
                        index_1.default({
                            map: chunk => (Object.assign({}, chunk, { name: chunk.name.toUpperCase() }))
                        })
                    ]
                }, {
                    dir: "./examples/dist/",
                    entryFileNames: "[name]-[hash].js",
                    format: "commonjs"
                });
                const json = await utils_1.readJSON(distManifest);
                assert_1.default(typeof json["PAGEA.js"] !== "undefined");
                assert_1.default(typeof json["PAGEB.js"] !== "undefined");
                assert_1.default(typeof json["PAGEC.js"] !== "undefined");
            });
            it("can use sort to change the order of key", async function () {
                await run({
                    input: {
                        pageA: "./examples/page-a.js",
                        pageB: "./examples/page-b.js",
                        pageC: "./examples/page-c.js"
                    },
                    plugins: [
                        index_1.default({
                            sort: (chunkA, chunkB) => {
                                if (chunkA.name === "pageC") {
                                    return -1;
                                }
                                return index_1.defaultSort(chunkA, chunkB);
                            }
                        })
                    ]
                }, {
                    dir: "./examples/dist/",
                    entryFileNames: "[name]-[hash].js",
                    format: "commonjs"
                });
                const fileContent = await fs_1.default.promises.readFile(distManifest, {
                    encoding: "utf-8"
                });
                const fileLines = fileContent.split(/\r?\n/);
                const secondLine = fileLines[1].trim();
                assert_1.default(secondLine.indexOf("pageC.js") === 1);
            });
            it("can use generate to add some extra key/value pair", async function () {
                const existsKey = "index.css";
                const existsValue = "index-sdf8asdf.css";
                await run({
                    input: {
                        pageA: "./examples/page-a.js",
                        pageB: "./examples/page-b.js",
                        pageC: "./examples/page-c.js"
                    },
                    plugins: [
                        index_1.default({
                            generate: (keyValueDecorator, seed) => index_1.defaultGenerate(keyValueDecorator, Object.assign({}, seed, { [existsKey]: existsValue }))
                        })
                    ]
                }, {
                    dir: "./examples/dist/",
                    entryFileNames: "[name]-[hash].js",
                    format: "commonjs"
                });
                const json = await utils_1.readJSON(distManifest);
                assert_1.default(json[existsKey] === existsValue);
            });
            it("can use serialize to output yaml content", async function () {
                await run({
                    input: {
                        pageA: "./examples/page-a.js",
                        pageB: "./examples/page-b.js",
                        pageC: "./examples/page-c.js"
                    },
                    plugins: [
                        index_1.default({
                            fileName: "manifest.yaml",
                            serialize: manifest => json_to_pretty_yaml_1.default.stringify(manifest)
                        })
                    ]
                }, {
                    dir: "./examples/dist/",
                    entryFileNames: "[name]-[hash].js",
                    format: "commonjs"
                });
                const manifestPath = path_1.default.resolve(distPath, "manifest.yaml");
                assert_1.default(fs_1.default.existsSync(manifestPath));
                const fileContent = await fs_1.default.promises.readFile(manifestPath, {
                    encoding: "utf-8"
                });
                const fileLines = fileContent.split(/\r?\n/);
                assert_1.default(fileLines[0].indexOf("pageA.js") === 0);
                assert_1.default(fileLines[1].indexOf("pageB.js") === 0);
                assert_1.default(fileLines[2].indexOf("pageC.js") === 0);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUE2RDtBQUM3RCx5REFBdUU7QUFDdkUsNERBQTRCO0FBQzVCLG9EQUFvQjtBQUNwQix3REFBd0I7QUFDeEIsNERBQTRCO0FBQzVCLG1DQUFtQztBQUNuQyxzRkFBdUM7QUFFdkMsTUFBTSxRQUFRLEdBQUcsY0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUM5RCxNQUFNLFVBQVUsR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN0RCxNQUFNLFVBQVUsR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN0RCxNQUFNLFVBQVUsR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN0RCxNQUFNLFlBQVksR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUM3RCxzQ0FBc0M7QUFFdEMsS0FBSyxVQUFVLEdBQUcsQ0FBQyxZQUEwQixFQUFFLGFBQTRCO0lBQ3pFLE1BQU0sTUFBTSxHQUFHLE1BQU0sZUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzFDLE1BQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNyQyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUVELFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixVQUFVLENBQUM7UUFDVCxnQkFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsRUFBRSxD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