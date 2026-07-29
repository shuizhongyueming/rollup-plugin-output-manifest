# Rollup and `rollup-plugin-output-manifest` Maintenance Research (2026-07)

> Research date: 2026-07-29
> Scope: current Rollup release lines, Node.js requirements, output plugin APIs, breaking changes that directly affect this project, and npm publication and download data.
> Source policy: only official Rollup documentation, repositories, and releases, plus the official npm Registry and Downloads APIs. Recommendations and inferences are explicitly identified and are not presented as official support commitments.

## Executive summary

1. The current stable Rollup release is **4.62.3**, published on 2026-07-26. GitHub marks it as Latest and the npm `latest` dist-tag points to the same version. Rollup 4 requires Node.js `>=18.0.0` and npm `>=8.0.0`. [Release](https://github.com/rollup/rollup/releases/tag/v4.62.3) · [npm Registry](https://registry.npmjs.org/rollup/latest) · [package.json](https://github.com/rollup/rollup/blob/v4.62.3/package.json)
2. npm also retains the official dist-tags `backports-2 = 2.80.0` and `backports-3 = 3.30.0`. Both older major lines received a targeted backport on 2026-02-22 to prevent generated files from escaping the output directory. Rollup 2 and 3 therefore retain practical compatibility value, but Rollup publishes no LTS, EOL, or SLA matrix, so they must not be described as generally active maintenance lines. [Full npm metadata, including `dist-tags`](https://registry.npmjs.org/rollup) · [v2.80.0 changelog](https://github.com/rollup/rollup/blob/v2.80.0/CHANGELOG.md#2800) · [v3.30.0 release](https://github.com/rollup/rollup/releases/tag/v3.30.0)
3. The latest npm release of this plugin remains **2.0.0**, published on 2021-04-29. It declares neither `engines` nor `peerDependencies`, and its development dependency remains `rollup ^2.46.0`. [Full npm metadata](https://registry.npmjs.org/rollup-plugin-output-manifest) · [Latest-version metadata](https://registry.npmjs.org/rollup-plugin-output-manifest/latest)
4. The package still has meaningful usage: **6,651** downloads in the most recent complete week (2026-07-18 through 2026-07-24), **23,942** in the most recent 30 days, and **367,929** in the most recent year. The 30-day figure is equivalent to roughly 5,586 downloads per week, consistent with the observed 5,000-plus weekly usage. [Last week](https://api.npmjs.org/downloads/point/last-week/rollup-plugin-output-manifest) · [Last month](https://api.npmjs.org/downloads/point/last-month/rollup-plugin-output-manifest) · [Last year](https://api.npmjs.org/downloads/point/last-year/rollup-plugin-output-manifest)
5. The core APIs used by this plugin—`generateBundle(options, bundle, isWrite)`, `OutputBundle`, `OutputAsset`, `OutputChunk`, and `NormalizedOutputOptions.dir/file`—remain stable across Rollup 2, 3, and 4. The required work is not a hook replacement. It is to:
   - use `this.emitFile({ type: "asset", fileName, source })` so Rollup manages the default manifest output;
   - support Rollup 4 asset `names[]` instead of relying only on the deprecated singular `name`;
   - define the semantics of multiple outputs, `bundle.generate()`, sourcemap assets, merge behavior, and custom `outputPath`;
   - add a Rollup 2, 3, and 4 CI matrix.
   [generateBundle documentation](https://rollupjs.org/plugin-development/#generatebundle) · [emitFile documentation](https://rollupjs.org/plugin-development/#this-emitfile)
6. The published package has two P0 defects independent of the Rollup API: ESM consumers receive a default import that is not callable ([TypeError: outputManifest is not a function](https://github.com/shuizhongyueming/rollup-plugin-output-manifest/issues/21)), and the published `.d.ts` references `utility-types` even though that package is not shipped as a runtime dependency, reproducing `TS2307` in a clean TypeScript consumer. [2.0.0 tarball](https://registry.npmjs.org/rollup-plugin-output-manifest/-/rollup-plugin-output-manifest-2.0.0.tgz) · [Latest-version metadata](https://registry.npmjs.org/rollup-plugin-output-manifest/latest)
7. Disposable runtime probes establish **Rollup 2.20.0** as the first viable Rollup 2 lower bound when the existing named-asset contract is included. Rollup 2.0.0 through 2.19.x can generate chunk manifests, but do not expose the asset `name` consumed by the plugin. Rollup 2.20.0, 3.0.0, and 4.0.0 all pass the entry and named-asset probe on Node 18.20.8. [Probe resolution](https://github.com/shuizhongyueming/rollup-plugin-output-manifest/issues/32#issuecomment-5115437057) · [Rollup PR 3658](https://github.com/rollup/rollup/pull/3658)

## 1. Current npm status

### 1.1 Publication metadata

| Field | Official npm data |
| --- | --- |
| `latest` | `2.0.0` |
| 2.0.0 publication time | 2021-04-29T10:28:35.018Z |
| Last npm metadata modification | 2022-05-16T04:32:46.652Z |
| Entry point | `dist/index.js` |
| Types | `dist/index.d.ts` |
| `engines` | Not declared |
| `peerDependencies` | Not declared |
| Rollup development dependency | `^2.46.0` |

Sources: the [npm package document](https://registry.npmjs.org/rollup-plugin-output-manifest) and [npm latest-version document](https://registry.npmjs.org/rollup-plugin-output-manifest/latest). The official npm Registry documentation explains that a package document contains `dist-tags`, all published `versions`, publication timestamps, and related metadata: [Public Registry API](https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md#getpackage).

**Assessment:** This is not an unused historical package. Roughly 368,000 annual downloads justify restoring maintenance rather than simply archiving it.

### 1.2 Limits of the download data

The npm Downloads API aggregates these figures by package name. It cannot identify whether a consumer uses Rollup 2, 3, or 4. Therefore:

- the plugin clearly retains ongoing usage;
- the download figures cannot establish the share of each Rollup major;
- the compatibility range should be based on official API stability, Rollup dist-tag and backport status, and actual CI coverage, not an inferred version distribution.

### 1.3 Published-package probes

The actual npm package `rollup-plugin-output-manifest@2.0.0` was tested in the same modern Node environment with Rollup `2.80.0`, `3.30.0`, and `4.62.3`:

- the basic `generateBundle` flow passed;
- entry chunks appeared in the manifest;
- assets with a `name` appeared in the manifest.

This supports the conclusion that the core API remains stable across three major lines. It is not a complete compatibility certification: multiple outputs, sourcemaps, merge behavior, paths, and TypeScript consumption still require formal CI coverage.

The probes also reproduced two publication defects:

1. **ESM/CJS interoperability:** The README example `import outputManifest from "rollup-plugin-output-manifest"` does not produce a directly callable function. For a module namespace returned by dynamic `import()`, the function is located at `.default.default`; a static default import likewise requires accessing the inner `.default`. This matches [TypeError: outputManifest is not a function](https://github.com/shuizhongyueming/rollup-plugin-output-manifest/issues/21) and its user workaround. The published package exposes only a CommonJS `main`, with no modern `exports` map or separate ESM entry point. [Latest-version metadata](https://registry.npmjs.org/rollup-plugin-output-manifest/latest)
2. **Missing type dependency:** The published `dist/index.d.ts` contains `import { NonUndefined } from "utility-types"`, but npm metadata lists `utility-types` only in `devDependencies`. Consumers that have not installed it independently receive `TS2307`. [2.0.0 tarball](https://registry.npmjs.org/rollup-plugin-output-manifest/-/rollup-plugin-output-manifest-2.0.0.tgz) · [Latest-version metadata](https://registry.npmjs.org/rollup-plugin-output-manifest/latest)

Both defects should be fixed as part of the recovery release and should not wait for the Rollup 4 compatibility work.

### 1.4 Lower-bound probes

Disposable probes narrowed the Rollup 2 asset boundary:

| Rollup version | Chunk manifest | Named asset manifest | Result |
| --- | --- | --- | --- |
| 2.0.0–2.19.x | Pass | Asset `name` is unavailable and the plugin omits the asset | Not viable for the existing asset contract |
| 2.20.0 | Pass | Pass | First viable Rollup 2 lower bound |
| 2.46.0 | Pass | Pass | Viable |
| 3.0.0 | Pass | Pass | Viable |
| 4.0.0 | Pass | Pass | Viable |

Rollup 2.20.0 introduced the asset naming metadata consumed by this plugin through [Rollup PR 3658](https://github.com/rollup/rollup/pull/3658). Rollup 2.20.0, 3.0.0, and 4.0.0 also passed the runtime probe on Node 18.20.8.

Package-surface failures were identical across the probed Rollup versions. CommonJS and native ESM both expose the current nested default export, while the TypeScript declarations pass after `utility-types` is explicitly installed. This confirms that the import and declaration failures belong to the plugin package, not to a particular Rollup line.

## 2. Current Rollup release lines and Node.js requirements

| Rollup line | Version or tag as of 2026-07-29 | Publication date | Official minimum Node/npm | Confirmed status |
| --- | --- | --- | --- | --- |
| 4 | `latest = 4.62.3` | 2026-07-26 | Node `>=18.0.0`, npm `>=8.0.0` | Current stable mainline |
| 3 | `backports-3 = 3.30.0` | 2026-02-22 | Node `>=14.18.0`, npm `>=8.0.0` | Targeted backport; no public LTS or SLA |
| 2 | `backports-2 = 2.80.0` | 2026-02-22 | Node `>=10.0.0` | Targeted backport; no public LTS or SLA |
| 1 | Final release `1.32.1` | 2020-03-06 | Historical release | No current dist-tag; new formal support is not recommended |

Sources:

- Current npm dist-tags: [registry.npmjs.org/rollup](https://registry.npmjs.org/rollup).
- Rollup 4.62.3: [release](https://github.com/rollup/rollup/releases/tag/v4.62.3) · [package.json](https://github.com/rollup/rollup/blob/v4.62.3/package.json).
- Rollup 3.30.0: [release](https://github.com/rollup/rollup/releases/tag/v3.30.0) · [package.json](https://github.com/rollup/rollup/blob/v3.30.0/package.json).
- Rollup 2.80.0: [changelog](https://github.com/rollup/rollup/blob/v2.80.0/CHANGELOG.md#2800) · [package.json](https://github.com/rollup/rollup/blob/v2.80.0/package.json).
- Rollup 1.32.1: [tag](https://github.com/rollup/rollup/tree/v1.32.1).
- Rollup's official security guidance recommends always using the latest version of Rollup and official plugins, but publishes no support lifetime for older major lines: [SECURITY.md](https://github.com/rollup/rollup/blob/master/SECURITY.md).

### Recommended version commitment

This is a project recommendation, not an official Rollup statement:

- **Primary support line: Rollup 4.**
- **Compatibility lines: Rollup 2, 3, and 4.** The output APIs used by the plugin are sufficiently stable that retaining all three lines has limited marginal cost.
- Use `^2.20.0 || ^3.0.0 || ^4.0.0` as the candidate `peerDependencies` range. The exact public commitment must be locked by CI before publication.
- Test at least the latest security or backport release in each major: `2.80.0`, `3.30.0`, and `4.62.3`.
- Test the viable lower bounds `2.20.0`, `3.0.0`, and `4.0.0` if the package declares the full ranges above.
- Do not add Rollup 1 to the restored maintenance line. It is a historical API line, and retaining it would constrain type, Node, and toolchain modernization.

The official `@rollup/plugin-json` package also declares Rollup as a peer dependency and explicitly lists multiple major versions. It is a useful official precedent for package metadata design, but it is not evidence of a support lifetime for older Rollup versions. [Official plugin package.json](https://github.com/rollup/plugins/blob/master/packages/json/package.json)

### Node.js strategy

Any shared test environment that runs Rollup 4 must use at least Node 18. The restored plugin should declare `engines.node >=18` and test Rollup 2, 3, and 4 in the same modern Node environment. Compatibility with Rollup 2 does not require continued support for Node 10. Rollup 4's minimum Node version is confirmed by both the official migration guide and the current package metadata: [Migrating to Rollup 4](https://rollupjs.org/migration/#prerequisites) · [v4.62.3 package.json](https://github.com/rollup/rollup/blob/v4.62.3/package.json).

## 3. Official output APIs relevant to the manifest plugin

### 3.1 `generateBundle`

The current official signature is:

```ts
(options: OutputOptions,
 bundle: Record<string, OutputAsset | OutputChunk>,
 isWrite: boolean) => void
```

It is an async, sequential hook that runs at the end of `bundle.generate()` or immediately before `bundle.write()` writes files. At that point, `bundle` contains the complete final file set for the current output. [Official documentation](https://rollupjs.org/plugin-development/#generatebundle)

The source type definitions retain the same core signature across Rollup 2, 3, and 4:

- [Rollup 2.80.0 types.d.ts](https://github.com/rollup/rollup/blob/v2.80.0/src/rollup/types.d.ts#L367-L372)
- [Rollup 3.30.0 types.d.ts](https://github.com/rollup/rollup/blob/v3.30.0/src/rollup/types.d.ts#L385-L390)
- [Rollup 4.62.3 types.d.ts](https://github.com/rollup/rollup/blob/v4.62.3/src/rollup/types.d.ts#L476-L481)

**Project implication:** Rollup 4 compatibility does not require a different hook. `generateBundle` remains the correct place to read final file names and generate a manifest.

### 3.2 The manifest output should use `this.emitFile`

Rollup explicitly requires plugins that add files in `generateBundle` to use `this.emitFile`. Adding assets directly to the `bundle` object bypasses Rollup's internal asset tracking and may break even in a minor update. [generateBundle warning](https://rollupjs.org/plugin-development/#generatebundle)

The standard form is:

```ts
this.emitFile({
  type: "asset",
  fileName,
  source: manifestText,
});
```

`fileName` is interpreted relative to `output.dir`, and Rollup reports conflicts. [emitFile documentation](https://rollupjs.org/plugin-development/#this-emitfile)

The current plugin instead calls `fs.promises.writeFile` from `generateBundle`. This causes several problems:

- the in-memory `bundle.generate()` API still creates a disk side effect;
- other plugins that inspect the in-memory bundle cannot see the manifest asset;
- each output of a multi-output build runs the hook and may overwrite the same path;
- a test that calls `generate()` and then `write()` executes the current file-writing logic twice.

Rollup documents that each `bundle.generate()` or `bundle.write()` call runs the output generation phase and that one build can generate multiple outputs: [JavaScript API](https://rollupjs.org/javascript-api/). The plugin documentation also explains that adding or removing files during `generateBundle` supports in-memory builds and makes those changes visible to other in-memory plugins: [Plugin development](https://rollupjs.org/plugin-development/#properties).

### 3.3 `OutputAsset.name` is leaving the primary path

Starting with Rollup 4.23.0, Rollup collects all asset `names` and `originalFileNames`. Current types retain `name` and `originalFileName`, but mark the singular properties as deprecated in favor of the arrays. [v4.23.0 release](https://github.com/rollup/rollup/releases/tag/v4.23.0) · [v4.62.3 `PreRenderedAsset`](https://github.com/rollup/rollup/blob/v4.62.3/src/rollup/types.d.ts#L943-L956)

The current default generator reads `{ name, fileName }` for every output:

- `name` remains stable for `OutputChunk`;
- for `OutputAsset`, the implementation should prefer `names` and fall back to `name` for Rollup 2 and 3;
- one output asset may be associated with multiple names, so the contract must decide whether to create an entry for every name or select only the first, then lock that behavior with tests.

### 3.4 File names must be treated as opaque strings

Rollup 4 changed output hashes from hexadecimal to URL-safe Base64, and the current migration documentation describes the maximum hash length. A manifest plugin should not parse, validate, or assume a hash character set. It should pass through the final `fileName` from `bundle`. [Rollup 4 release](https://github.com/rollup/rollup/releases/tag/v4.0.0) · [Migration guide](https://rollupjs.org/migration/#general-changes)

After the Rollup 3 output-phase refactor, a file name may still contain a hash placeholder during `renderChunk`, but Rollup replaces it before `generateBundle`. The current hook location is therefore correct. [Migrating to Rollup 3](https://rollupjs.org/migration/#changes-to-the-plugin-api)

### 3.5 Output path safety

On 2026-02-22, Rollup 4.59.0, 3.30.0, and 2.80.0 added matching validation that rejects generated bundle paths that escape the output directory. [v4.59.0 changelog](https://github.com/rollup/rollup/blob/v4.62.3/CHANGELOG.md#4590) · [v3.30.0 release](https://github.com/rollup/rollup/releases/tag/v3.30.0) · [v2.80.0 changelog](https://github.com/rollup/rollup/blob/v2.80.0/CHANGELOG.md#2800)

This has two direct implications:

1. The default `fileName` must be treated as a path relative to the output and must reject absolute paths and `../` traversal.
2. The current `outputPath` can write a manifest outside the Rollup output. It cannot be migrated directly to `emitFile` with equivalent behavior. It should either become an explicit disk-writing escape hatch or be redefined or deprecated in the next major release; its behavior must not change silently.

## 4. Relevant breaking changes from Rollup 2 to 4

### Rollup 2.0.0

Relevant changes:

- the minimum Node version increased to 10;
- fully tree-shaken modules no longer appear in any `generateBundle` chunk;
- the `writeBundle` argument order changed to match `generateBundle`;
- legacy hooks such as `ongenerate` and `onwrite` were removed;
- directly adding properties to `bundle` was deprecated in favor of `this.emitFile`;
- `chunk.isAsset` was deprecated in favor of `chunk.type === "asset"`.

Source: [Rollup 2.0.0 release](https://github.com/rollup/rollup/releases/tag/v2.0.0).

The plugin already uses `generateBundle` and `bundle.type`, so its direction is correct here.

### Rollup 3.0.0

Relevant changes:

- the minimum Node version increased to 14.18;
- emitted assets lost `isAsset`;
- Rollup stopped adding `type: "asset"` to assets inserted directly into the bundle;
- with sourcemaps enabled, `.map` files appear as ordinary assets in the output bundle;
- the output hook order was refactored, and final hashed file names are resolved before `generateBundle`.

Sources: [Rollup 3.0.0 release](https://github.com/rollup/rollup/releases/tag/v3.0.0) · [Migrating to Rollup 3](https://rollupjs.org/migration/#migrating-to-rollup-3).

**Required test:** Decide whether the default filter should include `.map` assets when `sourcemap: true`. Ordinary sourcemap assets in Rollup 3 must not accidentally change the manifest contract.

### Rollup 4.0.0 through the current release

Relevant changes:

- the minimum Node version increased to 18;
- the default hash format changed to URL-safe Base64;
- Node builds introduced platform-specific native optional dependencies, with `@rollup/wasm-node` available for unsupported platforms;
- `this.resolve()` now defaults to `skipSelf: true`, assertions were renamed to attributes, and plugin `load` watch behavior changed, but this plugin does not currently use those APIs;
- the core `generateBundle` signature and its final-bundle semantics were not listed as breaking changes;
- Rollup 4.23 added `OutputAsset.names[]` and `originalFileNames[]`, placing the old singular fields on a deprecation path.

Sources: [Rollup 4.0.0 release](https://github.com/rollup/rollup/releases/tag/v4.0.0) · [Migrating to Rollup 4](https://rollupjs.org/migration/) · [v4.23.0 release](https://github.com/rollup/rollup/releases/tag/v4.23.0).

## 5. Recommended compatibility and verification matrix

### Tier 1: current tail release of each supported major

| Node | Rollup | Purpose |
| --- | --- | --- |
| 18 or later | 2.80.0 | Rollup 2 backport-tail compatibility |
| 18 or later | 3.30.0 | Rollup 3 backport-tail compatibility |
| 18 or later | 4.62.3 | Current mainline |

### Tier 2: viable lower bounds

| Node | Rollup | Purpose |
| --- | --- | --- |
| 18 | 2.20.0 | Verify the Rollup 2 peer-range lower bound and named-asset support |
| 18 | 3.0.0 | Verify the Rollup 3 peer-range lower bound |
| 18 | 4.0.0 | Verify the Rollup 4 peer-range lower bound |

The matrix should cover at least:

1. `output.dir` and `output.file`.
2. `bundle.generate()` returning a manifest asset without writing to disk.
3. `bundle.write()` writing normally.
4. Multiple outputs from one build without cross-output overwrites.
5. Chunks, assets, dynamic entries, and sourcemap assets.
6. Rollup 4 `asset.names[]` and the Rollup 2 and 3 `asset.name` fallback.
7. `isMerge` behavior for first use, existing files, invalid JSON, concurrency, and multiple outputs.
8. `fileName` subdirectories, conflicts, absolute paths, and `../` traversal.
9. External `outputPath` behavior and whether it remains a non-standard escape hatch.
10. Types and runtime behavior for custom `filter`, `map`, `sort`, `generate`, and `serialize`.

## 6. Recommended maintenance priorities

These priorities are project recommendations based on the findings above.

### P0: restore publication reliability

- Verify Rollup 2.20.0 / 2.80.0, 3.0.0 / 3.30.0, and 4.0.0 / 4.62.3 in CI.
- Add a Rollup peer dependency and Node engine declaration.
- Fix ESM/CJS exports so the README default import is directly callable, with separate `import` and `require` tests against the actual package artifacts.
- Remove `utility-types`. The project only uses its `NonUndefined<T>` type, which can be replaced by the built-in `NonNullable<T>` without copying a third-party implementation or leaving a public `.d.ts` dependency.
- Update TypeScript, the test framework, and the release process while keeping the plugin runtime small.
- Document the support matrix and exact tested versions in the README.

### P1: correct the output model

- Use `generateBundle + this.emitFile` for the default path.
- Support asset `names[]` with a `name` fallback for Rollup 2 and 3.
- Define multiple-output, generate/write, and sourcemap behavior.
- Validate that `fileName` remains within the output directory.

### P2: preserve or migrate legacy options deliberately

- Design `isMerge` and `outputPath` separately. Both depend on disk state and cannot be represented exactly as a standard in-memory asset. They require explicit documentation and migration policy.
- Place any historical semantic change in the next major release rather than silently shipping it in a patch or minor release.

## 7. Recommended disposition of existing issues and pull requests

| Item | Recommendation | Rationale |
| --- | --- | --- |
| [`TypeError: outputManifest is not a function`](https://github.com/shuizhongyueming/rollup-plugin-output-manifest/issues/21) | **P0: keep open, fix, then close** | The published ESM/CJS interoperability defect is reproducible, and the README default import does not reliably produce a function. Resolve it with separate entry points and `import` and `require` tests against the real package artifact. |
| [`Get Style in package.json`](https://github.com/shuizhongyueming/rollup-plugin-output-manifest/issues/6) | **P1: continue, but narrow the problem statement** | Version 2.0.0 added asset support and partially addressed the original request. Unnamed assets still require a custom `map`, and Rollup 4 adds `names[]`. Narrow this to the default asset-key selection and CSS coverage, then close the old issue after the defined behavior ships. |
| [`Not very usable for chunked output`](https://github.com/shuizhongyueming/rollup-plugin-output-manifest/issues/7) | **Close after documentation; do not change the default behavior for it** | The example does not configure hashes, so `dashboard.js -> dashboard.js` is expected. The default key is the Rollup chunk `name`, derived here from the `dashboard` input alias, not the source path. Existing `map` and `generate` hooks support custom keys, while the suggested `filter: () => true` does not address the requested key semantics. |
| [`tslib`](https://github.com/shuizhongyueming/rollup-plugin-output-manifest/issues/2) | **Keep closed** | The original defect was resolved. A modern build may remove `tslib` if TypeScript import helpers are no longer used, but the historical issue does not need to be reopened. |
| [`braces 3.0.3`](https://github.com/shuizhongyueming/rollup-plugin-output-manifest/pull/27) | **Close and supersede with the full toolchain upgrade** | It updates one transitive dependency in the old Yarn lockfile. Restoring maintenance will update the test toolchain and lockfile together, so merging this isolated 2024 bot pull request has little value. |

One additional P0 item has no corresponding product issue: remove `utility-types` and make the published `.d.ts` depend only on TypeScript built-in types. It should remain a clearly scoped maintenance task rather than being hidden inside Rollup compatibility work.

## Final assessment

This project is worth maintaining again, and compatibility with the latest Rollup has low technical risk. The `generateBundle` and `OutputBundle` APIs it relies on are broadly stable across Rollup 2, 3, and 4. The main work is modernizing package metadata, the test matrix, and the output mechanism—not rewriting the plugin.

The restored package should treat **Rollup 4 as the primary support line, with Rollup 2 and 3 retained as CI-backed compatibility lines**. With correct handling for `emitFile`, multiple asset names, multiple outputs, and path safety, all three Rollup generations can be supported at a reasonable maintenance cost.
