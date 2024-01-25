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

  const actual = migrate(v5, mockPaletteV7);
  expect(actual.pipelines[0].nodes[0].op).toBe(
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

  const actual = migrate(v5, mockPaletteV7);
  expect(actual.pipelines[0].nodes[0].op).toBe(
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

  const actual = migrate(v5, mockPaletteV7);
  expect(actual.pipelines[0].nodes[0].op).toBe("some_op_name");
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

  const actual = migrate(v5, mockPaletteV7);
  expect(actual.pipelines[0].nodes[0].op).toBeUndefined();
});

it("should switch from runtime to runtime_type - kfp", () => {
  const v5 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          runtime: "kfp",
          version: 5,
        },
        nodes: [],
      },
    ],
  };

  const actual = migrate(v5, mockPaletteV7);
  expect(actual.pipelines[0].app_data.runtime_type).toBe("KUBEFLOW_PIPELINES");
});

it("should switch from runtime to runtime_type - airflow", () => {
  const v5 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          runtime: "airflow",
          version: 5,
        },
        nodes: [],
      },
    ],
  };

  const actual = migrate(v5, mockPaletteV7);
  expect(actual.pipelines[0].app_data.runtime_type).toBe("APACHE_AIRFLOW");
});

it("should switch from runtime to runtime_type - other", () => {
  const v5 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          runtime: "generic",
          version: 5,
        },
        nodes: [],
      },
    ],
  };

  const actual = migrate(v5, mockPaletteV7);
  expect(actual.pipelines[0].app_data.runtime_type).toBeUndefined();
});

it("should switch from runtime to runtime_type - undefined", () => {
  const v5 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 5,
        },
        nodes: [],
      },
    ],
  };

  const actual = migrate(v5, mockPaletteV7);
  expect(actual.pipelines[0].app_data.runtime_type).toBeUndefined();
});

it("should update component_source to new format", () => {
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
              component_source: "some/path/to/component_source.py",
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v5, mockPaletteV7);
  expect(actual.pipelines[0].nodes[0].app_data.component_source).toBe(
    '{"catalog_type":"elyra-kfp-examples-catalog","component_ref":{"component-id":"component_source.py"}}'
  );
});

it("should update component_source to new format with generic filename", () => {
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
            op: "component_Downloaddata",
            app_data: {
              component_source: "component.yaml",
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v5, mockPaletteV7);
  expect(actual.pipelines[0].nodes[0].app_data.component_source).toBe(
    '{"catalog_type":"elyra-kfp-examples-catalog","component_ref":{"component-id":"download_data.yaml"}}'
  );
});

it("should not update component_source if op is not updated", () => {
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
            app_data: {
              component_source: "some/path/to/component_source.py",
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v5, mockPaletteV7);
  expect(actual.pipelines[0].nodes[0].app_data.component_source).toBe(
    "some/path/to/component_source.py"
  );
});

it("should error with no palette", () => {
  const v5 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          runtime: "airflow",
          version: 5,
        },
        nodes: [
          {
            type: "execution_node",
            op: "http_operator_SimpleHttpOperator",
            app_data: {
              component_source: "some/path/to/component_source.py",
            },
          },
        ],
      },
    ],
  };

  expect(() => migrate(v5)).toThrow(ComponentNotFoundError);
});

it("should update property format for OneOfControl", () => {
  const component_parameters = {
    conn_id: "test_string",
    total_executor_cores: 42,
    verbose: true,
  };

  const new_component_parameters = {
    conn_id: {
      activeControl: "StringControl",
      StringControl: "test_string",
    },
    total_executor_cores: {
      activeControl: "NumberControl",
      NumberControl: 42,
    },
    verbose: {
      activeControl: "BooleanControl",
      BooleanControl: true,
    },
  };

  const v5 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          runtime: "airflow",
          version: 5,
        },
        nodes: [
          {
            type: "execution_node",
            op: "spark_sql_operator_SparkSqlOperator",
            app_data: {
              component_parameters,
              component_source: "some/path/to/component_source.py",
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v5, mockPaletteV7);
  expect(actual.pipelines[0].nodes[0].app_data.component_parameters).toEqual(
    new_component_parameters
  );
});

it("should not update property format for kfp controls", () => {
  const component_parameters = {
    notebook: {
      value: "parent",
      option: "output",
    },
    parameters: "some string",
    some_value: "string",
  };

  const v5 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          runtime: "kfp",
          version: 5,
        },
        nodes: [
          {
            type: "execution_node",
            op: "run_notebook_using_papermill_Runnotebookusingpapermill",
            app_data: {
              component_parameters,
              component_source: "some/path/to/component_source.py",
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v5, mockPaletteV7);
  expect(actual.pipelines[0].nodes[0].app_data.component_parameters).toEqual(
    component_parameters
  );
});
