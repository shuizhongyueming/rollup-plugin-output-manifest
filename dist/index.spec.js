"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rollup_1 = require("rollup");
const index_1 = tslib_1.__importDefault(require("./index"));
const assert_1 = tslib_1.__importDefault(require("assert"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const rimraf_1 = tslib_1.__importDefault(require("rimraf"));
const utils_1 = require("./utils");
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
        describe("default options", async function () {
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
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUE2RDtBQUM3RCw0REFBcUM7QUFDckMsNERBQTRCO0FBQzVCLG9EQUFvQjtBQUNwQix3REFBd0I7QUFDeEIsNERBQTRCO0FBQzVCLG1DQUFtQztBQUVuQyxNQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBQzlELE1BQU0sVUFBVSxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3RELE1BQU0sVUFBVSxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3RELE1BQU0sVUFBVSxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3RELE1BQU0sWUFBWSxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQzdELHNDQUFzQztBQUV0QyxLQUFLLFVBQVUsR0FBRyxDQUFDLFlBQTBCLEVBQUUsYUFBNEI7SUFDekUsTUFBTSxNQUFNLEdBQUcsTUFBTSxlQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDMUMsTUFBTSxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBRUQsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3pCLFVBQVUsQ0FBQztRQUNULGdCQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixFQUFFLENBQUMsY0FBYyxFQUFF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