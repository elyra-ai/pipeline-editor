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

import { migrate } from "./";

it("should migrate v0 to latest", () => {
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

  const actual = migrate(v0);

  expect(actual).toMatchInlineSnapshot(`
    Object {
      "pipelines": Array [
        Object {
          "app_data": Object {
            "name": "title",
            "version": 3,
          },
          "nodes": Array [],
        },
      ],
    }
  `);
});

it("should migrate v0 to latest with missing app_data", () => {
  const v0 = {
    pipelines: [
      {
        nodes: [],
      },
    ],
  };

  const actual = migrate(v0);

  expect(actual).toMatchInlineSnapshot(`
    Object {
      "pipelines": Array [
        Object {
          "app_data": Object {
            "version": 3,
          },
          "nodes": Array [],
        },
      ],
    }
  `);
});

it("should migrate v1 to latest", () => {
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

  const actual = migrate(v1);

  expect(actual).toMatchInlineSnapshot(`
    Object {
      "pipelines": Array [
        Object {
          "app_data": Object {
            "name": "name",
            "version": 3,
          },
          "nodes": Array [
            Object {
              "app_data": Object {
                "filename": "notebook.ipynb",
              },
            },
          ],
        },
      ],
    }
  `);
});

it("should migrate v2 to latest", () => {
  const v2 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 2,
        },
        nodes: [],
      },
    ],
  };

  const actual = migrate(v2);

  expect(actual).toMatchInlineSnapshot(`
    Object {
      "pipelines": Array [
        Object {
          "app_data": Object {
            "name": "name",
            "version": 3,
          },
          "nodes": Array [],
        },
      ],
    }
  `);
});

it("should do nothing for latest version", () => {
  const latest = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 3,
        },
        nodes: [],
      },
    ],
  };

  const actual = migrate(latest);

  expect(actual).toEqual(latest);
});
