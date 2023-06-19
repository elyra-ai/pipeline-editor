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

it("should move all properties to component_parameters", () => {
  const properties = {
    filename: "notebook.ipynb",
    random: 42,
    boolean: false,
  };

  const v3 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 3,
        },
        nodes: [
          {
            type: "execution_node",
            app_data: {
              ...properties,
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v3);
  expect(actual.pipelines[0].nodes[0].app_data.component_parameters).toEqual(
    properties
  );
});

it("should create a new label property based off of ui_data label", () => {
  const expectedLabel = "ui_data label example";
  const v3 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 3,
        },
        nodes: [
          {
            type: "execution_node",
            app_data: {
              filename: "should-not-be-used.ipynb",
              ui_data: {
                label: expectedLabel,
              },
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v3);

  expect(actual.pipelines[0].nodes[0].app_data.label).toEqual(expectedLabel);
});

it("should migrate nodes that are not part of the default pipeline", () => {
  const v3 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 3,
        },
        nodes: [
          {
            type: "execution_node",
            app_data: {
              subflow1: "value1",
            },
          },
        ],
      },
      {
        nodes: [
          {
            type: "execution_node",
            app_data: {
              subflow2: "value2",
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v3);

  expect(actual.pipelines[0].nodes[0].app_data.component_parameters).toEqual({
    subflow1: "value1",
  });
  expect(actual.pipelines[1].nodes[0].app_data.component_parameters).toEqual({
    subflow2: "value2",
  });
});

it("should not effect old ui_data", () => {
  const ui_data = {
    label: "hello",
    x_pos: 100,
    y_pos: 56,
    fake: false,
  };

  const v3 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 3,
        },
        nodes: [
          {
            type: "execution_node",
            app_data: {
              prop1: "value1",
              prop2: "value2",
              ui_data,
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v3);

  expect(actual.pipelines[0].nodes[0].app_data.ui_data).toEqual(ui_data);
});

it("should not effect not update non-execution nodes", () => {
  const supernode = {
    type: "super_node",
    app_data: {
      ui_data: {
        label: "Supernode Label",
      },
    },
  };

  const v3 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 3,
        },
        nodes: [supernode],
      },
    ],
  };

  const actual = migrate(v3);

  expect(actual.pipelines[0].nodes[0]).toEqual(supernode);
});
