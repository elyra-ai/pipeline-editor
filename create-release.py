#!/usr/bin/env python3
#
# Copyright 2018-2021 Elyra Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import argparse
import json
import os
import shutil
import subprocess
import sys

from types import SimpleNamespace

config: SimpleNamespace

VERSION_REG_EX = r"(?P<major>\d+)\.(?P<minor>\d+)\.(?P<patch>\d+)(\.(?P<pre_release>[a-z]+)(?P<build>\d+))?"

DEFAULT_GIT_URL = 'git@github.com:elyra-ai/pipeline-editor.git'
DEFAULT_BUILD_DIR = 'build/release'


class DependencyException(Exception):
    """Error if dependency is missing"""


class MissingReleaseArtifactException(Exception):
    """Error if an artifact being released is not available"""


class UpdateVersionException(Exception):
    """Error if the old version is invalid or cannot be found, or if there's a duplicate version"""


def check_run(args, cwd=os.getcwd(), capture_output=True, env=None, shell=False) -> subprocess.CompletedProcess:
    try:
        return subprocess.run(args, cwd=cwd, capture_output=capture_output, check=True)
    except subprocess.CalledProcessError as ex:
        raise RuntimeError(f'Error executing process: {ex.stderr.decode("unicode_escape")}') from ex


def check_output(args, cwd=os.getcwd(), env=None, shell=False) -> str:
    response = check_run(args, cwd, capture_output=True, env=env, shell=shell)
    return response.stdout.decode('utf-8').replace('\n', '')


def dependency_exists(command) -> bool:
    """Returns true if a command exists on the system"""
    try:
        check_run(["which", command])
    except:
        return False

    return True


def sed(file: str, pattern: str, replace: str) -> None:
    """Perform regex substitution on a given file"""
    try:
        check_run(["sed", "-i", "", "-e", f"s#{pattern}#{replace}#g", file], capture_output=False)
    except Exception as ex:
        raise RuntimeError(f'Error processing updated to file {file}: ') from ex


def validate_dependencies() -> None:
    """Error if a dependency is missing or invalid"""
    if not dependency_exists("git"):
        raise DependencyException('Please install git https://git-scm.com/downloads')
    if not dependency_exists("node"):
        raise DependencyException('Please install node.js https://nodejs.org/')
    if not dependency_exists("yarn"):
        raise DependencyException("Please install yarn https://classic.yarnpkg.com/")
    if not dependency_exists("twine"):
        raise DependencyException("Please install twine https://twine.readthedocs.io/en/latest/#installation")


def validate_environment() -> None:
    """Validate environment configurations are valid"""
    pass


def update_version_to_release() -> None:
    global config

    new_version = config.new_version

    try:
        check_run(["lerna", "version", new_version, "--no-git-tag-version", "--no-push", "--yes"], cwd=config.source_dir)
        check_run(["yarn", "version", "--new-version", new_version, "--no-git-tag-version"], cwd=config.source_dir)

    except Exception as ex:
        raise UpdateVersionException from ex


def _source(file: str) -> str:
    global config

    return os.path.join(config.source_dir, file)


def checkout_code() -> None:
    global config

    print("-----------------------------------------------------------------")
    print("-------------------- Retrieving source code ---------------------")
    print("-----------------------------------------------------------------")

    print(f'Cloning repository: {config.git_url}')
    if os.path.exists(config.work_dir):
        print(f'Removing working directory: {config.work_dir}')
        shutil.rmtree(config.work_dir)
    print(f'Creating working directory: {config.work_dir}')
    os.makedirs(config.work_dir)
    print(f'Cloning : {config.git_url} to {config.work_dir}')
    check_run(['git', 'clone', config.git_url], cwd=config.work_dir)
    check_run(['git', 'config', 'user.name', config.git_user_name], cwd=config.source_dir)
    check_run(['git', 'config', 'user.email', config.git_user_email], cwd=config.source_dir)

    print('')


def build_and_publish_npm_packages() -> None:
    global config

    print("-----------------------------------------------------------------")
    print("--------------------- Building NPM Packages ---------------------")
    print("-----------------------------------------------------------------")

    check_run(["make", "clean", "install"], cwd=config.source_dir, capture_output=False)

    print("-----------------------------------------------------------------")
    print("-------------------- Pushing npm packages -----------------------")
    print("-----------------------------------------------------------------")

    # publish npm packages
    print()
    print(f'publishing npm packages')
    check_run(['lerna', 'publish', '--yes', 'from-package', '--no-git-tag-version', '--no-verify-access', '--no-push'], cwd=config.source_dir)
    check_run(['make', 'lint'], cwd=config.source_dir)


