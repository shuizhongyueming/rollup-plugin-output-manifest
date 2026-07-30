import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const prototypeDirectory = path.dirname(fileURLToPath(import.meta.url));
const packageDirectory = path.join(prototypeDirectory, "package");
const fixtureDirectory = path.join(prototypeDirectory, "fixtures");
const temporaryDirectory = await mkdtemp(
  path.join(tmpdir(), "output-manifest-package-surface-"),
);
const consumerDirectory = path.join(temporaryDirectory, "consumer");
const npmEnvironment = {
  ...process.env,
  npm_config_cache: path.join(temporaryDirectory, "npm-cache"),
};

function run(command, args, cwd, options = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: npmEnvironment,
    ...options,
  });

  if (result.status !== 0) {
    process.stderr.write(result.stdout);
    process.stderr.write(result.stderr);
    throw new Error(`${command} ${args.join(" ")} failed`);
  }

  return result.stdout.trim();
}

try {
  const packOutput = run(
    "npm",
    ["pack", "--json", "--pack-destination", temporaryDirectory],
    packageDirectory,
  );
  const [{ filename }] = JSON.parse(packOutput);
  const tarball = path.join(temporaryDirectory, filename);
  console.log(`[1/5] Packed ${filename}`);

  await cp(path.join(fixtureDirectory, "consumer"), consumerDirectory, {
    recursive: true,
  });

  run(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--no-package-lock",
      "--no-save",
      tarball,
      path.join(fixtureDirectory, "rollup"),
    ],
    consumerDirectory,
  );
  console.log("[2/5] Installed the packed artifact into a clean consumer");

  run("node", ["esm-runtime.mjs"], consumerDirectory);
  console.log("[3/5] Direct ESM, named exports, `.default`, and `/src` passed");

  run("node", ["cjs-runtime.cjs"], consumerDirectory);
  console.log("[4/5] Direct CommonJS, named properties, `.default`, and `/src` passed");

  const compilerVersion = run("tsc", ["--version"], consumerDirectory);
  run("tsc", ["--project", "tsconfig.json"], consumerDirectory);
  run("tsc", ["--project", "tsconfig.legacy.json"], consumerDirectory);
  console.log(
    `[5/5] Conditional and legacy-resolver type consumers passed with ${compilerVersion}`,
  );

  const packageManifest = JSON.parse(
    await readFile(path.join(packageDirectory, "package.json"), "utf8"),
  );
  const result = {
    question: "Can one coherent package surface preserve every required access path?",
    verdict: "yes",
    directEsmDefault: "./dist/index.js",
    directCommonJsRequire: "./dist/index.cjs",
    conditionalTypes: ["./dist/index.d.mts", "./dist/index.d.cts"],
    legacyDefault: "the exported callable has a self-referential `.default` property",
    legacyDeepImport: packageManifest.exports["./src"],
    legacyResolverFallback: {
      typesVersions: packageManifest.typesVersions,
      directoryManifest: "./src/package.json",
      verifiedWith: "TypeScript node10 module resolution",
    },
    publishedSource: false,
    runtimeDependencies: Object.keys(packageManifest.dependencies ?? {}),
  };

  assert.deepEqual(result.runtimeDependencies, []);
  console.log(JSON.stringify(result, null, 2));
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
