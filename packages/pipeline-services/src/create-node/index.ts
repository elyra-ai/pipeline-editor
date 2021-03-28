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

interface NodeSchema {
  op: string; // ID for a node type. For example: `execute-notebook-node`
  image: string; // SVG that will show up on the node
  label: string; // default label (the rendered label is dynamic)
  description: string; // description that could show up in the palette or when hovering on the node in the pipeline
  properties: NodeProperty[]; // fixed properties for the node (dynamic and runtime specific properties don't go here)
}

interface NodePropertyCommon {
  id: string;
  title: string;
  description?: string;
  markdownDescription?: string;
}

type NodeProperty =
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

interface ArrayProperty extends NodePropertyCommon {
  type: "array";
  items: StringProperty;
  // items: NodeProperty | NodeProperty[];  TODO: maybe?
  // additionalItems: false | NodeProperty; TODO: maybe?
  uniqueItems?: boolean;
  minItems?: number; // for restricting array length
  maxItems?: number; // for restricting array length
  default?: any[]; // for defining the default value of a property
  // an array can't really be "required", use minItems: 1 to emulate.
}

interface BooleanProperty extends NodePropertyCommon {
  type: "boolean";
  default?: boolean; // for defining the default value of a property
  // a boolean can't be required
}

interface CommonProperties {
  current_parameters: { [key: string]: any };
  parameters: any[];
  uihints: {
    id: "nodeProperties";
    parameter_info: any[];
    action_info: any[];
    group_info: [
      {
        id: "nodeGroupInfo";
        type: "panels";
        group_info: any[];
      }
    ];
  };
  resources: any;
}

function toCommonProperties(items: NodeProperty[]) {
  let commonProperties: CommonProperties = {
    current_parameters: {},
    parameters: [],
    uihints: {
      id: "nodeProperties",
      parameter_info: [],
      action_info: [],
      group_info: [
        {
          id: "nodeGroupInfo",
          type: "panels",
          group_info: [],
        },
      ],
    },
    resources: {},
  };

  for (const item of items) {
    switch (item.type) {
      case "boolean": {
        commonProperties.current_parameters[item.id] = item.default ?? false;
        commonProperties.parameters.push({
          id: item.id,
          type: "cboolean",
          required: false,
        });
        commonProperties.uihints.parameter_info.push({
          control: "custom",
          custom_control_id: "pipeline-editor-boolean-control",
          parameter_ref: item.id,
          label: {
            default: item.title,
          },
          data: {
            helperText: item.description,
          },
        });
        commonProperties.uihints.group_info[0].group_info.push({
          id: item.id,
          type: "controls",
          parameter_refs: [item.id],
        });
        break;
      }

      case "string": {
        if (item.format === "file") {
          commonProperties.current_parameters[item.id] = item.default ?? "";
          commonProperties.parameters.push({
            id: item.id,
            type: "string",
            required: item.required ?? false,
          });
          commonProperties.uihints.parameter_info.push({
            parameter_ref: item.id,
            label: {
              default: item.title,
            },
            description: item.description
              ? {
                  default: item.description,
                  placement: "on_panel",
                }
              : undefined,
          });
          commonProperties.uihints.group_info[0].group_info.push({
            id: item.id,
            type: "controls",
            parameter_refs: [item.id],
          });
          break;
        }

        commonProperties.current_parameters[item.id] = item.default ?? "";
        if (item.enum) {
          commonProperties.parameters.push({
            id: item.id,
            enum: item.enum,
            required: item.required ?? false,
          });
          commonProperties.uihints.parameter_info.push({
            parameter_ref: item.id,
            label: {
              default: item.title,
            },
            control: "oneofselect",
            description: item.description
              ? {
                  default: item.description,
                  placement: "on_panel",
                }
              : undefined,
          });
          commonProperties.uihints.group_info[0].group_info.push({
            id: item.id,
            type: "controls",
            parameter_refs: [item.id],
          });
          break;
        }

        commonProperties.parameters.push({
          id: item.id,
          type: "string",
          required: item.required ?? false,
        });
        commonProperties.uihints.parameter_info.push({
          parameter_ref: item.id,
          label: {
            default: item.title,
          },
          description: item.description
            ? {
                default: item.description,
                placement: "on_panel",
              }
            : undefined,
          data: {
            placeholder: item.placeholder,
          },
        });
        commonProperties.uihints.group_info[0].group_info.push({
          id: item.id,
          type: "controls",
          parameter_refs: [item.id],
        });
        break;
      }

      case "array": {
        commonProperties.current_parameters[item.id] = item.default ?? [];
        commonProperties.parameters.push({
          id: item.id,
          type: "array[string]",
        });
        commonProperties.uihints.parameter_info.push({
          control: "custom",
          custom_control_id: "pipeline-editor-string-array-control",
          parameter_ref: item.id,
          label: {
            default: item.title,
          },
          description: item.description
            ? {
                default: item.description,
                placement: "on_panel",
              }
            : undefined,
          data: {
            placeholder: item.items.placeholder,
          },
        });
        commonProperties.uihints.group_info[0].group_info.push({
          id: item.id,
          type: "controls",
          parameter_refs: [item.id],
        });
        break;
      }
    }
  }

  return commonProperties;
}

export function createNode(node: NodeSchema) {
  return {
    ...node,
    properties: toCommonProperties(node.properties),
  };
}
