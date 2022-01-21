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

import { PaletteV3 } from "@elyra/canvas";
import { render as rtlRender } from "@testing-library/react";

import { PIPELINE_CURRENT_VERSION } from "./PipelineController";
import { InternalThemeProvider } from "./ThemeProvider";

export const samplePalette = {
  version: "3.0",
  categories: [
    {
      label: "Nodes",
      image: "",
      id: "nodes",
      description: "Nodes",
      node_types: [
        {
          op: "example-op",
          description: "",
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
            parameter_refs: {
              filehandler: "filename",
            },
            properties: {
              current_parameters: {
                stringExample: "is-set",
                emptyArrayExample: [],
                emptyObjectExample: {},
                trueExample: true,
                falseExample: false,
                undefinedExample: undefined,
                nullExample: null,
              },
            },
            ui_data: {
              description: "",
              label: "",
              image: "",
              x_pos: 0,
              y_pos: 0,
            },
          },
        },
      ],
    },
  ],
};

interface CustomNodeSpecification {
  op: string;
  label: string;
  description: string;
  extensions?: string[];
  parameter_refs?: any;
  image?: string;
  properties?: any;
}

export const nodeSpec: CustomNodeSpecification = {
  op: "execute-notebook-node",
  description: "Notebook file",
  label: "Notebook Label",
  extensions: [".ipynb"],
  parameter_refs: {
    filehandler: "filename",
  },
  image: undefined,
  properties: {
    current_parameters: {
      label: "",
      elyra_filename: "",
      elyra_runtime_image: "",
      elyra_dependencies: [],
      elyra_include_subdirectories: false,
      elyra_env_vars: [],
      elyra_outputs: [],
    },
    parameters: [
      { id: "label" },
      { id: "elyra_filename" },
      { id: "elyra_runtime_image" },
      { id: "elyra_dependencies" },
      { id: "elyra_include_subdirectories" },
      { id: "elyra_env_vars" },
      { id: "elyra_outputs" },
    ],
    uihints: {
      parameter_info: [
        {
          control: "custom",
          custom_control_id: "StringControl",
          parameter_ref: "label",
          label: { default: "Label" },
          description: {
            default: "The label.",
            placement: "on_panel",
          },
        },
        {
          control: "custom",
          custom_control_id: "StringControl",
          parameter_ref: "elyra_filename",
          label: { default: "File" },
          description: {
            default: "The path to the notebook file.",
            placement: "on_panel",
          },
          data: {
            format: "file",
            required: true,
          },
        },
        {
          control: "custom",
          custom_control_id: "EnumControl",
          parameter_ref: "elyra_runtime_image",
          label: { default: "Runtime Image" },
          description: {
            default: "Docker image used as execution environment.",
            placement: "on_panel",
          },
          data: {
            items: ["continuumio/anaconda3:2020.07", "amancevice/pandas:1.0.3"],
          },
        },
        {
          control: "custom",
          custom_control_id: "StringArrayControl",
          parameter_ref: "elyra_dependencies",
          label: { default: "File Dependencies" },
          description: {
            default:
              "Local file dependencies that need to be copied to remote execution environment.",
            placement: "on_panel",
          },
          data: { placeholder: "*.py" },
        },
        {
          control: "custom",
          custom_control_id: "BooleanControl",
          parameter_ref: "elyra_include_subdirectories",
          label: { default: "Include Subdirectories" },
          data: {
            description:
              "Wether or not to include recursively include subdirectories when submitting a pipeline (This may increase submission time).",
          },
        },
        {
          control: "custom",
          custom_control_id: "StringArrayControl",
          parameter_ref: "elyra_env_vars",
          label: { default: "Environment Variables" },
          description: {
            default:
              "Environment variables to be set on the execution environment.",
            placement: "on_panel",
          },
          data: { placeholder: "ENV_VAR=value" },
        },
        {
          control: "custom",
          custom_control_id: "StringArrayControl",
          parameter_ref: "elyra_outputs",
          label: { default: "Output Files" },
          description: {
            default:
              "Files generated during execution that will become available to all subsequent pipeline steps.",
            placement: "on_panel",
          },
          data: { placeholder: "*.csv" },
        },
      ],
      group_info: [
        {
          type: "panels",
          group_info: [
            {
              id: "label",
              type: "controls",
              parameter_refs: ["label"],
            },
            {
              id: "elyra_filename",
              type: "controls",
              parameter_refs: ["elyra_filename"],
            },
            {
              id: "elyra_runtime_image",
              type: "controls",
              parameter_refs: ["elyra_runtime_image"],
            },
            {
              id: "elyra_dependencies",
              type: "controls",
              parameter_refs: ["elyra_dependencies"],
            },
            {
              id: "elyra_include_subdirectories",
              type: "controls",
              parameter_refs: ["elyra_include_subdirectories"],
            },
            {
              id: "elyra_env_vars",
              type: "controls",
              parameter_refs: ["elyra_env_vars"],
            },
            {
              id: "elyra_outputs",
              type: "controls",
              parameter_refs: ["elyra_outputs"],
            },
          ],
        },
      ],
    },
  },
};

