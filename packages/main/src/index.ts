import { OutputAsset, OutputChunk, OutputBundle, Plugin, NormalizedOutputOptions } from "rollup";
import { NonUndefined } from "utility-types";
import path from "path";
import { readJSON } from "./utils";
import fs from "fs";

export type Bundle = OutputAsset | OutputChunk;

export interface OutputManifestParam {
  fileName?: string;
  nameSuffix?: string;
  isMerge?: boolean;
  publicPath?: string;
  publicSuffix?: string;
  basePath?: string;
  outputPath?: string;
  filter?: (chunk: OutputChunk) => boolean;
  map?: (chunk: OutputChunk) => OutputChunk;
  sort?: (chunkA: OutputChunk, chunkB: OutputChunk) => number;
  generate?: (
    keyValueDecorator: KeyValueDecorator,
    seed: object
  ) => (chunks: OutputChunk[]) => object;
  serialize?: (manifest: object) => string;
}

export type KeyValueDecorator = (k: string, v: string) => object;

export const defaultFilter: NonUndefined<
  OutputManifestParam["filter"]
> = chunk => chunk.isEntry;

export const defaultMap: NonUndefined<OutputManifestParam["map"]> = chunk =>
  chunk;

export const defaultSort: NonUndefined<OutputManifestParam["sort"]> = (
  chunkA,
  chunkB
) => (chunkA.name > chunkB.name ? 1 : -1);

export const defaultGenerate: NonUndefined<OutputManifestParam["generate"]> = (
  keyValueDecorator,
  seed
) => chunks =>
  chunks.reduce((json, chunk) => {
    const { name, fileName } = chunk;
    return {
      ...json,
      ...keyValueDecorator(name, fileName)
    };
  }, seed);

export const defaultSerialize: NonUndefined<
  OutputManifestParam["serialize"]
> = manifest => JSON.stringify(manifest, null, 2);

export default function outputManifest(param?: OutputManifestParam): Plugin {
  const {
    fileName = "manifest.json",
    nameSuffix = ".js",
    publicPath = "",
    publicSuffix = "",
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
    generateBundle: async (options: NormalizedOutputOptions, bundle: OutputBundle) => {
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
          "Please set outputPath, so we can know where to place the json file"
        );
      }

      const filterFunc = filter || defaultFilter;
      const mapFunc = map || defaultMap;
      const sortFunc = sort || defaultSort;
      const generateFunc = generate || defaultGenerate;
      const serializeFunc = serialize || defaultSerialize;

      let chunks = Object.values(bundle)
        // only output chunk, because asset has no attribute name
        .filter(
          bundle => typeof (bundle as OutputChunk).name !== "undefined"
        ) as OutputChunk[];

      chunks = chunks.filter(filterFunc);

      let seed = {};
      const workspace = process.cwd();
      const filePath = path.resolve(workspace, targetDir, fileName);

      if (isMerge) {
        try {
          seed = await readJSON(filePath, { encoding: "utf-8" });
        } catch (e) {
          seed = {};
        }
      }

      function keyValueDecorator(k: string, v: string) {
        const n = basePath ? `${basePath}${k}` : k;
        const f = publicPath ? `${publicPath}${v}` : v;
        return { [`${n}${nameSuffix}`]: `${f}${publicSuffix}` };
      }

      let manifestObj = generateFunc(keyValueDecorator, seed)(
        chunks.sort(sortFunc).map(mapFunc)
      );

      const manifestStr = serializeFunc(manifestObj);

      try {
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        await fs.promises.writeFile(filePath, manifestStr);
      } catch (e) {
        throw e;
      }
    }
  };
}
