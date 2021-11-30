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

import produce from "immer";

import rawMigrate from "./";
import { mockPalette } from "../utils";

// wrap migrate functions in immer
const migrate = produce<any>((f: any, p: any) => rawMigrate(f, p));

it("should update old op name to new op name", () => {
  const v5 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 5,
        },
        nodes: [
          {
            type: "execution_node",
            op: "run_notebook_using_papermill_Runnotebookusingpapermill",
            app_data: {
              component_source: "",
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v5, mockPalette);
  expect(actual.pipelines[0].nodes[0].op).toEqual(
    "elyra-kfp-examples-catalog:61e6f4141f65"
  );
});

it("should not update op name if already new op name", () => {
  const v5 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 5,
        },
        nodes: [
          {
            type: "execution_node",
            op: "elyra-airflow-examples-catalog:3a55d015ea96",
            app_data: {},
          },
        ],
      },
    ],
  };

  const actual = migrate(v5, mockPalette);
  expect(actual.pipelines[0].nodes[0].op).toEqual(
    "elyra-airflow-examples-catalog:3a55d015ea96"
  );
});

it("should not update op name if not in update list", () => {
  const v5 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 5,
        },
        nodes: [
          {
            type: "execution_node",
            op: "some_op_name",
            app_data: {},
          },
        ],
      },
    ],
  };

  const actual = migrate(v5, mockPalette);
  expect(actual.pipelines[0].nodes[0].op).toEqual("some_op_name");
});

it("should not error if op not set", () => {
  const v5 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 5,
        },
        nodes: [
          {
            type: "execution_node",
            app_data: {},
          },
        ],
      },
    ],
  };

  const actual = migrate(v5, mockPalette);
  expect(actual.pipelines[0].nodes[0].op).toBeUndefined();
});

// TODO: Add test for runtime_type

// TODO: Add tests for component_ref

// TODO: Add tests for OneOfControl
