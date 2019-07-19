"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const utils_1 = require("./utils");
exports.defaultFilter = () => true;
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
                throw new Error("please set outputPath, so we can know where to place the json file");
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
                utils_1.writeFile(filePath, manifestStr);
                console.log("build manifest json success!");
            }
            catch (e) {
                throw e;
            }
        }
    };
}
exports.default = outputManifest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsd0RBQXdCO0FBQ3hCLG1DQUE4QztBQWtCakMsUUFBQSxhQUFhLEdBQWdELEdBQUcsRUFBRSxDQUM3RSxJQUFJLENBQUM7QUFFTSxRQUFBLFVBQVUsR0FBNkMsS0FBSyxDQUFDLEVBQUUsQ0FDMUUsS0FBSyxDQUFDO0FBRUssUUFBQSxXQUFXLEdBQThDLENBQ3BFLE1BQU0sRUFDTixNQUFNLEVBQ04sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFN0IsUUFBQSxlQUFlLEdBRXhCLE1BQU0sQ0FBQyxFQUFFLENBQ1gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtJQUM1QixNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNqQyx5QkFDSyxJQUFJLElBQ1AsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLElBQ2hCO0FBQ0osQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBRUksUUFBQSxnQkFBZ0IsR0FFekIsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFFbEQsU0FBd0IsY0FBYyxDQUFDLEtBQTBCO0lBQy9ELE1BQU0sRUFDSixRQUFRLEdBQUcsZUFBZSxFQUMxQixVQUFVLEdBQUcsS0FBSyxFQUNsQixVQUFVLEdBQUcsRUFBRSxFQUNmLFFBQVEsR0FBRyxFQUFFLEVBQ2IsT0FBTyxHQUFHLEtBQUssRUFDZixVQUFVLEVBQ1YsTUFBTSxFQUNOLEdBQUcsRUFDSCxJQUFJLEVBQ0osUUFBUSxFQUNS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