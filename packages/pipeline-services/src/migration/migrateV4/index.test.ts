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

import migrate from "./";

it("should only bump version", () => {
  const v3 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 3,
        },
        nodes: [
          {
            app_data: {
              filename: "notebook.ipynb",
              ui_data: {
                label: "node label",
              },
            },
          },
        ],
      },
      {
        nodes: [
          {
            app_data: {
              filename: "notebook2.ipynb",
              ui_data: {
                label: "node label 2",
              },
            },
          },
        ],
      },
    ],
  };
  const expected = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 4,
        },
        nodes: [
          {
            app_data: {
              label: "node label",
              component_parameters: {
                filename: "notebook.ipynb",
              },
              ui_data: {
                label: "node label",
              },
            },
          },
        ],
      },
      {
        nodes: [
          {
            app_data: {
              label: "node label 2",
              component_parameters: {
                filename: "notebook2.ipynb",
              },
              ui_data: {
                label: "node label 2",
              },
            },
          },
        ],
      },
    ],
  };
  const actual = migrate(v3);
  expect(actual).toEqual(expected);
});
