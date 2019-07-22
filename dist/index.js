"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const utils_1 = require("./utils");
const fs_1 = tslib_1.__importDefault(require("fs"));
exports.defaultFilter = chunk => chunk.isEntry;
exports.defaultMap = chunk => chunk;
exports.defaultSort = (chunkA, chunkB) => (chunkA.name > chunkB.name ? 1 : -1);
exports.defaultGenerate = (keyValueDecorator, seed) => chunks => chunks.reduce((json, chunk) => {
    const { name, fileName } = chunk;
    return Object.assign({}, json, keyValueDecorator(name, fileName));
}, seed);
exports.defaultSerialize = manifest => JSON.stringify(manifest, null, 2);
function outputManifest(param) {
    const { fileName = "manifest.json", nameSuffix = ".js", publicPath = "", basePath = "", isMerge = false, outputPath, filter, map, sort, generate, serialize } = (param || {});
    return {
        name: "rollup-plugin-output-manifest",
        generateBundle: async (options, bundle) => {
            let targetDir;
            if (outputPath) {
                targetDir = outputPath;
            }
            else {
                if (options.dir) {
                    targetDir = options.dir;
                }
                else if (options.file) {
                    targetDir = path_1.default.dirname(options.file);
                }
            }
            if (!targetDir) {
                throw new Error("Please set outputPath, so we can know where to place the json file");
            }
            const filterFunc = filter || exports.defaultFilter;
            const mapFunc = map || exports.defaultMap;
            const sortFunc = sort || exports.defaultSort;
            const generateFunc = generate || exports.defaultGenerate;
            const serializeFunc = serialize || exports.defaultSerialize;
            let chunks = Object.values(bundle)
                // only output chunk, because asset has no attribute name
                .filter(bundle => typeof bundle.name !== "undefined");
            chunks = chunks.filter(filterFunc);
            let seed = {};
            const workspace = process.cwd();
            const filePath = path_1.default.resolve(workspace, targetDir, fileName);
            if (isMerge) {
                try {
                    seed = await utils_1.readJSON(filePath, { encoding: "utf-8" });
                }
                catch (e) {
                    seed = {};
                }
            }
            function keyValueDecorator(k, v) {
                const n = basePath ? `${basePath}${k}` : k;
                const f = publicPath ? `${publicPath}${v}` : v;
                return { [`${n}${nameSuffix}`]: f };
            }
            let manifestObj = generateFunc(keyValueDecorator, seed)(chunks.sort(sortFunc).map(mapFunc));
            const manifestStr = serializeFunc(manifestObj);
            try {
                if (!fs_1.default.existsSync(targetDir)) {
                    fs_1.default.mkdirSync(targetDir, { recursive: true });
                }
                await fs_1.default.promises.writeFile(filePath, manifestStr);
            }
            catch (e) {
                throw e;
            }
        }
    };
}
exports.default = outputManifest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsd0RBQXdCO0FBQ3hCLG1DQUFtQztBQUNuQyxvREFBb0I7QUF1QlAsUUFBQSxhQUFhLEdBRXRCLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztBQUVkLFFBQUEsVUFBVSxHQUE2QyxLQUFLLENBQUMsRUFBRSxDQUMxRSxLQUFLLENBQUM7QUFFSyxRQUFBLFdBQVcsR0FBOEMsQ0FDcEUsTUFBTSxFQUNOLE1BQU0sRUFDTixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUU3QixRQUFBLGVBQWUsR0FBa0QsQ0FDNUUsaUJBQWlCLEVBQ2pCLElBQUksRUFDSixFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FDWixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0lBQzVCLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQ2pDLHlCQUNLLElBQUksRUFDSixpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQ3BDO0FBQ0osQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBRUUsUUFBQSxnQkFBZ0IsR0FFekIsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFFbEQsU0FBd0IsY0FBYyxDQUFDLEtBQTJCO0lBQ2hFLE1BQU0sRUFDSixRQUFRLEdBQUcsZUFBZSxFQUMxQixVQUFVLEdBQUcsS0FBSyxFQUNsQixVQUFVLEdBQUcsRUFBRSxFQUNmLFFBQVEsR0FBRyxFQUFFLEVB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