def publish_git_release() -> None:
    global config

    print("-----------------------------------------------------------------")
    print("--------------- Pushing Release and Tag to git ------------------")
    print("-----------------------------------------------------------------")

    # push release and tags to git
    print()
    print('Pushing release to git')
    check_run(['git', 'push'], cwd=config.source_dir)
    print('Pushing release tag to git')
    check_run(['git', 'push', '--tags'], cwd=config.source_dir)


def release() -> None:
    """
    Prepare a release
    """
    global config
    print(f'Processing release from {config.old_version} to {config.new_version} ')
    print('')

    # clone repository
    checkout_code()
    # Update to new release version
    update_version_to_release()
    # commit and tag
    check_run(['git', 'commit', '-a', '-m', f'Release v{config.new_version}'], cwd=config.source_dir)
    check_run(['git', 'tag', config.tag], cwd=config.source_dir)
    # build and publish npm packages
    build_and_publish_npm_packages()
    # publish git changes
    publish_git_release()


def initialize_config(args=None) -> SimpleNamespace:
    if not args:
        raise ValueError("Invalid command line arguments")

    with open('package.json') as f:
        package_json = json.load(f)

    v = package_json['version']

    configuration = {
        'git_url': DEFAULT_GIT_URL,
        'git_hash': 'HEAD',
        'git_user_name': check_output(['git', 'config', 'user.name']),
        'git_user_email': check_output(['git', 'config', 'user.email']),
        'base_dir': os.getcwd(),
        'work_dir': os.path.join(os.getcwd(), DEFAULT_BUILD_DIR),
        'source_dir': os.path.join(os.getcwd(), DEFAULT_BUILD_DIR, 'pipeline-editor'),
        'old_version': v,
        'new_version': args.version if not args.rc or not str.isdigit(args.rc) else f'{args.version}-rc.{args.rc}',
        'rc': args.rc,
        'tag': f'v{args.version}' if not args.rc or not str.isdigit(args.rc) else f'v{args.version}rc{args.rc}'
    }

    global config
    config = SimpleNamespace(**configuration)


def print_config() -> None:
    global config
    print('')
    print("-----------------------------------------------------------------")
    print("--------------------- Release configuration ---------------------")
    print("-----------------------------------------------------------------")
    print(f'Git URL \t\t -> {config.git_url}')
    print(f'Git reference \t\t -> {config.git_hash}')
    print(f'Git user \t\t -> {config.git_user_name}')
    print(f'Git user email \t\t -> {config.git_user_email}')
    print(f'Work dir \t\t -> {config.work_dir}')
    print(f'Source dir \t\t -> {config.source_dir}')
    print(f'Current Version \t -> {config.old_version}')
    print(f'New Version \t\t -> {config.new_version}')
    if config.rc is not None:
        print(f'RC number \t\t -> {config.rc}')
    print(f'Release Tag \t\t -> {config.tag}')
    print("-----------------------------------------------------------------")
    print('')


def print_help() -> str:
    return (
    """create-release.py --version VERSION
    
    DESCRIPTION
    Creates Pipeline-Editor release based on git commit hash or from HEAD.
    
    create-release.py --version 1.3.0 [--rc 0]
    This form will prepare a release, build its artifacts and publish

    Required software dependencies for building and publishing a release:
     - Git
     - Node
     - Twine
     - Yarn
     
     Required configurations for publishing a release:
     - GPG with signing key configured

    """
    )


def main(args=None):
    """Perform necessary tasks to create and/or publish a new release"""
    parser = argparse.ArgumentParser(usage=print_help())
    parser.add_argument('--version', help='the new release version', type=str, required=True)
    parser.add_argument('--rc', help='the release candidate number', type=str, required=False, )
    args = parser.parse_args()

    global config
    try:
        # Validate all pre-requisites are available
        validate_dependencies()
        validate_environment()

        # Generate release config based on the provided arguments
        initialize_config(args)
        print_config()

        release()

    except Exception as ex:
        raise RuntimeError(f'Error performing release {args.version}') from ex


if __name__ == "__main__":
    main()
