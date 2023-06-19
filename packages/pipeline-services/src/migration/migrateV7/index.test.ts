/*
 * Copyright 2018-2023 Elyra Authors
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

import produce from "immer";

import { ComponentNotFoundError } from "../errors";
import { mockPaletteV7 } from "../utils";
import rawMigrate from "./";

// wrap migrate functions in immer
const migrate = produce<any>((f: any, p: any) => rawMigrate(f, p));

it("should error with no palette", () => {
  const v6 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          runtime_type: "KUBEFLOW_PIPELINES",
          version: 6,
        },
        nodes: [
          {
            type: "execution_node",
            op: "elyra-kfp-examples-catalog:61e6f4141f65",
          },
        ],
      },
    ],
  };

  expect(() => migrate(v6)).toThrow(ComponentNotFoundError);
});

it("should update property format for OneOfControl", () => {
  const component_parameters = {
    data: {
      value: "parent-id",
      option: "output_name",
    },
    hash_algorithm: "some string",
  };

  const new_component_parameters = {
    data: {
      value: "parent-id",
      option: "output_name",
    },
    hash_algorithm: {
      activeControl: "StringControl",
      StringControl: "some string",
    },
  };

  const v6 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          runtime_type: "KUBEFLOW_PIPELINES",
          version: 6,
        },
        nodes: [
          {
            type: "execution_node",
            op: "elyra-kfp-examples-catalog:d68ec7fcdf46",
            app_data: {
              component_parameters,
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v6, mockPaletteV7);
  expect(actual.pipelines[0].nodes[0].app_data.component_parameters).toEqual(
    new_component_parameters
  );
});
