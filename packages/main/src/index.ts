import { OutputAsset, OutputChunk, OutputBundle, Plugin, NormalizedOutputOptions } from "rollup";
import { NonUndefined } from "utility-types";
import path from "path";
import { readJSON } from "./utils";
import fs from "fs";

export type Bundle = OutputAsset | OutputChunk;

const PluginName = "rollup-plugin-output-manifest";

export interface OutputManifestParam {
  fileName?: string;
  nameSuffix?: string;
  nameWithExt?: boolean;
  isMerge?: boolean;
  publicPath?: string;
  publicSuffix?: string;
  basePath?: string;
  outputPath?: string;
  filter?: (chunk: Bundle) => boolean;
  map?: (chunk: Bundle) => Bundle;
  sort?: (chunkA: Bundle, chunkB: Bundle) => number;
  keyValueDecorator?: KeyValueDecorator;
  generate?: (
    keyValueDecorator: KeyValueDecorator,
    seed: object,
    opt: OutputManifestParam
  ) => (chunks: Bundle[]) => object;
  serialize?: (manifest: object) => string;
}

export type KeyValueDecorator = (k: string, v: string, opt: OutputManifestParam) => {[k: string]: string};

export const isChunk = (bundle: Bundle): bundle is OutputChunk => {
  return bundle.type === 'chunk'
}
export const isAsset =  (bundle: Bundle): bundle is OutputAsset => {
  return bundle.type === 'asset'
}

export const defaultFilter: NonUndefined<
  OutputManifestParam["filter"]
> = chunk => isAsset(chunk) || (isChunk(chunk) && (chunk as OutputChunk).isEntry);

export const defaultMap: NonUndefined<OutputManifestParam["map"]> = chunk =>
  chunk;

export const defaultSort: NonUndefined<OutputManifestParam["sort"]> = (
  chunkA,
  chunkB
) => (chunkA.fileName > chunkB.fileName ? 1 : -1);

export const defaultKeyValueDecorator: KeyValueDecorator = (k: string, v: string, {basePath = '',publicPath = '',nameSuffix = '',nameWithExt,publicSuffix = ''}: OutputManifestParam) => {
        const n = `${basePath}${k}`;
        const f = `${publicPath}${v}`;
        const ext = path.extname(f);
        const key = `${n}${nameWithExt ? ext : ''}${nameSuffix}`;
        const value = `${f}${publicSuffix}`;
        return { [key]:  value};
      }

export const defaultGenerate: NonUndefined<OutputManifestParam["generate"]> = (
  keyValueDecorator,
  seed,
  opt
) => chunks =>
  chunks.reduce((json, chunk) => {
    const { name, fileName } = chunk;
    if (name) {
      return {
        ...json,
        ...keyValueDecorator(name, fileName, opt)
      };
    }
    console.warn(`Warn: output file ${fileName} has no releated origin name, so omit it`);
    return json
  }, seed);

export const defaultSerialize: NonUndefined<
  OutputManifestParam["serialize"]
> = manifest => JSON.stringify(manifest, null, 2);

export default function outputManifest(param?: OutputManifestParam): Plugin {
  const {
    fileName = "manifest.json",
    isMerge = false,
    nameWithExt = true,
    outputPath,
    filter,
    map,
    sort,
    generate,
    serialize,
    keyValueDecorator,
  } = (param || {}) as OutputManifestParam;

  return {
    name: PluginName,
    generateBundle: async function (options: NormalizedOutputOptions, bundle: OutputBundle) {
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
      const keyValueDecoratorFunc = keyValueDecorator || defaultKeyValueDecorator;

      let chunks = Object.values(bundle)
        .filter(filterFunc);

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


      let manifestObj = generateFunc(keyValueDecoratorFunc, seed, {
        ...(param || {}),
        fileName,
        nameWithExt,
        isMerge
      })(
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
    },
  };
}
