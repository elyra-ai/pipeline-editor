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

import yargs from "yargs";
import yargsParser from "yargs-parser";

import pkg from "../package.json";
import { printBanner, printSpacer, printValue } from "./print-utils";

const DEFAULT_GIT_URL = "git@github.com:elyra-ai/pipeline-editor.git";
const DEFAULT_BUILD_DIR = "build/release";

interface Args {
  version: string;
  devVersion?: string;
  rc?: string;
}

interface Config {
  gitUrl: string;
  gitUserName: string;
  gitUserEmail: string;
  baseDir: string;
  workDir: string;
  sourceDir: string;
  oldVersion: string;
  newVersion: string;
  rc?: string;
  devVersion: string;
  tag: string;
}

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

const { dryRun } = yargsParser(process.argv.slice(2));

function createSafe<T extends (...args: any) => any>(
  cmd: T,
  { dryRun }: { dryRun: boolean }
) {
  if (dryRun === true) {
    return (...[arg0, arg1]: Parameters<T>) => {
      let commandString = `${cmd.name}(\`${arg0}\`)`;

      if (arg1 !== undefined) {
        commandString = `${cmd.name}(\`${arg0}\`, ${JSON.stringify(
          arg1,
          null,
          2
        )})`;
      }

      console.log();
      for (const line of commandString.split("\n")) {
        console.log(`> ${line}`);
      }
      console.log();
    };
  }

  return cmd;
}

const safeExec = createSafe(execSync, { dryRun });
const safeRmdir = createSafe(fs.rmdirSync, { dryRun });
const safeMkdir = createSafe(fs.mkdirSync, { dryRun });

function getOutput(command: string) {
  return execSync(command).toString("utf-8").trim();
}

function getGitUserName() {
  return getOutput("git config user.name");
}

function getGitUserEmail() {
  return getOutput("git config user.email");
}

/**
 * Returns true if a command exists on the system
 */
function ensureDependency(command: string, installUrl: string) {
  try {
    execSync(`which ${command}`, { stdio: "ignore" });
  } catch {
    throw new Error(`Please install ${command} ${installUrl}`);
  }
}

/**
 * Error if a dependency is missing or invalid
 */
function validateDependencies() {
  ensureDependency("git", "https://git-scm.com/downloads/");
  ensureDependency("node", "https://nodejs.org/");
  ensureDependency("yarn", "https://classic.yarnpkg.com/");
}

function initializeConfig(args: Args) {
  if (args === undefined) {
    throw Error("Invalid command line arguments");
  }

  return {
    gitUrl: DEFAULT_GIT_URL,
    gitHash: "HEAD",
    gitUserName: getGitUserName(),
    gitUserEmail: getGitUserEmail(),
    baseDir: process.cwd(),
    workDir: path.join(process.cwd(), DEFAULT_BUILD_DIR),
    sourceDir: path.join(process.cwd(), DEFAULT_BUILD_DIR, "pipeline-editor"),
    oldVersion: pkg.version,
    newVersion:
      args.rc === undefined || Number.isInteger(args.rc) === false
        ? args.version
        : `${args.version}-rc.${args.rc}`,
    rc: args.rc,
    devVersion: `${args.devVersion}-dev`,
    tag:
      args.rc === undefined || Number.isInteger(args.rc) === false
        ? `v${args.version}`
        : `v${args.version}rc${args.rc}`,
  };
}

function printConfig(config: Config) {
  printBanner("Release configuration");
  printValue("Git URL", config.gitUrl);
  printValue("Git user", config.gitUserName);
  printValue("Git user email", config.gitUserEmail);
  printValue("Work dir", config.workDir);
  printValue("Source dir", config.sourceDir);
  printValue("Old Version", config.oldVersion);
  printValue("New Version", config.newVersion);

  if (config.rc !== undefined) {
    printValue("RC number", config.rc);
  }

  printValue("Dev Version", config.devVersion);
  printValue("Release Tag", config.tag);
  printSpacer();
}

