import { OutputAsset, OutputChunk, OutputBundle, OutputOptions } from "rollup";
import { NonUndefined } from "utility-types";
export declare type Bundle = OutputAsset | OutputChunk;
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
export declare const defaultFilter: NonUndefined<OutputManifestParam["filter"]>;
export declare const defaultMap: NonUndefined<OutputManifestParam["map"]>;
export declare const defaultSort: NonUndefined<OutputManifestParam["sort"]>;
export declare const defaultGenerate: NonUndefined<OutputManifestParam["generate"]>;
export declare const defaultSerialize: NonUndefined<OutputManifestParam["serialize"]>;
export default function outputManifest(param: OutputManifestParam): {
    name: string;
    generateBundle: (options: OutputOptions, bundle: OutputBundle) => Promise<void>;
};
