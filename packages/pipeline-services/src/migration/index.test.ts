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
import { mockPalette } from "./utils";

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

  const actual = migrate(v0, mockPalette);

  expect(actual).toMatchInlineSnapshot(`
    Object {
      "pipelines": Array [
        Object {
          "app_data": Object {
            "name": "title",
            "runtime_type": undefined,
            "version": 6,
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

  const actual = migrate(v0, mockPalette);

  expect(actual).toMatchInlineSnapshot(`
    Object {
      "pipelines": Array [
        Object {
          "app_data": Object {
            "runtime_type": undefined,
            "version": 6,
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
          {
            type: "execution_node",
            app_data: { filename: "/user/niko/project/notebook.ipynb" },
          },
        ],
      },
    ],
  };

  const actual = migrate(v1, mockPalette);

  expect(actual).toMatchInlineSnapshot(`
    Object {
      "pipelines": Array [
        Object {
          "app_data": Object {
            "name": "name",
            "runtime_type": undefined,
            "version": 6,
          },
          "nodes": Array [
            Object {
              "app_data": Object {
                "component_parameters": Object {
                  "filename": "notebook.ipynb",
                },
                "label": "",
                "ui_data": Object {},
              },
              "type": "execution_node",
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

  const actual = migrate(v2, mockPalette);

  expect(actual).toMatchInlineSnapshot(`
    Object {
      "pipelines": Array [
        Object {
          "app_data": Object {
            "name": "name",
            "runtime_type": undefined,
            "version": 6,
          },
          "nodes": Array [],
        },
      ],
    }
  `);
});

it("should migrate v3 to latest", () => {
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
            type: "execution_node",
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

  const actual = migrate(v3, mockPalette);

  expect(actual).toMatchInlineSnapshot(`
    Object {
      "pipelines": Array [
        Object {
          "app_data": Object {
            "name": "name",
            "runtime_type": undefined,
            "version": 6,
          },
          "nodes": Array [
            Object {
              "app_data": Object {
                "component_parameters": Object {
                  "filename": "notebook.ipynb",
                },
                "label": "node label",
                "ui_data": Object {
                  "label": "node label",
                },
              },
              "type": "execution_node",
            },
          ],
        },
        Object {
          "nodes": Array [
            Object {
              "app_data": Object {
                "component_parameters": Object {
                  "filename": "notebook2.ipynb",
                },
                "label": "node label 2",
                "ui_data": Object {
                  "label": "node label 2",
                },
              },
              "type": "execution_node",
            },
          ],
        },
      ],
    }
  `);
});

it("should migrate v4 to latest", () => {
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
            app_data: {
              component_source: "kfp/run_notebook_using_papermill.yaml",
            },
          },
          {
            type: "execution_node",
            op: "filter_text_using_shell_and_grep_Filtertext",
            app_data: {
              component_source: "kfp/filter_text_using_shell_and_grep.yaml",
            },
          },
          {
            type: "execution_node",
            op: "some_op",
            app_data: {},
          },
        ],
      },
      {
        nodes: [
          {
            type: "execution_node",
            op: "slack-operator_SlackAPIPostOperator",
            app_data: {
              component_source: "airflow/slack_operator.py",
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v4, mockPalette);

  expect(actual).toMatchInlineSnapshot(`
    Object {
      "pipelines": Array [
        Object {
          "app_data": Object {
            "name": "name",
            "runtime_type": undefined,
            "version": 6,
          },
          "nodes": Array [
            Object {
              "app_data": Object {
                "component_source": "{\\"catalog_type\\":\\"elyra-kfp-examples-catalog\\",\\"component_ref\\":{\\"component-id\\":\\"run_notebook_using_papermill.yaml\\"}}",
              },
              "op": "elyra-kfp-examples-catalog:61e6f4141f65",
              "type": "execution_node",
            },
            Object {
              "app_data": Object {
                "component_source": "{\\"catalog_type\\":\\"elyra-kfp-examples-catalog\\",\\"component_ref\\":{\\"component-id\\":\\"filter_text_using_shell_and_grep.yaml\\"}}",
              },
              "op": "elyra-kfp-examples-catalog:737915b826e9",
              "type": "execution_node",
            },
            Object {
              "app_data": Object {},
              "op": "some_op",
              "type": "execution_node",
            },
          ],
        },
        Object {
          "nodes": Array [
            Object {
              "app_data": Object {
                "component_source": "{\\"catalog_type\\":\\"elyra-airflow-examples-catalog\\",\\"component_ref\\":{\\"component-id\\":\\"slack_operator.py\\"}}",
              },
              "op": "elyra-airflow-examples-catalog:16a204f716a2",
              "type": "execution_node",
            },
          ],
        },
      ],
    }
  `);
});

it("should migrate v5 to latest", () => {
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
            op: "run_notebook_using_papermill_Runnotebookusingpapermill",
            app_data: {
              component_parameters: {
                notebook: {
                  value: "parent",
                  option: "output",
                },
                parameters: "some string",
                some_value: "string",
              },
              component_source: "kfp/run_notebook_using_papermill.yaml",
            },
          },
          {
            type: "execution_node",
            op: "component_Downloaddata",
            app_data: {
              component_source: "kfp/component.yaml",
            },
          },
          {
            type: "execution_node",
            op: "some_op",
            app_data: {},
          },
        ],
      },
      {
        nodes: [
          {
            type: "execution_node",
            op: "spark_sql_operator_SparkSqlOperator",
            app_data: {
              component_parameters: {
                conn_id: "test_string",
                total_executor_cores: 42,
                verbose: true,
              },
              component_source: "airflow/spark_sql_operator.py",
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v5, mockPalette);

  expect(actual).toMatchInlineSnapshot(`
    Object {
      "pipelines": Array [
        Object {
          "app_data": Object {
            "name": "name",
            "runtime_type": "APACHE_AIRFLOW",
            "version": 6,
          },
          "nodes": Array [
            Object {
              "app_data": Object {
                "component_parameters": Object {
                  "notebook": Object {
                    "option": "output",
                    "value": "parent",
                  },
                  "parameters": "some string",
                  "some_value": "string",
                },
                "component_source": "{\\"catalog_type\\":\\"elyra-kfp-examples-catalog\\",\\"component_ref\\":{\\"component-id\\":\\"run_notebook_using_papermill.yaml\\"}}",
              },
              "op": "elyra-kfp-examples-catalog:61e6f4141f65",
              "type": "execution_node",
            },
            Object {
              "app_data": Object {
                "component_source": "{\\"catalog_type\\":\\"elyra-kfp-examples-catalog\\",\\"component_ref\\":{\\"component-id\\":\\"download_data.yaml\\"}}",
              },
              "op": "elyra-kfp-examples-catalog:a08014f9252f",
              "type": "execution_node",
            },
            Object {
              "app_data": Object {},
              "op": "some_op",
              "type": "execution_node",
            },
          ],
        },
        Object {
          "nodes": Array [
            Object {
              "app_data": Object {
                "component_parameters": Object {
                  "conn_id": Object {
                    "StringControl": "test_string",
                    "activeControl": "StringControl",
                  },
                  "total_executor_cores": Object {
                    "NumberControl": 42,
                    "activeControl": "NumberControl",
                  },
                  "verbose": Object {
                    "BooleanControl": true,
                    "activeControl": "BooleanControl",
                  },
                },
                "component_source": "{\\"catalog_type\\":\\"elyra-airflow-examples-catalog\\",\\"component_ref\\":{\\"component-id\\":\\"spark_sql_operator.py\\"}}",
              },
              "op": "elyra-airflow-examples-catalog:3b639742748f",
              "type": "execution_node",
            },
          ],
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
          version: 6,
        },
        nodes: [],
      },
    ],
  };

  const actual = migrate(latest, mockPalette);

  expect(actual).toEqual(latest);
});