function checkoutCode(config: Config) {
  printBanner("Retrieving source code");

  console.log(`Cloning repository: ${config.gitUrl}`);

  console.log(`Removing working directory: ${config.workDir}`);
  safeRmdir(config.workDir, { recursive: true });

  console.log(`Creating working directory: ${config.workDir}`);
  safeMkdir(config.workDir);

  console.log(`Cloning : ${config.gitUrl} to ${config.workDir}`);
  safeExec(["git", "clone", config.gitUrl].join(" "), {
    cwd: config.workDir,
  });
  safeExec(["git", "config", "user.name", config.gitUserName].join(" "), {
    cwd: config.sourceDir,
  });
  safeExec(["git", "config", "user.email", config.gitUserEmail].join(" "), {
    cwd: config.sourceDir,
  });
}

function version(version: string, { sourceDir }: Config) {
  try {
    safeExec(
      [
        "lerna",
        "version",
        version,
        "--no-git-tag-version",
        "--no-push",
        "--yes",
      ].join(" "),
      { cwd: sourceDir }
    );
    safeExec(
      [
        "yarn",
        "version",
        "--new-version",
        version,
        "--no-git-tag-version",
      ].join(" "),
      { cwd: sourceDir }
    );
  } catch {
    throw new Error(
      "Error if the old version is invalid or cannot be found, or if there's a duplicate version"
    );
  }
}

function buildAndPublishNpmPackages(config: Config) {
  printBanner("Building NPM Packages");

  safeExec(["yarn", "install"].join(" "), {
    cwd: config.sourceDir,
    stdio: "ignore",
  });

  safeExec(["yarn", "build"].join(" "), {
    cwd: config.sourceDir,
  });

  printBanner("Pushing Release and Tag to git");

  // push release and tags to git
  console.log();
  console.log("Pushing release to git");
  safeExec(["git", "push"].join(" "), {
    cwd: config.sourceDir,
  });
  console.log("Pushing release tag to git");
  safeExec(["git", "push", "--tags"].join(" "), {
    cwd: config.sourceDir,
  });

  printBanner("Pushing npm packages");

  // publish npm packages
  console.log();
  console.log("publishing npm packages");
  safeExec(
    [
      "lerna",
      "publish",
      "--yes",
      "from-package",
      "--no-git-tag-version",
      "--no-verify-access",
      "--no-push",
    ].join(" "),
    {
      cwd: config.sourceDir,
    }
  );
}
/**
 * Prepare a release
 */
function release(config: Config) {
  console.log(
    `Processing release from ${config.oldVersion} to ${config.newVersion}`
  );
  console.log();

  // clone repository
  checkoutCode(config);

  // Update to new release version
  version(config.newVersion, config);
  // commit and tag
  safeExec(
    ["git", "commit", "-a", "-m", `"Release v${config.newVersion}"`].join(" "),
    { cwd: config.sourceDir }
  );
  safeExec(["git", "tag", config.tag].join(" "), { cwd: config.sourceDir });

  // build and publish npm packages
  buildAndPublishNpmPackages(config);
  // back to development
  version(config.devVersion, config);
  // commit
  safeExec(
    [
      "git",
      "commit",
      "-a",
      "-m",
      `"Prepare for next development iteration"`,
    ].join(" "),
    { cwd: config.sourceDir }
  );
}

/**
 * Perform necessary tasks to create and/or publish a new release
 */
function main(args: Args) {
  try {
    // Validate all pre-requisites are available
    validateDependencies();

    // Generate release config based on the provided arguments
    const config = initializeConfig(args);
    printConfig(config);

    release(config);
  } catch (e) {
    throw new Error(`Error performing release ${args.version}`);
  }
}

yargs(process.argv.slice(2))
  .command({
    command: "$0",
    describe: `DESCRIPTION
    Creates Elyra release based on git commit hash or from HEAD.
    
    yarn release --version 1.3.0 --dev-version 1.4.0 [--rc 0]
    This will prepare a release candidate, build it locally and push the changes to a branch for review.  
    
    Required software dependencies for building and publishing a release:
     - Git
     - Node
     - Yarn
     
     Required configurations for publishing a release:
     - GPG with signing key configured
     `,
    builder: (b) =>
      b.options({
        "dry-run": {
          default: false,
          describe:
            "If true, the script will not have any permanent side-effects.",
          type: "boolean",
        },
        version: {
          type: "string",
          describe: "the new release version",
          demandOption: true,
        },
        "dev-version": {
          type: "string",
          describe: "the new development version",
          demandOption: true,
        },
        rc: { type: "string", describe: "the release candidate number" },
      }),
    handler: main,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
