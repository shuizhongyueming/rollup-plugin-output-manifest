import type { OutputAsset, OutputChunk, Plugin } from "rollup";

declare function outputManifest(
  options?: outputManifest.OutputManifestParam,
): Plugin;

declare namespace outputManifest {
  export type Bundle = OutputAsset | OutputChunk;

  export interface OutputManifestParam {
    fileName?: string;
    filter?: (bundle: Bundle) => boolean;
    map?: (bundle: Bundle) => Bundle;
    sort?: (left: Bundle, right: Bundle) => number;
    serialize?: (manifest: object) => string;
  }

  export type KeyValueDecorator = (
    key: string,
    value: string,
    options?: OutputManifestParam,
  ) => Record<string, string>;

  export const isChunk: (bundle: Bundle) => bundle is OutputChunk;
  export const isAsset: (bundle: Bundle) => bundle is OutputAsset;
  export const defaultFilter: NonNullable<OutputManifestParam["filter"]>;
  export const defaultMap: NonNullable<OutputManifestParam["map"]>;
  export const defaultSort: NonNullable<OutputManifestParam["sort"]>;
  export const defaultKeyValueDecorator: KeyValueDecorator;
  export const defaultGenerate: (
    decorate: KeyValueDecorator,
    seed: object,
    options?: OutputManifestParam,
  ) => (bundles: Bundle[]) => object;
  export const defaultSerialize: NonNullable<
    OutputManifestParam["serialize"]
  >;

  export { outputManifest as default };
}

export = outputManifest;
