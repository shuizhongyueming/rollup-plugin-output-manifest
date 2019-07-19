"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const utils_1 = require("./utils");
const fs_1 = tslib_1.__importDefault(require("fs"));
exports.defaultFilter = chunk => chunk.isEntry;
exports.defaultMap = chunk => chunk;
exports.defaultSort = (chunkA, chunkB) => (chunkA.name > chunkB.name ? 1 : -1);
exports.defaultGenerate = chunks => chunks.reduce((json, chunk) => {
    const { name, fileName } = chunk;
    return Object.assign({}, json, { [name]: fileName });
}, {});
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
            let manifestObj = generateFunc(chunks.sort(sortFunc).map(mapFunc));
            const workspace = process.cwd();
            const filePath = path_1.default.resolve(workspace, targetDir, fileName);
            let seed = {};
            if (isMerge) {
                try {
                    seed = await utils_1.readJSON(filePath, { encoding: "utf-8" });
                }
                catch (e) {
                    seed = {};
                }
            }
            manifestObj = Object.entries(manifestObj).reduce((seed, [name, fileName]) => {
                const n = basePath ? path_1.default.join(basePath, name) : name;
                const f = publicPath ? path_1.default.join(publicPath, fileName) : fileName;
                return Object.assign({}, seed, { [`${n}${nameSuffix}`]: f });
            }, seed);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsd0RBQXdCO0FBQ3hCLG1DQUFtQztBQUNuQyxvREFBb0I7QUFrQlAsUUFBQSxhQUFhLEdBRXRCLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztBQUVkLFFBQUEsVUFBVSxHQUE2QyxLQUFLLENBQUMsRUFBRSxDQUMxRSxLQUFLLENBQUM7QUFFSyxRQUFBLFdBQVcsR0FBOEMsQ0FDcEUsTUFBTSxFQUNOLE1BQU0sRUFDTixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUU3QixRQUFBLGVBQWUsR0FFeEIsTUFBTSxDQUFDLEVBQUUsQ0FDWCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0lBQzVCLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQ2pDLHlCQUNLLElBQUksSUFDUCxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsSUFDaEI7QUFDSixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFFSSxRQUFBLGdCQUFnQixHQUV6QixRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUVsRCxTQUF3QixjQUFjLENBQUMsS0FBMkI7SUFDaEUsTUFBTSxFQUNKLFFBQVEsR0FBRyxlQUFlLEVBQzFCLFVBQVUsR0FBRyxLQUFLLEVBQ2xCLFVBQVUsR0FBRyxFQUFFLEVBQ2YsUUFBUSxHQUFHLEVBQUUsRUFDYixPQUFPLEdBQUcsS0FBSyxFQUNmLFVBQVUsRUFDVixNQUFNLEVBQ04sR0FB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