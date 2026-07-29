# Output Manifest Maintenance

This context names the compatibility and release concepts used while restoring `rollup-plugin-output-manifest` to active maintenance.

## Language

**Recovery release**:
The next backward-compatible release that restores trustworthy packaging, types, verification, and documented support without intentionally changing manifest semantics.
_Avoid_: Compatibility release, maintenance patch

**Semantic major**:
The later major release allowed to redefine output, asset naming, merge, and path behavior when compatibility would otherwise preserve a flawed contract.
_Avoid_: Rewrite, cleanup release

**Primary support line**:
The Rollup major version that drives current design and documentation decisions.
_Avoid_: Latest-only support

**Compatibility line**:
An older Rollup major version covered by an explicit peer range and continuously exercised in CI, without implying an upstream LTS commitment.
_Avoid_: Legacy support, LTS line

**Verified version**:
An exact Rollup version exercised by the project’s release gate; it is evidence for a compatibility claim, not a claim about every version in the same major.
_Avoid_: Supported version

**Output contract**:
The user-visible rules that determine which Rollup outputs enter a manifest, how keys and values are derived, and when and where the manifest is produced.
_Avoid_: Current behavior, manifest logic
