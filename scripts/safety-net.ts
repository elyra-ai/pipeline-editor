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

const IS_DRY_RUN =
  process.argv.slice(2).findIndex((arg) => /--dry-{0,1}run/i.test(arg)) !== -1;

export function createSafetyNet<T extends (...args: any) => any>(cmd: T) {
  if (IS_DRY_RUN) {
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
