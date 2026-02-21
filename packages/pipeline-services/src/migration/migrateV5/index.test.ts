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

import rawMigrate from "./";

// wrap migrate functions in immer
const migrate = produce<any>((d: any) => rawMigrate(d));

it("should update old op name to new op name", () => {
  const v4 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 4,
        },
        nodes: [
          {
            type: "execution_node",
            op: "run-notebook-using-papermill",
            app_data: {},
          },
        ],
      },
    ],
  };

  const actual = migrate(v4);
  expect(actual.pipelines[0].nodes[0].op).toBe(
    "run_notebook_using_papermill_Runnotebookusingpapermill"
  );
});

it("should not update op name if already new op name", () => {
  const v4 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 4,
        },
        nodes: [
          {
            type: "execution_node",
            op: "filter_text_using_shell_and_grep_Filtertext",
            app_data: {},
          },
        ],
      },
    ],
  };

  const actual = migrate(v4);
  expect(actual.pipelines[0].nodes[0].op).toBe(
    "filter_text_using_shell_and_grep_Filtertext"
  );
});

it("should not update op name if not in update list", () => {
  const v4 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 4,
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

  const actual = migrate(v4);
  expect(actual.pipelines[0].nodes[0].op).toBe("some_op_name");
});

it("should not error if op not set", () => {
  const v4 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 4,
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

  const actual = migrate(v4);
  expect(actual.pipelines[0].nodes[0].op).toBeUndefined();
});
