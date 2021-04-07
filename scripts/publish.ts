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
import fs from "fs";
import path from "path";

import pkg from "../package.json";
import { getOutput } from "./get-output";
import { printBanner } from "./print-utils";
import { createSafetyNet } from "./safety-net";

const ORG = "elyra-ai";
const REPO = "pipeline-editor";
const BUILD_PATH = "build";
const REPO_ROOT = path.join(BUILD_PATH, REPO);

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

const safeExec = createSafetyNet(execSync);
const safeRmdir = createSafetyNet(fs.rmdirSync);
const safeMkdir = createSafetyNet(fs.mkdirSync);

function getGitUserName() {
  return getOutput("git config user.name");
}

function getGitUserEmail() {
  return getOutput("git config user.email");
}

function ensureCleanDir(path: string) {
  safeRmdir(path, { recursive: true });
  safeMkdir(path);
}

function checkoutCode() {
  printBanner("Retrieving source code");

  ensureCleanDir(BUILD_PATH);

  const gitUserName = getGitUserName();
  const gitUserEmail = getGitUserEmail();

  safeExec(`git clone git@github.com:${ORG}/${REPO}.git ${REPO}`, {
    cwd: BUILD_PATH,
  });
  safeExec(`git config user.name ${gitUserName}`, {
    cwd: REPO_ROOT,
  });
  safeExec(`git config user.email ${gitUserEmail}`, {
    cwd: REPO_ROOT,
  });
}

function buildAndPublish() {
  printBanner("Building Packages");

  safeExec(`yarn install`, {
    cwd: REPO_ROOT,
    stdio: "ignore",
  });

  safeExec(`yarn build`, {
    cwd: REPO_ROOT,
  });

  printBanner("Publishing Packages");

  safeExec(
    `lerna publish --yes from-package --no-git-tag-version --no-verify-access --no-push`,
    {
      cwd: REPO_ROOT,
    }
  );
}

function tag() {
  const tag = `v${pkg.version}`;
  const message = `Version ${pkg.version}`;
  safeExec(`git tag -a ${tag} -m "${message}"`, {
    cwd: REPO_ROOT,
  });
  safeExec(`git push origin ${tag}`, {
    cwd: REPO_ROOT,
  });
}

function main() {
  checkoutCode();
  buildAndPublish();
  tag();
}

main();
