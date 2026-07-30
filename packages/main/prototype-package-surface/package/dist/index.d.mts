import type { OutputAsset, OutputChunk, Plugin } from "rollup";

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

export declare const isChunk: (bundle: Bundle) => bundle is OutputChunk;
export declare const isAsset: (bundle: Bundle) => bundle is OutputAsset;
export declare const defaultFilter: NonNullable<OutputManifestParam["filter"]>;
export declare const defaultMap: NonNullable<OutputManifestParam["map"]>;
export declare const defaultSort: NonNullable<OutputManifestParam["sort"]>;
export declare const defaultKeyValueDecorator: KeyValueDecorator;
export declare const defaultGenerate: (
  decorate: KeyValueDecorator,
  seed: object,
  options?: OutputManifestParam,
) => (bundles: Bundle[]) => object;
export declare const defaultSerialize: NonNullable<
  OutputManifestParam["serialize"]
>;

export interface OutputManifestFactory {
  (options?: OutputManifestParam): Plugin;
  readonly default: OutputManifestFactory;
  readonly isChunk: typeof isChunk;
  readonly isAsset: typeof isAsset;
  readonly defaultFilter: typeof defaultFilter;
  readonly defaultMap: typeof defaultMap;
  readonly defaultSort: typeof defaultSort;
  readonly defaultKeyValueDecorator: typeof defaultKeyValueDecorator;
  readonly defaultGenerate: typeof defaultGenerate;
  readonly defaultSerialize: typeof defaultSerialize;
}

declare const outputManifest: OutputManifestFactory;

export default outputManifest;