export const selectedNode = {
  id: "0af8e1e7-4dd5-412e-95f1-812550843657",
  type: "execution_node",
  op: "execute-notebook-node",
  app_data: {
    label: "",
    component_parameters: {
      filename: "example.ipynb",
      runtime_image: "example/runtime:2020.07",
      env_vars: [],
      include_subdirectories: false,
      outputs: ["file1.csv", "file2.zip"],
      dependencies: ["file.ipynb"],
    },
  },
};

export const samplePipeline = {
  doc_type: "pipeline",
  version: "3.0",
  json_schema:
    "http://api.dataplatform.ibm.com/schemas/common-pipeline/pipeline-flow/pipeline-flow-v3-schema.json",
  id: "60e0b6b7-83ea-432d-b492-173dde46b38c",
  primary_pipeline: "5b8e67dc-85f0-4b1e-8bc6-cad98a6789c4",
  pipelines: [
    {
      id: "5b8e67dc-85f0-4b1e-8bc6-cad98a6789c4",
      nodes: [
        {
          id: "5c8584fe-41f8-4f05-9c70-c72d47daf3fa",
          type: "execution_node",
          op: "execute-nothing-node",
          app_data: {
            "simple-string": "",
            "file-string": "",
            enum: "thing one",
            "simple-string-array": [],
            "file-string-array": [],
            boolean: false,
            ui_data: {
              label: "Everything",
              image:
                "data:image/svg+xml;utf8,%0A%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20300%22%3E%0A%20%20%3Cg%20transform%3D%22translate(-1638%2C-1844)%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22m1788%201886a108.02%20108.02%200%200%200%20-104.92%2082.828%20114.07%2064.249%200%200%201%20104.92%20-39.053%20114.07%2064.249%200%200%201%20104.96%2039.261%20108.02%20108.02%200%200%200%20-104.96%20-83.037zm-104.96%20133.01a108.02%20108.02%200%200%200%20104.96%2083.037%20108.02%20108.02%200%200%200%20104.92%20-82.828%20114.07%2064.249%200%200%201%20-104.92%2039.053%20114.07%2064.249%200%200%201%20-104.96%20-39.261z%22%20style%3D%22fill%3A%23f57c00%3Bpaint-order%3Afill%20markers%20stroke%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%221699.5%22%20cy%3D%222110.8%22%20r%3D%2222.627%22%20style%3D%22fill%3A%239e9e9e%3Bpaint-order%3Afill%20markers%20stroke%22%2F%3E%3Ccircle%20cx%3D%221684.3%22%20cy%3D%221892.6%22%20r%3D%2216.617%22%20style%3D%22fill%3A%23616161%3Bmix-blend-mode%3Anormal%3Bpaint-order%3Afill%20markers%20stroke%22%2F%3E%3Ccircle%20cx%3D%221879.8%22%20cy%3D%221877.4%22%20r%3D%2221.213%22%20style%3D%22fill%3A%23757575%3Bmix-blend-mode%3Anormal%3Bpaint-order%3Afill%20markers%20stroke%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A",
              x_pos: 704,
              y_pos: 333,
              description: "Bloop bleep",
              decorations: [
                {
                  id: "error",
                  image:
                    "data:image/svg+xml;utf8,%3Csvg%20focusable%3D%22false%22%20preserveAspectRatio%3D%22xMidYMid%20meet%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23da1e28%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20aria-hidden%3D%22true%22%3E%3Ccircle%20cx%3D%228%22%20cy%3D%228%22%20r%3D%228%22%20fill%3D%22%23ffffff%22%3E%3C%2Fcircle%3E%3Cpath%20d%3D%22M8%2C1C4.2%2C1%2C1%2C4.2%2C1%2C8s3.2%2C7%2C7%2C7s7-3.1%2C7-7S11.9%2C1%2C8%2C1z%20M7.5%2C4h1v5h-1C7.5%2C9%2C7.5%2C4%2C7.5%2C4z%20M8%2C12.2%09c-0.4%2C0-0.8-0.4-0.8-0.8s0.3-0.8%2C0.8-0.8c0.4%2C0%2C0.8%2C0.4%2C0.8%2C0.8S8.4%2C12.2%2C8%2C12.2z%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M7.5%2C4h1v5h-1C7.5%2C9%2C7.5%2C4%2C7.5%2C4z%20M8%2C12.2c-0.4%2C0-0.8-0.4-0.8-0.8s0.3-0.8%2C0.8-0.8%09c0.4%2C0%2C0.8%2C0.4%2C0.8%2C0.8S8.4%2C12.2%2C8%2C12.2z%22%20data-icon-path%3D%22inner-path%22%20opacity%3D%220%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E",
                  outline: false,
                  position: "topRight",
                  x_pos: -24,
                  y_pos: -8,
                },
              ],
            },
            invalidNodeError:
              'property "Simple String" is required\nproperty "File String" is required',
          },
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
              links: [
                {
                  id: "VKQLdZJ4H1K96CUMRTdvl",
                  node_id_ref: "aaece223-69ef-4df8-8aa7-0685e57db9a4",
                  port_id_ref: "outPort",
                  app_data: {
                    ui_data: {
                      class_name: "d3-data-link",
                    },
                  },
                },
              ],
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
        },
        {
          id: "aaece223-69ef-4df8-8aa7-0685e57db9a4",
          type: "execution_node",
          op: "execute-notebook-node",
          app_data: {
            label: "",
            component_parameters: {
              filename: "goodbye.ipynb",
              runtime_image: "continuumio/anaconda3:2020.07",
              dependencies: [],
              include_subdirectories: false,
              env_vars: ["bloop"],
              outputs: [],
            },
            ui_data: {
              label: "goodbye.ipynb",
              image:
                "data:image/svg+xml;utf8,%0A%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20300%22%3E%0A%20%20%3Cg%20transform%3D%22translate(-1638%2C-1844)%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22m1788%201886a108.02%20108.02%200%200%200%20-104.92%2082.828%20114.07%2064.249%200%200%201%20104.92%20-39.053%20114.07%2064.249%200%200%201%20104.96%2039.261%20108.02%20108.02%200%200%200%20-104.96%20-83.037zm-104.96%20133.01a108.02%20108.02%200%200%200%20104.96%2083.037%20108.02%20108.02%200%200%200%20104.92%20-82.828%20114.07%2064.249%200%200%201%20-104.92%2039.053%20114.07%2064.249%200%200%201%20-104.96%20-39.261z%22%20style%3D%22fill%3A%23f57c00%3Bpaint-order%3Afill%20markers%20stroke%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%221699.5%22%20cy%3D%222110.8%22%20r%3D%2222.627%22%20style%3D%22fill%3A%239e9e9e%3Bpaint-order%3Afill%20markers%20stroke%22%2F%3E%3Ccircle%20cx%3D%221684.3%22%20cy%3D%221892.6%22%20r%3D%2216.617%22%20style%3D%22fill%3A%23616161%3Bmix-blend-mode%3Anormal%3Bpaint-order%3Afill%20markers%20stroke%22%2F%3E%3Ccircle%20cx%3D%221879.8%22%20cy%3D%221877.4%22%20r%3D%2221.213%22%20style%3D%22fill%3A%23757575%3Bmix-blend-mode%3Anormal%3Bpaint-order%3Afill%20markers%20stroke%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A",
              x_pos: 357,
              y_pos: 277,
              description: "Notebook file",
            },
          },
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
        },
      ],
      app_data: {
        ui_data: {
          comments: [],
        },
        version: PIPELINE_CURRENT_VERSION,
      },
      runtime_ref: "",
    },
  ],
  schemas: [],
};

function createPalette(nodes: CustomNodeSpecification[]): PaletteV3 {
  const palette: PaletteV3 = {
    version: "3.0",
    categories: [
      {
        label: "Nodes",
        image: "",
        id: "nodes",
        description: "Nodes",
        node_types: [],
      },
    ],
  };

  for (const { op, description, label, image, ...rest } of nodes) {
    palette.categories![0].node_types!.push({
      op,
      description,
      id: "",
      label: label,
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
        ui_data: {
          description,
          label,
          image,
          x_pos: 0,
          y_pos: 0,
        },
      },
    });
  }
  return palette;
}

function render(
  ui: Parameters<typeof rtlRender>[0],
  renderOptions?: Parameters<typeof rtlRender>[1]
) {
  const Wrapper: React.FC = ({ children }) => {
    return <InternalThemeProvider>{children}</InternalThemeProvider>;
  };

  return {
    ...rtlRender(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
  };
}

export * from "@testing-library/react";
export { render, createPalette };
