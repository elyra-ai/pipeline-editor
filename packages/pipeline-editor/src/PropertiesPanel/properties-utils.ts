export type ISchemaItem =
  | IBooleanItem
  | IFileItem
  | IStringArrayItem
  | IStringItem
  | IStringSelectItem;

export interface IBooleanItem {
  id: string;
  label: string;
  helperText?: string;
  type: "boolean";
  default?: boolean;
}

export interface IFileItem {
  id: string;
  label: string;
  helperText?: string;
  required?: boolean; // NOTE: boolean can't be required
  type: "file";
  default?: string;
  extension?: string;
  placeholder?: string;
}

export interface IStringArrayItem {
  id: string;
  label: string;
  helperText?: string;
  required?: boolean; // NOTE: boolean can't be required
  type: "string[]";
  default?: string[];
  placeholder?: string;
}

export interface IStringItem {
  id: string;
  label: string;
  helperText?: string;
  required?: boolean; // NOTE: boolean can't be required
  type: "string";
  default?: string;
  placeholder?: string;
}

export interface IStringSelectItem {
  id: string;
  label: string;
  helperText?: string;
  required?: boolean; // NOTE: boolean can't be required
  type: "string";
  enum: { label: string; value: string }[];
  default?: string;
}

export interface CommonPropertiesSchema {
  current_parameters: {
    [key: string]: any;
  };
  parameters: CommonPropertiesSchema.Parameter[];
  uihints: CommonPropertiesSchema.UIHints;
  resources: any;
}

export namespace CommonPropertiesSchema {
  export interface UIHints {
    id: string;
    parameter_info: any[];
    action_info: any[];
    group_info: any[];
  }
  export interface StringParameter {
    id: string;
    type: "string";
    required: boolean;
  }
  export interface StringArrayParameter {
    id: string;
    type: "array[string]";
    required: boolean;
  }
  export interface BooleanParameter {
    id: string;
    type: "cboolean";
    required: boolean;
  }
  export interface EnumParameter {
    id: string;
    enum: any[];
    required: boolean;
  }
  export type Parameter =
    | StringParameter
    | StringArrayParameter
    | BooleanParameter
    | EnumParameter;
}

const properties: CommonPropertiesSchema = {
  current_parameters: {
    filename: "",
    runtime_image: "",
    outputs: [],
    env_vars: [],
    dependencies: [],
    include_subdirectories: false,
  },
  parameters: [
    {
      id: "filename",
      type: "string",
      required: true,
    },
    {
      id: "runtime_image",
      enum: [],
      required: true,
    },
    {
      id: "dependencies",
      type: "array[string]",
      required: false,
    },
    {
      id: "include_subdirectories",
      type: "cboolean",
      required: false,
    },
    {
      id: "env_vars",
      type: "array[string]",
      required: false,
    },
    {
      id: "outputs",
      type: "array[string]",
      required: false,
    },
  ],
  uihints: {
    id: "nodeProperties",
    parameter_info: [
      {
        parameter_ref: "filename",
        // control: "readonly",
        label: {
          default: "Filename",
        },
      },
      {
        parameter_ref: "runtime_image",
        control: "oneofselect",
        label: {
          default: "Runtime Image",
        },
        description: {
          default: "Container image used as execution environment",
          placement: "on_panel",
        },
      },
      {
        parameter_ref: "dependencies",
        label: {
          default: "File Dependencies",
        },
        // control: "custom",
        // custom_control_id: "elyra-string-array-input",
        description: {
          default:
            "Local file dependencies that need to be copied to remote execution environment.\nOne filename or expression (e.g. *.py) per line. Supported patterns: ? and *.",
          placement: "on_panel",
        },
        data: {
          single_item_label: "Dependency",
          placeholder: "*.py",
          filebrowser: true,
        },
      },
      {
        parameter_ref: "include_subdirectories",
        label: {
          default: "Include Subdirectories in Dependencies",
        },
        description: {
          default: "May increase submission time",
          placement: "on_panel",
        },
      },
      {
        parameter_ref: "env_vars",
        label: {
          default: "Environment Variables",
        },
        // control: "custom",
        // custom_control_id: "elyra-string-array-input",
        description: {
          default:
            "Environment variables to be set on the execution environment.\nOne variable per line in the format ENV_VAR=value.",
          placement: "on_panel",
        },
        data: {
          placeholder: "env_var=VALUE",
          single_item_label: "Environment Variable",
        },
      },
      {
        parameter_ref: "outputs",
        label: {
          default: "Output Files",
        },
        // control: "custom",
        // custom_control_id: "elyra-string-array-input",
        description: {
          default:
            "Files generated during execution that will become available to all subsequent pipeline steps.\n One filename or expression (e.g. *.csv) per line. Supported patterns: ? and *.",
          placement: "on_panel",
        },
        data: {
          placeholder: "foo.csv",
          single_item_label: "Output File",
        },
      },
    ],
    action_info: [],
    group_info: [
      {
        id: "nodeGroupInfo",
        type: "panels",
        group_info: [
          {
            id: "nodeFileControl",
            type: "controls",
            parameter_refs: ["filename"],
          },
          {
            id: "nodeRuntimeImageControl",
            type: "controls",
            parameter_refs: ["runtime_image"],
          },
          {
            id: "nodeListDependenciesControl",
            type: "controls",
            parameter_refs: ["dependencies"],
          },
          {
            id: "nodePropertiesControls0",
            type: "controls",
            parameter_refs: ["include_subdirectories"],
          },
          {
            id: "nodePropertiesControls1",
            type: "controls",
            parameter_refs: ["env_vars"],
          },
          {
            id: "nodePropertiesControls2",
            type: "controls",
            parameter_refs: ["outputs"],
          },
        ],
      },
    ],
  },
  resources: {},
};

export function toCommonProperties(items: ISchemaItem[], app_data: any) {
  console.log(app_data);

  let commonProperties: CommonPropertiesSchema = {
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
        commonProperties.current_parameters[item.id] =
          app_data[item.id] ?? item.default ?? false;
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
            helperText: item.helperText,
          },
        });
        commonProperties.uihints.group_info[0].group_info.push({
          id: item.id,
          type: "controls",
          parameter_refs: [item.id],
        });
        break;
      case "file":
        commonProperties.current_parameters[item.id] =
          app_data[item.id] ?? item.default ?? "";
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
          description: item.helperText
            ? {
                default: item.helperText,
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
        commonProperties.current_parameters[item.id] =
          app_data[item.id] ?? item.default ?? "";
        if ((item as IStringSelectItem).enum) {
          commonProperties.parameters.push({
            id: item.id,
            enum: (item as IStringSelectItem).enum.map((e) => e.label),
            required: item.required ?? false,
          });
          commonProperties.uihints.parameter_info.push({
            parameter_ref: item.id,
            label: {
              default: item.label,
            },
            control: "oneofselect",
            description: item.helperText
              ? {
                  default: item.helperText,
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
            description: item.helperText
              ? {
                  default: item.helperText,
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
        commonProperties.current_parameters[item.id] =
          app_data[item.id] ?? item.default ?? [];
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
          description: item.helperText
            ? {
                default: item.helperText,
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
  }

  return commonProperties;
}
