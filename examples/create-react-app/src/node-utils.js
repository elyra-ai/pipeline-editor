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

function toCommonProperties(items) {
  let commonProperties = {
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
      case "boolean":
        commonProperties.current_parameters[item.id] = item.default ?? false;
        commonProperties.parameters.push({
          id: item.id,
        });
        commonProperties.uihints.parameter_info.push({
          control: "custom",
          custom_control_id: "BooleanControl",
          parameter_ref: item.id,
          label: {
            default: item.label,
          },
          data: {
            helperText: item.description,
            required: false,
          },
        });
        commonProperties.uihints.group_info[0].group_info.push({
          id: item.id,
          type: "controls",
          parameter_refs: [item.id],
        });
        break;
      case "file":
        commonProperties.current_parameters[item.id] = item.default ?? "";
        commonProperties.parameters.push({
          id: item.id,
        });
        commonProperties.uihints.parameter_info.push({
          control: "custom",
          custom_control_id: "StringControl",
          parameter_ref: item.id,
          label: {
            default: item.label,
          },
          description: item.description
            ? {
                default: item.description,
                placement: "on_panel",
              }
            : undefined,
          data: {
            format: "file",
            required: item.required ?? false,
          },
        });
        commonProperties.uihints.group_info[0].group_info.push({
          id: item.id,
          type: "controls",
          parameter_refs: [item.id],
        });
        break;
      case "string":
        commonProperties.current_parameters[item.id] = item.default ?? "";
        if (item.enum) {
          commonProperties.parameters.push({
            id: item.id,
          });
          commonProperties.uihints.parameter_info.push({
            parameter_ref: item.id,
            label: {
              default: item.label,
            },
            control: "custom",
            custom_control_id: "EnumControl",
            description: item.description
              ? {
                  default: item.description,
                  placement: "on_panel",
                }
              : undefined,
            data: {
              items: item.enum,
              required: item.required ?? false,
            },
          });
        } else {
          commonProperties.parameters.push({
            id: item.id,
          });
          commonProperties.uihints.parameter_info.push({
            control: "custom",
            custom_control_id: "StringControl",
            parameter_ref: item.id,
            label: {
              default: item.label,
            },
            description: item.description
              ? {
                  default: item.description,
                  placement: "on_panel",
                }
              : undefined,
            data: {
              placeholder: "*.py",
              required: item.required ?? false,
            },
          });
        }

        commonProperties.uihints.group_info[0].group_info.push({
          id: item.id,
          type: "controls",
          parameter_refs: [item.id],
        });
        break;
      case "string[]":
        commonProperties.current_parameters[item.id] = item.default ?? [];
        commonProperties.parameters.push({
          id: item.id,
        });
        commonProperties.uihints.parameter_info.push({
          control: "custom",
          custom_control_id: "StringArrayControl",
          parameter_ref: item.id,
          label: {
            default: item.label,
          },
          description: item.description
            ? {
                default: item.description,
                placement: "on_panel",
              }
            : undefined,
          data: {
            placeholder: item.placeholder,
            required: item.required ?? false,
          },
        });
        commonProperties.uihints.group_info[0].group_info.push({
          id: item.id,
          type: "controls",
          parameter_refs: [item.id],
        });
        break;
      default:
        break;
    }
  }

  return commonProperties;
}

export function createNode({
  op,
  description,
  properties,
  label,
  image,
  ...rest
}) {
  return {
    op,
    description,
    id: "",
    type: "execution_node",
    inputs: [
      {
        id: "inPort",
        app_data: {
          ui_data: {
            cardinality: {
              min: 0,
              max: -1,
            },
            label: "Input Port",
          },
        },
      },
    ],
    outputs: [
      {
        id: "outPort",
        app_data: {
          ui_data: {
            cardinality: {
              min: 0,
              max: -1,
            },
            label: "Output Port",
          },
        },
      },
    ],
    parameters: {},
    app_data: {
      ...rest,
      properties: toCommonProperties(properties),
      ui_data: {
        description,
        label,
        image,
        x_pos: 0,
        y_pos: 0,
      },
    },
  };
}
