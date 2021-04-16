/*
 * Copyright 2018-2021 Elyra Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { execSync } from "child_process";

import semver from "semver";

import pkg from "../package.json";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

function generateVersion(
  bump:
    | "major"
    | "minor"
    | "patch"
    | "premajor"
    | "preminor"
    | "prepatch"
    | "prerelease"
    | "graduate"
) {
  if (bump === "graduate") {
    const v = semver.parse(pkg.version);
    if (v === null) {
      console.error("Error: Invalid package version.");
      process.exit(1);
    }
    return `${v.major}.${v.minor}.${v.patch}`;
  }

  const newVersion = semver.inc(pkg.version, bump, "rc");
  if (newVersion === null) {
    console.error("Error: Invalid package version.");
    process.exit(1);
  }
  return newVersion;
}

function main() {
  const [bump] = process.argv.slice(2);

  let nextVersion;
  switch (bump) {
    case "major":
    case "minor":
    case "patch":
    case "premajor":
    case "preminor":
    case "prepatch":
    case "prerelease":
    case "graduate":
      nextVersion = generateVersion(bump);
      break;
    default:
      const v = semver.valid(bump);
      if (v === null) {
        console.error("Error: Invalid version bump.");
        process.exit(1);
      }
      nextVersion = v;
  }

  execSync(
    `lerna version ${nextVersion} --no-git-tag-version --no-push --yes`,
    { stdio: "ignore" }
  );
  execSync(`yarn version --new-version ${nextVersion} --no-git-tag-version`, {
    stdio: "ignore",
  });
}

main();
