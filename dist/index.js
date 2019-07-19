"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const utils_1 = require("./utils");
exports.defaultFilter = () => true;
exports.defaultMap = bundle => bundle;
exports.defaultSort = (bundleA, bundleB) => (bundleA.name > bundleB.name ? 1 : -1);
exports.defaultGenerate = bundles => bundles.reduce((json, bundle) => {
    const { name, fileName } = bundle;
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
                .filter(bundle => typeof bundle.name !== "undefined")
                .filter(filterFunc);
            let jsonObj = generateFunc(chunks.sort(sortFunc).map(mapFunc));
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
            jsonObj = Object.entries(jsonObj).reduce((seed, [name, fileName]) => {
                const n = basePath ? path_1.default.join(basePath, name) : name;
                const f = publicPath ? path_1.default.join(publicPath, fileName) : fileName;
                return Object.assign({}, seed, { [`${n}${nameSuffix}`]: f });
            }, seed);
            const manifestJSON = serializeFunc(jsonObj);
            try {
                utils_1.writeFile(filePath, manifestJSON);
                console.log("build manifest json success!");
            }
            catch (e) {
                throw e;
            }
        }
    };
}
exports.default = outputManifest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsd0RBQXdCO0FBQ3hCLG1DQUE4QztBQXNCakMsUUFBQSxhQUFhLEdBQWdELEdBQUcsRUFBRSxDQUM3RSxJQUFJLENBQUM7QUFFTSxRQUFBLFVBQVUsR0FBNkMsTUFBTSxDQUFDLEVBQUUsQ0FDM0UsTUFBTSxDQUFDO0FBRUksUUFBQSxXQUFXLEdBQThDLENBQ3BFLE9BQU8sRUFDUCxPQUFPLEVBQ1AsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFL0IsUUFBQSxlQUFlLEdBRXhCLE9BQU8sQ0FBQyxFQUFFLENBQ1osT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRTtJQUM5QixNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLE1BQU0sQ0FBQztJQUNsQyx5QkFDSyxJQUFJLElBQ1AsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLElBQ2hCO0FBQ0osQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBRUksUUFBQSxnQkFBZ0IsR0FFekIsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFFbEQsU0FBd0IsY0FBYyxDQUFDLEtBQTBCO0lBQy9ELE1BQU0sRUFDSixRQUFRLEdBQUcsZUFBZSxFQUMxQixVQUFVLEdBQUcsS0FBSyxFQUNsQixVQUFVLEdBQUcsRUFBRSxFQUNmLFFBQVEsR0FBRyxFQUFFLEVBQ2IsT0FBTyxHQUFHLEtBQUssRUFDZixVQUFVLEVBQ1YsTUFBTSxFQUNOLEdBQUcsRUFDSCxJQUFJLEVBQ0osUUFBUSxFQUNS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