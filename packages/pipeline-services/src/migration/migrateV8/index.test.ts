/*
 * Copyright 2018-2022 Elyra Authors
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
      value: "parent-id",
      option: "output_name",
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
