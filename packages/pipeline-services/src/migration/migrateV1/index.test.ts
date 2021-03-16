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

it("should rename `title` key to `name`", () => {
  const v0 = {
    pipelines: [
      {
        app_data: {
          title: "title",
        },
        nodes: [],
      },
    ],
  };
  const expected = {
    pipelines: [
      {
        app_data: {
          name: "title",
          version: 1,
        },
        nodes: [],
      },
    ],
  };
  const actual = migrate(v0);
  expect(actual).toEqual(expected);
});

it("should delete deprecated keys", () => {
  const v0 = {
    pipelines: [
      {
        app_data: {
          title: "title",
          export: "export",
          export_format: "export_format",
          export_path: "export_path",
        },
        nodes: [],
      },
    ],
  };
  const expected = {
    pipelines: [
      {
        app_data: {
          name: "title",
          version: 1,
        },
        nodes: [],
      },
    ],
  };
  const actual = migrate(v0);
  expect(actual).toEqual(expected);
});

it("should rename all node keys", () => {
  const v0 = {
    pipelines: [
      {
        app_data: {
          title: "title",
        },
        nodes: [
          {
            app_data: {
              artifact: "artifact",
              image: "image",
              vars: "vars",
              file_dependencies: "file_dependencies",
              recursive_dependencies: "recursive_dependencies",
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
          name: "title",
          version: 1,
        },
        nodes: [
          {
            app_data: {
              filename: "artifact",
              runtime_image: "image",
              env_vars: "vars",
              dependencies: "file_dependencies",
              include_subdirectories: "recursive_dependencies",
            },
          },
        ],
      },
    ],
  };
  const actual = migrate(v0);
  expect(actual).toEqual(expected);
});

it("should handle missing app_data for pipeline", () => {
  const v0 = {
    pipelines: [
      {
        nodes: [],
      },
    ],
  };
  const expected = {
    pipelines: [
      {
        app_data: {
          version: 1,
        },
        nodes: [],
      },
    ],
  };
  const actual = migrate(v0);
  expect(actual).toEqual(expected);
});

it("should handle missing app_data for nodes", () => {
  const v0 = {
    pipelines: [
      {
        app_data: {
          title: "title",
        },
        nodes: [{}],
      },
    ],
  };
  const expected = {
    pipelines: [
      {
        app_data: {
          name: "title",
          version: 1,
        },
        nodes: [{}],
      },
    ],
  };
  const actual = migrate(v0);
  expect(actual).toEqual(expected);
});
