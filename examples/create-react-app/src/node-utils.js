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
          type: "cboolean",
          required: false,
        });
        commonProperties.uihints.parameter_info.push({
          control: "custom",
          custom_control_id: "pipeline-editor-boolean-control",
          parameter_ref: item.id,
          label: {
            default: item.label,
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
      case "file":
        commonProperties.current_parameters[item.id] = item.default ?? "";
        commonProperties.parameters.push({
          id: item.id,
          type: "string",
          required: item.required ?? false,
        });
        commonProperties.uihints.parameter_info.push({
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
            enum: item.enum,
            required: item.required ?? false,
          });
          commonProperties.uihints.parameter_info.push({
            parameter_ref: item.id,
            label: {
              default: item.label,
            },
            control: "oneofselect",
            description: item.description
              ? {
                  default: item.description,
                  placement: "on_panel",
                }
              : undefined,
          });
        } else {
          commonProperties.parameters.push({
            id: item.id,
            type: "string",
            required: item.required ?? false,
          });
          commonProperties.uihints.parameter_info.push({
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
          type: "array[string]",
          required: item.required ?? false,
        });
        commonProperties.uihints.parameter_info.push({
          control: "custom",
          custom_control_id: "pipeline-editor-string-array-control",
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

export function createNode(node) {
  return {
    ...node,
    properties: toCommonProperties(node.properties),
  };
}
