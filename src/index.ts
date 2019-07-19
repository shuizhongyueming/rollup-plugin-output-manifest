import { OutputAsset, OutputChunk, OutputBundle, OutputOptions } from "rollup";
import { NonUndefined } from "utility-types";
import path from "path";
import { readJSON, writeFile } from "./utils";

export type Bundle = OutputAsset | OutputChunk;

export interface Manifest {
  [key: string]: string;
}

export interface OutputManifestParam {
  fileName: string;
  nameSuffix?: string;
  isMerge?: boolean;
  publicPath?: string;
  basePath?: string;
  outputPath?: string;
  filter?: (bundle: Bundle) => boolean;
  map?: (bundle: OutputChunk) => OutputChunk;
  sort?: (bundleA: OutputChunk, bundleB: OutputChunk) => number;
  generate?: (bundles: OutputChunk[]) => Manifest;
  serialize?: (manifest: Manifest) => string;
}

export const defaultFilter: NonUndefined<OutputManifestParam["filter"]> = () =>
  true;

export const defaultMap: NonUndefined<OutputManifestParam["map"]> = bundle =>
  bundle;

export const defaultSort: NonUndefined<OutputManifestParam["sort"]> = (
  bundleA,
  bundleB
) => (bundleA.name > bundleB.name ? 1 : -1);

export const defaultGenerate: NonUndefined<
  OutputManifestParam["generate"]
> = bundles =>
  bundles.reduce((json, bundle) => {
    const { name, fileName } = bundle;
    return {
      ...json,
      [name]: fileName
    };
  }, {});

export const defaultSerialize: NonUndefined<
  OutputManifestParam["serialize"]
> = manifest => JSON.stringify(manifest, null, 2);

export default function outputManifest(param: OutputManifestParam) {
  const {
    fileName = "manifest.json",
    nameSuffix = ".js",
    publicPath = "",
    basePath = "",
    isMerge = false,
    outputPath,
    filter,
    map,
    sort,
    generate,
    serialize
  } = (param || {}) as OutputManifestParam;

  return {
    name: "rollup-plugin-output-manifest",
    generateBundle: async (options: OutputOptions, bundle: OutputBundle) => {
      let targetDir: string | undefined;
      if (outputPath) {
        targetDir = outputPath;
      } else {
        if (options.dir) {
          targetDir = options.dir;
        } else if (options.file) {
          targetDir = path.dirname(options.file);
        }
      }

      if (!targetDir) {
        throw new Error(
          "please set outputPath, so we can know where to place the json file"
        );
      }

      const filterFunc = filter || defaultFilter;
      const mapFunc = map || defaultMap;
      const sortFunc = sort || defaultSort;
      const generateFunc = generate || defaultGenerate;
      const serializeFunc = serialize || defaultSerialize;

      let chunks = Object.values(bundle)
        // only output chunk, because asset has no attribute name
        .filter(bundle => typeof (bundle as OutputChunk).name !== "undefined")
        .filter(filterFunc) as OutputChunk[];

      let jsonObj = generateFunc(chunks.sort(sortFunc).map(mapFunc));
      const workspace = process.cwd();
      const filePath = path.resolve(workspace, targetDir, fileName);
      let seed = {};

      if (isMerge) {
        try {
          seed = await readJSON(filePath, { encoding: "utf-8" });
        } catch (e) {
          seed = {};
        }
      }

      jsonObj = Object.entries(jsonObj).reduce((seed, [name, fileName]) => {
        const n = basePath ? path.join(basePath, name) : name;
        const f = publicPath ? path.join(publicPath, fileName) : fileName;
        return { ...seed, [`${n}${nameSuffix}`]: f };
      }, seed);

      const manifestJSON = serializeFunc(jsonObj);

      try {
        writeFile(filePath, manifestJSON);
        console.log("build manifest json success!");
      } catch (e) {
        throw e;
      }
    }
  };
}
