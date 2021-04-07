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

import pkg from "../package.json";
import { getOutput } from "./get-output";
import { printBanner, printSpacer } from "./print-utils";

const ORG = "elyra-ai";
const REPO = "pipeline-editor";
const BRANCH = "master";

const COMMIT_FILTERS = [
  /prepare for next development iteration/i,
  /\(release\) v.*/,
];

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

function findUpstreamMaster() {
  const remotes = getOutput("git remote -v").split(/\r?\n/);

  for (const remote of remotes) {
    const [name, url, method] = remote.split(/\s/);

    const r = new RegExp(`${ORG}\\/${REPO}(\\.git)?$`);

    if (r.test(url) && method === "(push)") {
      return `${name}/${BRANCH}`;
    }
  }
  return undefined;
}

function findLatestTag() {
  return getOutput(`git describe --tags --abbrev=0 --match "v*"`);
}

function getCommits(commitRange: string) {
  return getOutput(`git log --pretty="%s" ${commitRange}`).split(/\r?\n/);
}

function formatCommits(commits: string[]) {
  return commits
    .filter((c) => {
      for (const filter of COMMIT_FILTERS) {
        if (filter.test(c)) {
          return false;
        }
      }
      return true;
    })
    .map((c) => {
      const r = /\(#(\d+)\)$/;
      return `- ${c.replace(
        r,
        `([#$1](https://github.com/${ORG}/${REPO}/pull/$1))`
      )}`;
    });
}

function main() {
  const args = process.argv.slice(2);
  let commitRange;
  if (args.length > 0) {
    commitRange = args.join(" ");
  } else {
    const latestTag = findLatestTag();
    if (latestTag === undefined) {
      console.error("Error: Unable to find the latest tag.");
      process.exit(1);
    }

    const upstream = findUpstreamMaster();
    if (upstream === undefined) {
      console.error("Error: Unable to find the upstream.");
      process.exit(1);
    }
    commitRange = `${latestTag}...${upstream}`;
  }

  console.log(`Comparing ${commitRange}`);

  const commits = getCommits(commitRange);
  const formattedCommits = formatCommits(commits);

  if (formattedCommits.length === 0) {
    console.error("Error: There has been no changes since last release.");
    process.exit(1);
  }

  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const changelog = `
## ${pkg.version} (${date})

High level enhancements
- TODO HIGHLIGHTS

Other enhancements and bug fixes
${formattedCommits.join("\n")}
  `;

  printBanner("Prepend the following to CHANGELOG.md");
  console.log(changelog);
  printSpacer();
}

main();
