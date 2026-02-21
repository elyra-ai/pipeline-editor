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
    {
      "pipelines": [
        {
          "app_data": {
            "name": "title",
            "runtime_type": undefined,
            "version": 8,
          },
          "nodes": [],
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
    {
      "pipelines": [
        {
          "app_data": {
            "runtime_type": undefined,
            "version": 8,
          },
          "nodes": [],
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

  const actual = migrate(v1);

  expect(actual).toMatchInlineSnapshot(`
    {
      "pipelines": [
        {
          "app_data": {
            "name": "name",
            "runtime_type": undefined,
            "version": 8,
          },
          "nodes": [
            {
              "app_data": {
                "component_parameters": {
                  "filename": "notebook.ipynb",
                },
                "label": "",
                "ui_data": {},
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

  const actual = migrate(v2);

  expect(actual).toMatchInlineSnapshot(`
    {
      "pipelines": [
        {
          "app_data": {
            "name": "name",
            "runtime_type": undefined,
            "version": 8,
          },
          "nodes": [],
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

  const actual = migrate(v3);

  expect(actual).toMatchInlineSnapshot(`
    {
      "pipelines": [
        {
          "app_data": {
            "name": "name",
            "runtime_type": undefined,
            "version": 8,
          },
          "nodes": [
            {
              "app_data": {
                "component_parameters": {
                  "filename": "notebook.ipynb",
                },
                "label": "node label",
                "ui_data": {
                  "label": "node label",
                },
              },
              "type": "execution_node",
            },
          ],
        },
        {
          "nodes": [
            {
              "app_data": {
                "component_parameters": {
                  "filename": "notebook2.ipynb",
                },
                "label": "node label 2",
                "ui_data": {
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

  const actual = migrate(v4);

  expect(actual).toMatchInlineSnapshot(`
    {
      "pipelines": [
        {
          "app_data": {
            "name": "name",
            "runtime_type": undefined,
            "version": 8,
          },
          "nodes": [
            {
              "app_data": {
                "component_source": "{"catalog_type":"elyra-kfp-examples-catalog","component_ref":{"component-id":"run_notebook_using_papermill.yaml"}}",
              },
              "op": "elyra-kfp-examples-catalog:61e6f4141f65",
              "type": "execution_node",
            },
            {
              "app_data": {
                "component_source": "{"catalog_type":"elyra-kfp-examples-catalog","component_ref":{"component-id":"filter_text_using_shell_and_grep.yaml"}}",
              },
              "op": "elyra-kfp-examples-catalog:737915b826e9",
              "type": "execution_node",
            },
            {
              "app_data": {},
              "op": "some_op",
              "type": "execution_node",
            },
          ],
        },
        {
          "nodes": [
            {
              "app_data": {
                "component_source": "{"catalog_type":"elyra-airflow-examples-catalog","component_ref":{"component-id":"slack_operator.py"}}",
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

  const actual = migrate(v5);

  expect(actual).toMatchInlineSnapshot(`
    {
      "pipelines": [
        {
          "app_data": {
            "name": "name",
            "runtime_type": "APACHE_AIRFLOW",
            "version": 8,
          },
          "nodes": [
            {
              "app_data": {
                "component_parameters": {
                  "notebook": {
                    "value": {
                      "option": "output",
                      "value": "parent",
                    },
                    "widget": "inputpath",
                  },
                  "parameters": {
                    "value": "some string",
                    "widget": "string",
                  },
                  "some_value": "string",
                },
                "component_source": "{"catalog_type":"elyra-kfp-examples-catalog","component_ref":{"component-id":"run_notebook_using_papermill.yaml"}}",
              },
              "op": "elyra-kfp-examples-catalog:61e6f4141f65",
              "type": "execution_node",
            },
            {
              "app_data": {
                "component_source": "{"catalog_type":"elyra-kfp-examples-catalog","component_ref":{"component-id":"download_data.yaml"}}",
              },
              "op": "elyra-kfp-examples-catalog:a08014f9252f",
              "type": "execution_node",
            },
            {
              "app_data": {},
              "op": "some_op",
              "type": "execution_node",
            },
          ],
        },
        {
          "nodes": [
            {
              "app_data": {
                "component_parameters": {
                  "conn_id": {
                    "value": "test_string",
                    "widget": "string",
                  },
                  "total_executor_cores": {
                    "value": 42,
                    "widget": "number",
                  },
                  "verbose": {
                    "value": true,
                    "widget": "boolean",
                  },
                },
                "component_source": "{"catalog_type":"elyra-airflow-examples-catalog","component_ref":{"component-id":"spark_sql_operator.py"}}",
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

it("should migrate v6 to latest", () => {
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
              component_parameters: {
                data: {
                  value: "parent-id",
                  option: "output_name",
                },
                hash_algorithm: "HASH",
              },
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v6);

  expect(actual).toMatchInlineSnapshot(`
    {
      "pipelines": [
        {
          "app_data": {
            "name": "name",
            "runtime_type": "KUBEFLOW_PIPELINES",
            "version": 8,
          },
          "nodes": [
            {
              "app_data": {
                "component_parameters": {
                  "data": {
                    "value": {
                      "option": "output_name",
                      "value": "parent-id",
                    },
                    "widget": "inputpath",
                  },
                  "hash_algorithm": {
                    "value": "HASH",
                    "widget": "string",
                  },
                },
              },
              "op": "elyra-kfp-examples-catalog:d68ec7fcdf46",
              "type": "execution_node",
            },
          ],
        },
      ],
    }
  `);
});

it("should migrate v7 to latest", () => {
  const v7 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 7,
          properties: {
            pipeline_defaults: {
              env_vars: ["HOME=/user", "JAVA_HOME=", "HOST="],
              kubernetes_secrets: ["var=secret:key", "var2=secret2:key2"],
              kubernetes_tolerations: [
                "id=key:Equal:val:NoExecute",
                "id2=key2:Equal:val2:NoExecute",
                "id3=:Equal::",
              ],
              kubernetes_pod_annotations: ["key=val", "key2=val2"],
              mounted_volumes: ["mount=name", "mount2=name2"],
            },
          },
        },
        nodes: [
          {
            app_data: {
              component_parameters: {
                some_prop: "string",
                some_bool: true,
                parent_value: {
                  value: "parent-id",
                  option: "output_name",
                },
                stringOneOf: {
                  activeControl: "StringControl",
                  StringControl: "some string",
                },
                boolOneOf: {
                  activeControl: "BooleanControl",
                  BooleanControl: true,
                },
                numOneOf: {
                  activeControl: "NumberControl",
                  NumberControl: 42,
                },
                parentOneOf: {
                  activeControl: "NestedEnumControl",
                  NestedEnumControl: {
                    value: "parent-id",
                    option: "output_name",
                  },
                },
                env_vars: ["HOME=/user", "JAVA_HOME=", "HOST="],
                kubernetes_secrets: ["var=secret:key", "var2=secret2:key2"],
                kubernetes_tolerations: [
                  "id=key:Equal:val:NoExecute",
                  "id2=key2:Equal:val2:NoExecute",
                  "id3=:Equal::",
                ],
                kubernetes_pod_annotations: ["key=val", "key2=val2"],
                mounted_volumes: ["mount=name", "mount2=name2"],
              },
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v7);

  expect(actual).toMatchInlineSnapshot(`
    {
      "pipelines": [
        {
          "app_data": {
            "name": "name",
            "properties": {
              "pipeline_defaults": {
                "env_vars": [
                  {
                    "env_var": "HOME",
                    "value": "/user",
                  },
                  {
                    "env_var": "JAVA_HOME",
                    "value": "",
                  },
                  {
                    "env_var": "HOST",
                    "value": "",
                  },
                ],
                "kubernetes_pod_annotations": [
                  {
                    "key": "key",
                    "value": "val",
                  },
                  {
                    "key": "key2",
                    "value": "val2",
                  },
                ],
                "kubernetes_secrets": [
                  {
                    "env_var": "var",
                    "key": "key",
                    "name": "secret",
                  },
                  {
                    "env_var": "var2",
                    "key": "key2",
                    "name": "secret2",
                  },
                ],
                "kubernetes_tolerations": [
                  {
                    "effect": "NoExecute",
                    "key": "key",
                    "operator": "Equal",
                    "value": "val",
                  },
                  {
                    "effect": "NoExecute",
                    "key": "key2",
                    "operator": "Equal",
                    "value": "val2",
                  },
                  {
                    "effect": "",
                    "key": "",
                    "operator": "Equal",
                    "value": "",
                  },
                ],
                "mounted_volumes": [
                  {
                    "path": "mount",
                    "pvc_name": "name",
                  },
                  {
                    "path": "mount2",
                    "pvc_name": "name2",
                  },
                ],
              },
            },
            "version": 8,
          },
          "nodes": [
            {
              "app_data": {
                "component_parameters": {
                  "boolOneOf": {
                    "value": true,
                    "widget": "boolean",
                  },
                  "env_vars": [
                    {
                      "env_var": "HOME",
                      "value": "/user",
                    },
                    {
                      "env_var": "JAVA_HOME",
                      "value": "",
                    },
                    {
                      "env_var": "HOST",
                      "value": "",
                    },
                  ],
                  "kubernetes_pod_annotations": [
                    {
                      "key": "key",
                      "value": "val",
                    },
                    {
                      "key": "key2",
                      "value": "val2",
                    },
                  ],
                  "kubernetes_secrets": [
                    {
                      "env_var": "var",
                      "key": "key",
                      "name": "secret",
                    },
                    {
                      "env_var": "var2",
                      "key": "key2",
                      "name": "secret2",
                    },
                  ],
                  "kubernetes_tolerations": [
                    {
                      "effect": "NoExecute",
                      "key": "key",
                      "operator": "Equal",
                      "value": "val",
                    },
                    {
                      "effect": "NoExecute",
                      "key": "key2",
                      "operator": "Equal",
                      "value": "val2",
                    },
                    {
                      "effect": "",
                      "key": "",
                      "operator": "Equal",
                      "value": "",
                    },
                  ],
                  "mounted_volumes": [
                    {
                      "path": "mount",
                      "pvc_name": "name",
                    },
                    {
                      "path": "mount2",
                      "pvc_name": "name2",
                    },
                  ],
                  "numOneOf": {
                    "value": 42,
                    "widget": "number",
                  },
                  "parentOneOf": {
                    "value": {
                      "option": "output_name",
                      "value": "parent-id",
                    },
                    "widget": "inputpath",
                  },
                  "parent_value": {
                    "value": {
                      "option": "output_name",
                      "value": "parent-id",
                    },
                    "widget": "inputpath",
                  },
                  "some_bool": true,
                  "some_prop": "string",
                  "stringOneOf": {
                    "value": "some string",
                    "widget": "string",
                  },
                },
              },
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
          version: 8,
        },
        nodes: [],
      },
    ],
  };

  const actual = migrate(latest);

  expect(actual).toEqual(latest);
});
