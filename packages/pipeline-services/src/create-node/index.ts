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

export type NodeTypes = "file";

export type NodeSchema = SimpleNodeSchema | FileNodeSchema;

interface NodeSchemaCommon {
  op: string; // ID for a node type. For example: `execute-notebook-node`
  label?: string; // default label (the rendered label is dynamic)
  description?: string; // description that could show up in the palette or when hovering on the node in the pipeline
  icon?: string;
  type?: NodeTypes;
  properties?: NodeProperty[]; // fixed properties for the node (dynamic and runtime specific properties don't go here)
}

interface SimpleNodeSchema extends NodeSchemaCommon {
  type: undefined;
}

interface FileNodeSchema extends NodeSchemaCommon {
  type: "file";
  extensions: string[]; // a file node will probably only ever be linked to one file type, but a list of extensions is needed. For example: [".yaml", ".yml"]
  language?: string; // a combination of this and extension will help determine an icon for the node.
}

interface NodePropertyCommon {
  id: string;
  title: string;
  description?: string;
  markdownDescription?: string;
}

export type NodeProperty =
  | StringProperty
  | NumberProperty
  | ArrayProperty
  | BooleanProperty;

interface StringProperty extends NodePropertyCommon {
  type: "string";
  pattern?: string; // for restricting strings to a given regular expression
  patternErrorMessage?: string; // for giving a tailored error message when a pattern does not match
  minLength?: number; // for restricting string length
  maxLength?: number; // for restricting string length
  format?: "date" | "time" | "ipv4" | "email" | "uri" | "file"; // for restricting strings to well-known formats
  enum?: string[];
  default?: string; // for defining the default value of a property
  required?: boolean;
  placeholder?: string;
  extensions?: string[];
}

interface NumberProperty extends NodePropertyCommon {
  type: "number" | "integer";
  multipleOf?: number;
  minimum?: number; // for restricting numeric values
  maximum?: number; // for restricting numeric values
  exclusiveMinimum?: boolean | number;
  exclusiveMaximum?: boolean | number;
  default?: number; // for defining the default value of a property
  required?: boolean;
}

// Part of the actual JSON schema spec is the ability to specify an array of `items`.
// For example: `[{ type: "number" }, { type: "string" }, { type: "number" }]`
// This would only allow an array with 3 items with the specified types. You can also pass `additionalItems`
// which would allow more than the 3 items, with the specified type for the overflow.
interface ArrayProperty extends NodePropertyCommon {
  type: "array";
  items: Omit<StringProperty, keyof NodePropertyCommon>; // I think it we should restrict this to: `items: { type: "string" }`
  // Part of JSON schema, but probably not worth the complexity:
  // items: NodeProperty | NodeProperty[];
  // additionalItems: false | NodeProperty;
  uniqueItems?: boolean;
  minItems?: number; // for restricting array length
  maxItems?: number; // for restricting array length
  default?: any[]; // for defining the default value of a property
  // an array can't really be "required", use minItems: 1 to emulate.
}

// I don't think we need to support `object`

interface BooleanProperty extends NodePropertyCommon {
  type: "boolean";
  default?: boolean; // for defining the default value of a property
  // a boolean can't be required
}

interface CommonProperties {
  current_parameters: { [key: string]: any };
  parameters: { id: string }[];
  uihints: {
    parameter_info: ParameterInfo[];
    group_info: [
      {
        type: "panels";
        group_info: GroupInfo[];
      }
    ];
  };
}

interface ParameterInfo {
  control: "custom";
  custom_control_id:
    | "StringControl"
    | "NumberControl"
    | "EnumControl"
    | "BooleanControl"
    | "StringArrayControl";
  parameter_ref: string;
  label: { default: string };
  description?: {
    default: string;
    placement: "on_panel";
  };
  data: any;
}

interface GroupInfo {
  id: string;
  type: "controls";
  parameter_refs: [string];
}

function createCurrentParameter(item: NodeProperty) {
  switch (item.type) {
    case "boolean":
      return { [item.id]: item.default ?? false };

    case "number":
    case "integer":
      return { [item.id]: item.default };

    case "string":
      return { [item.id]: item.default ?? "" };

    case "array":
      return { [item.id]: item.default ?? [] };
  }
}
function createParameter(item: NodeProperty) {
  return { id: item.id };
}

function createParameterInfo(item: NodeProperty): ParameterInfo {
  const baseInfo: Partial<ParameterInfo> = {
    control: "custom",
    parameter_ref: item.id,
    label: { default: item.title },
    description: item.description
      ? {
          default: item.description,
          placement: "on_panel",
        }
      : undefined,
    data: { ...item }, // just give everything as data.
  };
  switch (item.type) {
    case "boolean":
      baseInfo.custom_control_id = "BooleanControl";
      delete baseInfo.description;
      baseInfo.data = {
        helperText: item.description,
      };
      break;

    case "number":
    case "integer":
      baseInfo.custom_control_id = "NumberControl";
      break;

    case "string":
      baseInfo.custom_control_id = "StringControl";
      break;

    case "array":
      baseInfo.custom_control_id = "StringArrayControl";
      break;
  }
  return baseInfo as ParameterInfo;
}

function createGroupInfo(item: NodeProperty): GroupInfo {
  return {
    id: item.id,
    type: "controls",
    parameter_refs: [item.id],
  };
}

function toCommonProperties(node: NodeSchema) {
  // TODO: We should dynamically generate fixed fields as well
  // TODO: Inject file field for file nodes.

  const items = [...(node.properties ?? [])];

  let commonProperties: CommonProperties = {
    current_parameters: {},
    parameters: [],
    uihints: {
      parameter_info: [],
      group_info: [
        {
          type: "panels",
          group_info: [],
        },
      ],
    },
  };

  items.push({
    id: "label",
    title: "Label",
    type: "string",
  });

  if (node.type === "file") {
    items.push({
      id: "filename",
      title: "File",
      type: "string",
      format: "file",
      extensions: node.extensions,
    });
  }

  for (const item of items) {
    commonProperties.current_parameters = {
      ...commonProperties.current_parameters,
      ...createCurrentParameter(item),
    };
    commonProperties.parameters.push(createParameter(item));
    commonProperties.uihints.parameter_info.push(createParameterInfo(item));
    commonProperties.uihints.group_info[0].group_info.push(
      createGroupInfo(item)
    );
  }

  return commonProperties;
}

export function createNode(node: NodeSchema) {
  return {
    ...node,
    properties: toCommonProperties(node),
  };
}
