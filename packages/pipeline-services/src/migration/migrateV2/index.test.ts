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

it("should change all node paths to relative", () => {
  const v1 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 1,
        },
        nodes: [
          { app_data: { filename: "/user/niko/project/notebook.ipynb" } },
        ],
      },
    ],
  };
  const expected = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 2,
        },
        nodes: [{ app_data: { filename: "notebook.ipynb" } }],
      },
    ],
  };
  const actual = migrate(v1);
  expect(actual).toEqual(expected);
});

it("should handle missing node app_data", () => {
  const v1 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 1,
        },
        nodes: [{}],
      },
    ],
  };
  const expected = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 2,
        },
        nodes: [{}],
      },
    ],
  };
  const actual = migrate(v1);
  expect(actual).toEqual(expected);
});
