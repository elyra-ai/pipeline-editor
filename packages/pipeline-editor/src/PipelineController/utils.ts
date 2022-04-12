/*
 * Copyright 2018-2022 Elyra Authors
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

import path from "path";

interface Options {
  withExtension: boolean;
}

export function getFileName(file: string, { withExtension }: Options) {
  const extension = path.extname(file);
  return path.basename(file, withExtension ? undefined : extension);
}

export function nestedToPrefixed(app_data: { [key: string]: any }) {
  let current_parameters: any = {};

  const { component_parameters, globals, ...system } = app_data;
  for (const [key, val] of Object.entries(system)) {
    current_parameters[key] = val;
  }
  const nestedParameters = component_parameters ?? globals;
  if (nestedParameters) {
    for (const [key, val] of Object.entries(nestedParameters)) {
      current_parameters[`elyra_${key}`] = val;
    }
  }

  return current_parameters;
}

export function prefixedToNested(
  current_parameters: { [key: string]: any },
  global?: boolean
) {
  let app_data: any = global
    ? {
        globals: {},
      }
    : {
        component_parameters: {},
      };

  for (const [key, val] of Object.entries(current_parameters)) {
    if (key.startsWith("elyra_")) {
      const strippedKey = key.replace(/^elyra_/, "");
      if (global) {
        app_data.globals[strippedKey] = val;
      } else {
        app_data.component_parameters[strippedKey] = val;
      }
    } else {
      app_data[key] = val;
    }
  }

  return app_data;
}
