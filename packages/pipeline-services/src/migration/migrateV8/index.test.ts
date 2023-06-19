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
const migrate = produce<any>((f: any) => rawMigrate(f));

it("should update property format for OneOfControl", () => {
  const component_parameters = {
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
  };

  const new_component_parameters = {
    some_prop: "string",
    some_bool: true,
    parent_value: {
      widget: "inputpath",
      value: {
        value: "parent-id",
        option: "output_name",
      },
    },
    stringOneOf: {
      widget: "string",
      value: "some string",
    },
    boolOneOf: {
      widget: "boolean",
      value: true,
    },
    numOneOf: {
      widget: "number",
      value: 42,
    },
    parentOneOf: {
      widget: "inputpath",
      value: {
        value: "parent-id",
        option: "output_name",
      },
    },
  };

  const v7 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 7,
        },
        nodes: [
          {
            app_data: {
              component_parameters,
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v7);
  expect(actual.pipelines[0].nodes[0].app_data.component_parameters).toEqual(
    new_component_parameters
  );
});

it("should update property format for KeyValue arrays", () => {
  const component_parameters = {
    env_vars: ["HOME=/user", "JAVA_HOME=", "HOST="],
    kubernetes_secrets: ["var=secret:key", "var2=secret2:key2"],
    kubernetes_tolerations: [
      "id=key:Equal:val:NoExecute",
      "id2=key2:Equal:val2:NoExecute",
      "id3=:Equal::",
    ],
    kubernetes_pod_annotations: ["key=val", "key2=val2"],
    mounted_volumes: ["mount=name", "mount2=name2"],
  };

  const new_component_parameters = {
    env_vars: [
      {
        env_var: "HOME",
        value: "/user",
      },
      {
        env_var: "JAVA_HOME",
        value: "",
      },
      {
        env_var: "HOST",
        value: "",
      },
    ],
    kubernetes_secrets: [
      {
        env_var: "var",
        name: "secret",
        key: "key",
      },
      {
        env_var: "var2",
        name: "secret2",
        key: "key2",
      },
    ],
    kubernetes_tolerations: [
      {
        key: "key",
        operator: "Equal",
        value: "val",
        effect: "NoExecute",
      },
      {
        key: "key2",
        operator: "Equal",
        value: "val2",
        effect: "NoExecute",
      },
      {
        key: "",
        operator: "Equal",
        value: "",
        effect: "",
      },
    ],
    kubernetes_pod_annotations: [
      {
        key: "key",
        value: "val",
      },
      {
        key: "key2",
        value: "val2",
      },
    ],
    mounted_volumes: [
      {
        path: "mount",
        pvc_name: "name",
      },
      {
        path: "mount2",
        pvc_name: "name2",
      },
    ],
  };

  const v7 = {
    pipelines: [
      {
        app_data: {
          name: "name",
          version: 7,
          properties: {
            pipeline_defaults: component_parameters,
          },
        },
        nodes: [
          {
            app_data: {
              component_parameters,
            },
          },
        ],
      },
    ],
  };

  const actual = migrate(v7);
  expect(actual.pipelines[0].nodes[0].app_data.component_parameters).toEqual(
    new_component_parameters
  );
  expect(actual.pipelines[0].app_data.properties.pipeline_defaults).toEqual(
    new_component_parameters
  );
});
