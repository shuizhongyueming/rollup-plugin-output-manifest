# THROWAWAY PROTOTYPE: package surface

This prototype answers one question:

> Can one minimal package layout support direct ESM imports, direct CommonJS
> `require`, named helpers, the historical `.default` workaround, TypeScript
> consumers, and the historical `/src` deep import without publishing the
> TypeScript source?

It models generated artifacts only. It is not production code and must not be
merged into the maintained branch.

Run it from the repository root:

```sh
npm --prefix packages/main/prototype-package-surface run prototype
```

The verifier packs the model package, installs the tarball and a local Rollup
type stub into a temporary consumer, runs ESM and CommonJS checks, compiles ESM
and CommonJS TypeScript consumers, prints the resulting package-surface state,
and removes the temporary directory.
