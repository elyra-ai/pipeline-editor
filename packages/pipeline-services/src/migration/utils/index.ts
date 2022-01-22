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

// mock palette created by copying palette content sent to migrate function
// and merging it into a single json object

export const mockPalette: any = {
  version: "3.0",
  categories: [
    {
      id: "Elyra",
      label: "Elyra",
      node_types: [
        {
          op: "execute-notebook-node",
          description: "Run notebook file",
          id: "notebook",
          image:
            "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20viewBox%3D%220%200%2022%2022%22%3E%0A%20%20%3Cg%20class%3D%22jp-icon-warn0%20jp-icon-selectable%22%20fill%3D%22%23EF6C00%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M18.7%203.3v15.4H3.3V3.3h15.4m1.5-1.5H1.8v18.3h18.3l.1-18.3z%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M16.5%2016.5l-5.4-4.3-5.6%204.3v-11h11z%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A",
          label: "Notebook",
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
            extensions: [".ipynb"],
            parameter_refs: {
              filehandler: "filename",
            },
            image:
              "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20viewBox%3D%220%200%2022%2022%22%3E%0A%20%20%3Cg%20class%3D%22jp-icon-warn0%20jp-icon-selectable%22%20fill%3D%22%23EF6C00%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M18.7%203.3v15.4H3.3V3.3h15.4m1.5-1.5H1.8v18.3h18.3l.1-18.3z%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M16.5%2016.5l-5.4-4.3-5.6%204.3v-11h11z%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A",
            ui_data: {
              description: "Run notebook file",
              label: "Notebook",
              image:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20viewBox%3D%220%200%2022%2022%22%3E%0A%20%20%3Cg%20class%3D%22jp-icon-warn0%20jp-icon-selectable%22%20fill%3D%22%23EF6C00%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M18.7%203.3v15.4H3.3V3.3h15.4m1.5-1.5H1.8v18.3h18.3l.1-18.3z%22%2F%3E%0A%20%20%20%20%3Cpath%20d%3D%22M16.5%2016.5l-5.4-4.3-5.6%204.3v-11h11z%22%2F%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A",
              x_pos: 0,
              y_pos: 0,
            },
            properties: {
              current_parameters: {
                label: "",
                elyra_filename: "",
                elyra_runtime_image: "",
                elyra_cpu: null,
                elyra_gpu: null,
                elyra_memory: null,
                elyra_outputs: [],
                elyra_env_vars: [],
                elyra_dependencies: [],
                elyra_include_subdirectories: false,
              },
              parameters: [
                {
                  id: "label",
                },
                {
                  id: "elyra_filename",
                },
                {
                  id: "elyra_runtime_image",
                },
                {
                  id: "elyra_cpu",
                },
                {
                  id: "elyra_gpu",
                },
                {
                  id: "elyra_memory",
                },
                {
                  id: "elyra_dependencies",
                },
                {
                  id: "elyra_include_subdirectories",
                },
                {
                  id: "elyra_env_vars",
                },
                {
                  id: "elyra_outputs",
                },
              ],
              uihints: {
                id: "nodeProperties",
                parameter_info: [
                  {
                    parameter_ref: "label",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Label",
                    },
                    description: {
                      default: "A custom label for the node.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                  {
                    parameter_ref: "elyra_filename",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Filename",
                    },
                    description: {
                      default: "The path to the Notebook.",
                      placement: "on_panel",
                    },
                    data: {
                      format: "file",
                      required: true,
                      extensions: [".ipynb"],
                    },
                  },
                  {
                    parameter_ref: "elyra_runtime_image",
                    control: "custom",
                    custom_control_id: "EnumControl",
                    label: {
                      default: "Runtime Image",
                    },
                    description: {
                      default: "Docker image used as execution environment.",
                      placement: "on_panel",
                    },
                    data: {
                      items: [],
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_cpu",
                    control: "custom",
                    custom_control_id: "NumberControl",
                    label: {
                      default: "CPU",
                    },
                    description: {
                      default:
                        "For CPU-intensive workloads, you can choose more than 1 CPU (e.g. 1.5).",
                      placement: "on_panel",
                    },
                    data: {
                      minimum: 0,
                      maximum: 99,
                    },
                  },
                  {
                    parameter_ref: "elyra_gpu",
                    control: "custom",
                    custom_control_id: "NumberControl",
                    label: {
                      default: "GPU",
                    },
                    description: {
                      default:
                        "For GPU-intensive workloads, you can choose more than 1 GPU. Must be an integer.",
                      placement: "on_panel",
                    },
                    data: {
                      minimum: 0,
                      maximum: 99,
                    },
                  },
                  {
                    parameter_ref: "elyra_memory",
                    control: "custom",
                    custom_control_id: "NumberControl",
                    label: {
                      default: "RAM(GB)",
                    },
                    description: {
                      default: "The total amount of RAM specified.",
                      placement: "on_panel",
                    },
                    data: {
                      minimum: 0,
                      maximum: 99,
                    },
                  },
                  {
                    parameter_ref: "elyra_dependencies",
                    control: "custom",
                    custom_control_id: "StringArrayControl",
                    label: {
                      default: "File Dependencies",
                    },
                    description: {
                      default:
                        "Local file dependencies that need to be copied to remote execution environment.",
                      placement: "on_panel",
                    },
                    data: {
                      placeholder: "*.py",
                      format: "file",
                    },
                  },
                  {
                    parameter_ref: "elyra_include_subdirectories",
                    control: "custom",
                    custom_control_id: "BooleanControl",
                    label: {
                      default: "Include Subdirectories",
                      placement: "on_panel",
                    },
                    data: {
                      description:
                        "Recursively include subdirectories when submitting a pipeline (This may increase submission time).",
                    },
                  },
                  {
                    parameter_ref: "elyra_env_vars",
                    control: "custom",
                    custom_control_id: "StringArrayControl",
                    label: {
                      default: "Environment Variables",
                    },
                    description: {
                      default:
                        "Environment variables to be set on the execution environment.",
                      placement: "on_panel",
                    },
                    data: {
                      placeholder: "env_var=VALUE",
                      canRefresh: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_outputs",
                    control: "custom",
                    custom_control_id: "StringArrayControl",
                    label: {
                      default: "Output Files",
                    },
                    description: {
                      default:
                        "Files generated during execution that will become available to all subsequent pipeline steps.",
                      placement: "on_panel",
                    },
                    data: {
                      placeholder: "*.csv",
                    },
                  },
                ],
                group_info: [
                  {
                    id: "nodeGroupInfo",
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
                        id: "elyra_resources",
                        type: "controls",
                        parameter_refs: [
                          "elyra_cpu",
                          "elyra_gpu",
                          "elyra_memory",
                        ],
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
              resources: {},
            },
          },
        },
        {
          op: "execute-python-node",
          description: "Run Python script",
          id: "python-script",
          image:
            "data:image/svg+xml;utf8,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%20238%20237%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20overflow%3D%22hidden%22%3E%0A%20%20%20%20%3Cdefs%3E%0A%20%20%20%20%20%20%20%20%3CclipPath%20id%3D%22clip0%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M706-314%20944-314%20944-77%20706-77Z%22%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FclipPath%3E%0A%20%20%20%20%3C%2Fdefs%3E%0A%20%20%20%20%3Cg%20clip-path%3D%22url(%23clip0)%22%20transform%3D%22translate(-706%20314)%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M792.441-295.763C786.496-295.763%20781.697-290.979%20781.697-285.062%20781.697-279.166%20786.496-274.382%20792.441-274.382%20798.365-274.382%20803.184-279.166%20803.184-285.062%20803.184-290.979%20798.365-295.763%20792.441-295.763ZM823.472-312.998C833.277-313.043%20843.484-312.329%20853.336-310.724%20868.899-308.185%20882-296.728%20882-281.516L882-228.072C882-212.398%20869.282-199.557%20853.336-199.557L796.03-199.557C776.58-199.557%20760.189-183.169%20760.189-164.641L760.189-139%20740.485-139C723.817-139%20714.114-150.877%20710.037-167.494%20704.538-189.82%20704.772-203.124%20710.037-224.505%20714.602-243.159%20729.189-253%20745.857-253L767.365-253%20824.693-253%20824.693-260.134%20767.365-260.134%20767.365-281.516C767.365-297.715%20771.76-306.527%20796.03-310.724%20804.268-312.151%20813.668-312.953%20823.472-312.998Z%22%20fill%3D%22%23366A96%22%20fill-rule%3D%22evenodd%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M857.377-117.071C851.466-117.071%20846.655-112.267%20846.655-106.348%20846.655-100.406%20851.466-95.6026%20857.377-95.6026%20863.31-95.6026%20868.099-100.406%20868.099-106.348%20868.099-112.267%20863.31-117.071%20857.377-117.071ZM889.563-253%20911.007-253C927.662-253%20935.502-240.696%20939.614-224.39%20945.334-201.743%20945.589-184.804%20939.614-167.148%20933.828-150%20927.642-138.539%20911.007-138.539L882.402-138.539%20825.211-138.539%20825.211-131.375%20882.402-131.375%20882.402-109.908C882.402-93.6435%20868.205-85.4055%20853.796-81.2973%20832.12-75.1034%20814.722-76.0513%20796.606-81.2973%20781.476-85.6801%20768-94.6332%20768-109.908L768-163.568C768-179.01%20780.947-192.199%20796.606-192.199L853.796-192.199C872.846-192.199%20889.563-208.568%20889.563-227.971Z%22%20fill%3D%22%23FFC836%22%20fill-rule%3D%22evenodd%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A",
          label: "Python Script",
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
            extensions: [".py"],
            parameter_refs: {
              filehandler: "filename",
            },
            image:
              "data:image/svg+xml;utf8,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%20238%20237%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20overflow%3D%22hidden%22%3E%0A%20%20%20%20%3Cdefs%3E%0A%20%20%20%20%20%20%20%20%3CclipPath%20id%3D%22clip0%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M706-314%20944-314%20944-77%20706-77Z%22%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FclipPath%3E%0A%20%20%20%20%3C%2Fdefs%3E%0A%20%20%20%20%3Cg%20clip-path%3D%22url(%23clip0)%22%20transform%3D%22translate(-706%20314)%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M792.441-295.763C786.496-295.763%20781.697-290.979%20781.697-285.062%20781.697-279.166%20786.496-274.382%20792.441-274.382%20798.365-274.382%20803.184-279.166%20803.184-285.062%20803.184-290.979%20798.365-295.763%20792.441-295.763ZM823.472-312.998C833.277-313.043%20843.484-312.329%20853.336-310.724%20868.899-308.185%20882-296.728%20882-281.516L882-228.072C882-212.398%20869.282-199.557%20853.336-199.557L796.03-199.557C776.58-199.557%20760.189-183.169%20760.189-164.641L760.189-139%20740.485-139C723.817-139%20714.114-150.877%20710.037-167.494%20704.538-189.82%20704.772-203.124%20710.037-224.505%20714.602-243.159%20729.189-253%20745.857-253L767.365-253%20824.693-253%20824.693-260.134%20767.365-260.134%20767.365-281.516C767.365-297.715%20771.76-306.527%20796.03-310.724%20804.268-312.151%20813.668-312.953%20823.472-312.998Z%22%20fill%3D%22%23366A96%22%20fill-rule%3D%22evenodd%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M857.377-117.071C851.466-117.071%20846.655-112.267%20846.655-106.348%20846.655-100.406%20851.466-95.6026%20857.377-95.6026%20863.31-95.6026%20868.099-100.406%20868.099-106.348%20868.099-112.267%20863.31-117.071%20857.377-117.071ZM889.563-253%20911.007-253C927.662-253%20935.502-240.696%20939.614-224.39%20945.334-201.743%20945.589-184.804%20939.614-167.148%20933.828-150%20927.642-138.539%20911.007-138.539L882.402-138.539%20825.211-138.539%20825.211-131.375%20882.402-131.375%20882.402-109.908C882.402-93.6435%20868.205-85.4055%20853.796-81.2973%20832.12-75.1034%20814.722-76.0513%20796.606-81.2973%20781.476-85.6801%20768-94.6332%20768-109.908L768-163.568C768-179.01%20780.947-192.199%20796.606-192.199L853.796-192.199C872.846-192.199%20889.563-208.568%20889.563-227.971Z%22%20fill%3D%22%23FFC836%22%20fill-rule%3D%22evenodd%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A",
            ui_data: {
              description: "Run Python script",
              label: "Python Script",
              image:
                "data:image/svg+xml;utf8,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%20238%20237%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20overflow%3D%22hidden%22%3E%0A%20%20%20%20%3Cdefs%3E%0A%20%20%20%20%20%20%20%20%3CclipPath%20id%3D%22clip0%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M706-314%20944-314%20944-77%20706-77Z%22%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FclipPath%3E%0A%20%20%20%20%3C%2Fdefs%3E%0A%20%20%20%20%3Cg%20clip-path%3D%22url(%23clip0)%22%20transform%3D%22translate(-706%20314)%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M792.441-295.763C786.496-295.763%20781.697-290.979%20781.697-285.062%20781.697-279.166%20786.496-274.382%20792.441-274.382%20798.365-274.382%20803.184-279.166%20803.184-285.062%20803.184-290.979%20798.365-295.763%20792.441-295.763ZM823.472-312.998C833.277-313.043%20843.484-312.329%20853.336-310.724%20868.899-308.185%20882-296.728%20882-281.516L882-228.072C882-212.398%20869.282-199.557%20853.336-199.557L796.03-199.557C776.58-199.557%20760.189-183.169%20760.189-164.641L760.189-139%20740.485-139C723.817-139%20714.114-150.877%20710.037-167.494%20704.538-189.82%20704.772-203.124%20710.037-224.505%20714.602-243.159%20729.189-253%20745.857-253L767.365-253%20824.693-253%20824.693-260.134%20767.365-260.134%20767.365-281.516C767.365-297.715%20771.76-306.527%20796.03-310.724%20804.268-312.151%20813.668-312.953%20823.472-312.998Z%22%20fill%3D%22%23366A96%22%20fill-rule%3D%22evenodd%22%2F%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M857.377-117.071C851.466-117.071%20846.655-112.267%20846.655-106.348%20846.655-100.406%20851.466-95.6026%20857.377-95.6026%20863.31-95.6026%20868.099-100.406%20868.099-106.348%20868.099-112.267%20863.31-117.071%20857.377-117.071ZM889.563-253%20911.007-253C927.662-253%20935.502-240.696%20939.614-224.39%20945.334-201.743%20945.589-184.804%20939.614-167.148%20933.828-150%20927.642-138.539%20911.007-138.539L882.402-138.539%20825.211-138.539%20825.211-131.375%20882.402-131.375%20882.402-109.908C882.402-93.6435%20868.205-85.4055%20853.796-81.2973%20832.12-75.1034%20814.722-76.0513%20796.606-81.2973%20781.476-85.6801%20768-94.6332%20768-109.908L768-163.568C768-179.01%20780.947-192.199%20796.606-192.199L853.796-192.199C872.846-192.199%20889.563-208.568%20889.563-227.971Z%22%20fill%3D%22%23FFC836%22%20fill-rule%3D%22evenodd%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A",
              x_pos: 0,
              y_pos: 0,
            },
            properties: {
              current_parameters: {
                label: "",
                elyra_filename: "",
                elyra_runtime_image: "",
                elyra_cpu: null,
                elyra_gpu: null,
                elyra_memory: null,
                elyra_outputs: [],
                elyra_env_vars: [],
                elyra_dependencies: [],
                elyra_include_subdirectories: false,
              },
              parameters: [
                {
                  id: "label",
                },
                {
                  id: "elyra_filename",
                },
                {
                  id: "elyra_runtime_image",
                },
                {
                  id: "elyra_cpu",
                },
                {
                  id: "elyra_gpu",
                },
                {
                  id: "elyra_memory",
                },
                {
                  id: "elyra_dependencies",
                },
                {
                  id: "elyra_include_subdirectories",
                },
                {
                  id: "elyra_env_vars",
                },
                {
                  id: "elyra_outputs",
                },
              ],
              uihints: {
                id: "nodeProperties",
                parameter_info: [
                  {
                    parameter_ref: "label",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Label",
                    },
                    description: {
                      default: "A custom label for the node.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                  {
                    parameter_ref: "elyra_filename",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Filename",
                    },
                    description: {
                      default: "The path to the Python Script.",
                      placement: "on_panel",
                    },
                    data: {
                      format: "file",
                      required: true,
                      extensions: [".py"],
                    },
                  },
                  {
                    parameter_ref: "elyra_runtime_image",
                    control: "custom",
                    custom_control_id: "EnumControl",
                    label: {
                      default: "Runtime Image",
                    },
                    description: {
                      default: "Docker image used as execution environment.",
                      placement: "on_panel",
                    },
                    data: {
                      items: [],
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_cpu",
                    control: "custom",
                    custom_control_id: "NumberControl",
                    label: {
                      default: "CPU",
                    },
                    description: {
                      default:
                        "For CPU-intensive workloads, you can choose more than 1 CPU (e.g. 1.5).",
                      placement: "on_panel",
                    },
                    data: {
                      minimum: 0,
                      maximum: 99,
                    },
                  },
                  {
                    parameter_ref: "elyra_gpu",
                    control: "custom",
                    custom_control_id: "NumberControl",
                    label: {
                      default: "GPU",
                    },
                    description: {
                      default:
                        "For GPU-intensive workloads, you can choose more than 1 GPU. Must be an integer.",
                      placement: "on_panel",
                    },
                    data: {
                      minimum: 0,
                      maximum: 99,
                    },
                  },
                  {
                    parameter_ref: "elyra_memory",
                    control: "custom",
                    custom_control_id: "NumberControl",
                    label: {
                      default: "RAM(GB)",
                    },
                    description: {
                      default: "The total amount of RAM specified.",
                      placement: "on_panel",
                    },
                    data: {
                      minimum: 0,
                      maximum: 99,
                    },
                  },
                  {
                    parameter_ref: "elyra_dependencies",
                    control: "custom",
                    custom_control_id: "StringArrayControl",
                    label: {
                      default: "File Dependencies",
                    },
                    description: {
                      default:
                        "Local file dependencies that need to be copied to remote execution environment.",
                      placement: "on_panel",
                    },
                    data: {
                      placeholder: "*.py",
                      format: "file",
                    },
                  },
                  {
                    parameter_ref: "elyra_include_subdirectories",
                    control: "custom",
                    custom_control_id: "BooleanControl",
                    label: {
                      default: "Include Subdirectories",
                      placement: "on_panel",
                    },
                    data: {
                      description:
                        "Recursively include subdirectories when submitting a pipeline (This may increase submission time).",
                    },
                  },
                  {
                    parameter_ref: "elyra_env_vars",
                    control: "custom",
                    custom_control_id: "StringArrayControl",
                    label: {
                      default: "Environment Variables",
                    },
                    description: {
                      default:
                        "Environment variables to be set on the execution environment.",
                      placement: "on_panel",
                    },
                    data: {
                      placeholder: "env_var=VALUE",
                      canRefresh: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_outputs",
                    control: "custom",
                    custom_control_id: "StringArrayControl",
                    label: {
                      default: "Output Files",
                    },
                    description: {
                      default:
                        "Files generated during execution that will become available to all subsequent pipeline steps.",
                      placement: "on_panel",
                    },
                    data: {
                      placeholder: "*.csv",
                    },
                  },
                ],
                group_info: [
                  {
                    id: "nodeGroupInfo",
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
                        id: "elyra_resources",
                        type: "controls",
                        parameter_refs: [
                          "elyra_cpu",
                          "elyra_gpu",
                          "elyra_memory",
                        ],
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
              resources: {},
            },
          },
        },
        {
          op: "execute-r-node",
          description: "Run R script",
          id: "r-script",
          image:
            "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20preserveAspectRatio%3D%22xMidYMid%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%20724%20561%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22gradientFill-1%22%20x1%3D%220%22%20x2%3D%221%22%20y1%3D%220%22%20y2%3D%221%22%20gradientUnits%3D%22objectBoundingBox%22%20spreadMethod%3D%22pad%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%22%20stop-color%3D%22rgb(203%2C206%2C208)%22%20stop-opacity%3D%221%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%221%22%20stop-color%3D%22rgb(132%2C131%2C139)%22%20stop-opacity%3D%221%22%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22gradientFill-2%22%20x1%3D%220%22%20x2%3D%221%22%20y1%3D%220%22%20y2%3D%221%22%20gradientUnits%3D%22objectBoundingBox%22%20spreadMethod%3D%22pad%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%22%20stop-color%3D%22rgb(39%2C109%2C195)%22%20stop-opacity%3D%221%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%221%22%20stop-color%3D%22rgb(22%2C92%2C170)%22%20stop-opacity%3D%221%22%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Cpath%20d%3D%22M361.453%2C485.937%20C162.329%2C485.937%200.906%2C377.828%200.906%2C244.469%20C0.906%2C111.109%20162.329%2C3.000%20361.453%2C3.000%20C560.578%2C3.000%20722.000%2C111.109%20722.000%2C244.469%20C722.000%2C377.828%20560.578%2C485.937%20361.453%2C485.937%20ZM416.641%2C97.406%20C265.289%2C97.406%20142.594%2C171.314%20142.594%2C262.484%20C142.594%2C353.654%20265.289%2C427.562%20416.641%2C427.562%20C567.992%2C427.562%20679.687%2C377.033%20679.687%2C262.484%20C679.687%2C147.971%20567.992%2C97.406%20416.641%2C97.406%20Z%22%20fill%3D%22url(%23gradientFill-1)%22%20fill-rule%3D%22evenodd%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M550.000%2C377.000%20C550.000%2C377.000%20571.822%2C383.585%20584.500%2C390.000%20C588.899%2C392.226%20596.510%2C396.668%20602.000%2C402.500%20C607.378%2C408.212%20610.000%2C414.000%20610.000%2C414.000%20L696.000%2C559.000%20L557.000%2C559.062%20L492.000%2C437.000%20C492.000%2C437.000%20478.690%2C414.131%20470.500%2C407.500%20C463.668%2C401.969%20460.755%2C400.000%20454.000%2C400.000%20C449.298%2C400.000%20420.974%2C400.000%20420.974%2C400.000%20L421.000%2C558.974%20L298.000%2C559.026%20L298.000%2C152.938%20L545.000%2C152.938%20C545.000%2C152.938%20657.500%2C154.967%20657.500%2C262.000%20C657.500%2C369.033%20550.000%2C377.000%20550.000%2C377.000%20ZM496.500%2C241.024%20L422.037%2C240.976%20L422.000%2C310.026%20L496.500%2C310.002%20C496.500%2C310.002%20531.000%2C309.895%20531.000%2C274.877%20C531.000%2C239.155%20496.500%2C241.024%20496.500%2C241.024%20Z%22%20fill%3D%22url(%23gradientFill-2)%22%20fill-rule%3D%22evenodd%22%2F%3E%0A%3C%2Fsvg%3E%0A",
          label: "R Script",
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
            extensions: [".r"],
            parameter_refs: {
              filehandler: "filename",
            },
            image:
              "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20preserveAspectRatio%3D%22xMidYMid%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%20724%20561%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22gradientFill-1%22%20x1%3D%220%22%20x2%3D%221%22%20y1%3D%220%22%20y2%3D%221%22%20gradientUnits%3D%22objectBoundingBox%22%20spreadMethod%3D%22pad%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%22%20stop-color%3D%22rgb(203%2C206%2C208)%22%20stop-opacity%3D%221%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%221%22%20stop-color%3D%22rgb(132%2C131%2C139)%22%20stop-opacity%3D%221%22%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22gradientFill-2%22%20x1%3D%220%22%20x2%3D%221%22%20y1%3D%220%22%20y2%3D%221%22%20gradientUnits%3D%22objectBoundingBox%22%20spreadMethod%3D%22pad%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%22%20stop-color%3D%22rgb(39%2C109%2C195)%22%20stop-opacity%3D%221%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%221%22%20stop-color%3D%22rgb(22%2C92%2C170)%22%20stop-opacity%3D%221%22%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Cpath%20d%3D%22M361.453%2C485.937%20C162.329%2C485.937%200.906%2C377.828%200.906%2C244.469%20C0.906%2C111.109%20162.329%2C3.000%20361.453%2C3.000%20C560.578%2C3.000%20722.000%2C111.109%20722.000%2C244.469%20C722.000%2C377.828%20560.578%2C485.937%20361.453%2C485.937%20ZM416.641%2C97.406%20C265.289%2C97.406%20142.594%2C171.314%20142.594%2C262.484%20C142.594%2C353.654%20265.289%2C427.562%20416.641%2C427.562%20C567.992%2C427.562%20679.687%2C377.033%20679.687%2C262.484%20C679.687%2C147.971%20567.992%2C97.406%20416.641%2C97.406%20Z%22%20fill%3D%22url(%23gradientFill-1)%22%20fill-rule%3D%22evenodd%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M550.000%2C377.000%20C550.000%2C377.000%20571.822%2C383.585%20584.500%2C390.000%20C588.899%2C392.226%20596.510%2C396.668%20602.000%2C402.500%20C607.378%2C408.212%20610.000%2C414.000%20610.000%2C414.000%20L696.000%2C559.000%20L557.000%2C559.062%20L492.000%2C437.000%20C492.000%2C437.000%20478.690%2C414.131%20470.500%2C407.500%20C463.668%2C401.969%20460.755%2C400.000%20454.000%2C400.000%20C449.298%2C400.000%20420.974%2C400.000%20420.974%2C400.000%20L421.000%2C558.974%20L298.000%2C559.026%20L298.000%2C152.938%20L545.000%2C152.938%20C545.000%2C152.938%20657.500%2C154.967%20657.500%2C262.000%20C657.500%2C369.033%20550.000%2C377.000%20550.000%2C377.000%20ZM496.500%2C241.024%20L422.037%2C240.976%20L422.000%2C310.026%20L496.500%2C310.002%20C496.500%2C310.002%20531.000%2C309.895%20531.000%2C274.877%20C531.000%2C239.155%20496.500%2C241.024%20496.500%2C241.024%20Z%22%20fill%3D%22url(%23gradientFill-2)%22%20fill-rule%3D%22evenodd%22%2F%3E%0A%3C%2Fsvg%3E%0A",
            ui_data: {
              description: "Run R script",
              label: "R Script",
              image:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20preserveAspectRatio%3D%22xMidYMid%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%20724%20561%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22gradientFill-1%22%20x1%3D%220%22%20x2%3D%221%22%20y1%3D%220%22%20y2%3D%221%22%20gradientUnits%3D%22objectBoundingBox%22%20spreadMethod%3D%22pad%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%22%20stop-color%3D%22rgb(203%2C206%2C208)%22%20stop-opacity%3D%221%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%221%22%20stop-color%3D%22rgb(132%2C131%2C139)%22%20stop-opacity%3D%221%22%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22gradientFill-2%22%20x1%3D%220%22%20x2%3D%221%22%20y1%3D%220%22%20y2%3D%221%22%20gradientUnits%3D%22objectBoundingBox%22%20spreadMethod%3D%22pad%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%22%20stop-color%3D%22rgb(39%2C109%2C195)%22%20stop-opacity%3D%221%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%221%22%20stop-color%3D%22rgb(22%2C92%2C170)%22%20stop-opacity%3D%221%22%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Cpath%20d%3D%22M361.453%2C485.937%20C162.329%2C485.937%200.906%2C377.828%200.906%2C244.469%20C0.906%2C111.109%20162.329%2C3.000%20361.453%2C3.000%20C560.578%2C3.000%20722.000%2C111.109%20722.000%2C244.469%20C722.000%2C377.828%20560.578%2C485.937%20361.453%2C485.937%20ZM416.641%2C97.406%20C265.289%2C97.406%20142.594%2C171.314%20142.594%2C262.484%20C142.594%2C353.654%20265.289%2C427.562%20416.641%2C427.562%20C567.992%2C427.562%20679.687%2C377.033%20679.687%2C262.484%20C679.687%2C147.971%20567.992%2C97.406%20416.641%2C97.406%20Z%22%20fill%3D%22url(%23gradientFill-1)%22%20fill-rule%3D%22evenodd%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M550.000%2C377.000%20C550.000%2C377.000%20571.822%2C383.585%20584.500%2C390.000%20C588.899%2C392.226%20596.510%2C396.668%20602.000%2C402.500%20C607.378%2C408.212%20610.000%2C414.000%20610.000%2C414.000%20L696.000%2C559.000%20L557.000%2C559.062%20L492.000%2C437.000%20C492.000%2C437.000%20478.690%2C414.131%20470.500%2C407.500%20C463.668%2C401.969%20460.755%2C400.000%20454.000%2C400.000%20C449.298%2C400.000%20420.974%2C400.000%20420.974%2C400.000%20L421.000%2C558.974%20L298.000%2C559.026%20L298.000%2C152.938%20L545.000%2C152.938%20C545.000%2C152.938%20657.500%2C154.967%20657.500%2C262.000%20C657.500%2C369.033%20550.000%2C377.000%20550.000%2C377.000%20ZM496.500%2C241.024%20L422.037%2C240.976%20L422.000%2C310.026%20L496.500%2C310.002%20C496.500%2C310.002%20531.000%2C309.895%20531.000%2C274.877%20C531.000%2C239.155%20496.500%2C241.024%20496.500%2C241.024%20Z%22%20fill%3D%22url(%23gradientFill-2)%22%20fill-rule%3D%22evenodd%22%2F%3E%0A%3C%2Fsvg%3E%0A",
              x_pos: 0,
              y_pos: 0,
            },
            properties: {
              current_parameters: {
                label: "",
                elyra_filename: "",
                elyra_runtime_image: "",
                elyra_cpu: null,
                elyra_gpu: null,
                elyra_memory: null,
                elyra_outputs: [],
                elyra_env_vars: [],
                elyra_dependencies: [],
                elyra_include_subdirectories: false,
              },
              parameters: [
                {
                  id: "label",
                },
                {
                  id: "elyra_filename",
                },
                {
                  id: "elyra_runtime_image",
                },
                {
                  id: "elyra_cpu",
                },
                {
                  id: "elyra_gpu",
                },
                {
                  id: "elyra_memory",
                },
                {
                  id: "elyra_dependencies",
                },
                {
                  id: "elyra_include_subdirectories",
                },
                {
                  id: "elyra_env_vars",
                },
                {
                  id: "elyra_outputs",
                },
              ],
              uihints: {
                id: "nodeProperties",
                parameter_info: [
                  {
                    parameter_ref: "label",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Label",
                    },
                    description: {
                      default: "A custom label for the node.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                  {
                    parameter_ref: "elyra_filename",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Filename",
                    },
                    description: {
                      default: "The path to the R Script.",
                      placement: "on_panel",
                    },
                    data: {
                      format: "file",
                      required: true,
                      extensions: [".r"],
                    },
                  },
                  {
                    parameter_ref: "elyra_runtime_image",
                    control: "custom",
                    custom_control_id: "EnumControl",
                    label: {
                      default: "Runtime Image",
                    },
                    description: {
                      default: "Docker image used as execution environment.",
                      placement: "on_panel",
                    },
                    data: {
                      items: [],
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_cpu",
                    control: "custom",
                    custom_control_id: "NumberControl",
                    label: {
                      default: "CPU",
                    },
                    description: {
                      default:
                        "For CPU-intensive workloads, you can choose more than 1 CPU (e.g. 1.5).",
                      placement: "on_panel",
                    },
                    data: {
                      minimum: 0,
                      maximum: 99,
                    },
                  },
                  {
                    parameter_ref: "elyra_gpu",
                    control: "custom",
                    custom_control_id: "NumberControl",
                    label: {
                      default: "GPU",
                    },
                    description: {
                      default:
                        "For GPU-intensive workloads, you can choose more than 1 GPU. Must be an integer.",
                      placement: "on_panel",
                    },
                    data: {
                      minimum: 0,
                      maximum: 99,
                    },
                  },
                  {
                    parameter_ref: "elyra_memory",
                    control: "custom",
                    custom_control_id: "NumberControl",
                    label: {
                      default: "RAM(GB)",
                    },
                    description: {
                      default: "The total amount of RAM specified.",
                      placement: "on_panel",
                    },
                    data: {
                      minimum: 0,
                      maximum: 99,
                    },
                  },
                  {
                    parameter_ref: "elyra_dependencies",
                    control: "custom",
                    custom_control_id: "StringArrayControl",
                    label: {
                      default: "File Dependencies",
                    },
                    description: {
                      default:
                        "Local file dependencies that need to be copied to remote execution environment.",
                      placement: "on_panel",
                    },
                    data: {
                      placeholder: "*.py",
                      format: "file",
                    },
                  },
                  {
                    parameter_ref: "elyra_include_subdirectories",
                    control: "custom",
                    custom_control_id: "BooleanControl",
                    label: {
                      default: "Include Subdirectories",
                      placement: "on_panel",
                    },
                    data: {
                      description:
                        "Recursively include subdirectories when submitting a pipeline (This may increase submission time).",
                    },
                  },
                  {
                    parameter_ref: "elyra_env_vars",
                    control: "custom",
                    custom_control_id: "StringArrayControl",
                    label: {
                      default: "Environment Variables",
                    },
                    description: {
                      default:
                        "Environment variables to be set on the execution environment.",
                      placement: "on_panel",
                    },
                    data: {
                      placeholder: "env_var=VALUE",
                      canRefresh: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_outputs",
                    control: "custom",
                    custom_control_id: "StringArrayControl",
                    label: {
                      default: "Output Files",
                    },
                    description: {
                      default:
                        "Files generated during execution that will become available to all subsequent pipeline steps.",
                      placement: "on_panel",
                    },
                    data: {
                      placeholder: "*.csv",
                    },
                  },
                ],
                group_info: [
                  {
                    id: "nodeGroupInfo",
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
                        id: "elyra_resources",
                        type: "controls",
                        parameter_refs: [
                          "elyra_cpu",
                          "elyra_gpu",
                          "elyra_memory",
                        ],
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
              resources: {},
            },
          },
        },
      ],
      image: "/static/elyra/pipeline-flow.svg",
    },
    {
      id: "kfp-examples",
      label: "kfp-examples",
      node_types: [
        {
          op: "elyra-kfp-examples-catalog:d68ec7fcdf46",
          description: "",
          id: "elyra-kfp-examples-catalog:d68ec7fcdf46",
          image: "/static/elyra/kubeflow.svg",
          label: "Calculate data hash",
          runtime_type: "KUBEFLOW_PIPELINES",
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
            image: "/static/elyra/kubeflow.svg",
            ui_data: {
              description: "",
              label: "Calculate data hash",
              image: "/static/elyra/kubeflow.svg",
              x_pos: 0,
              y_pos: 0,
            },
            properties: {
              current_parameters: {
                label: "",
                elyra_data: "None",
                elyra_hash_algorithm: {
                  activeControl: "StringControl",
                  StringControl: "SHA256",
                },
                elyra_output_hash: "",
                component_source:
                  "{'catalog_type': 'elyra-kfp-examples-catalog', 'component_ref': {'component-id': 'calculate_hash.yaml'}}",
              },
              parameters: [
                {
                  id: "label",
                },
                {
                  id: "elyra_data",
                },
                {
                  id: "elyra_hash_algorithm",
                },
                {
                  id: "elyra_output_hash",
                },
                {
                  id: "component_source",
                },
              ],
              uihints: {
                id: "nodeProperties",
                parameter_info: [
                  {
                    parameter_ref: "label",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Label",
                    },
                    description: {
                      default: "A custom label for the node.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                  {
                    parameter_ref: "elyra_data",
                    control: "custom",
                    custom_control_id: "NestedEnumControl",
                    label: {
                      default: "Data",
                    },
                    description: {
                      default: "",
                      placement: "on_panel",
                    },
                    data: {
                      format: "inputpath",
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_hash_algorithm",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "Hash algorithm",
                    },
                    description: {
                      default:
                        "Hash algorithm to use. Supported values are MD5, SHA1, SHA256, SHA512, SHA3 (type: String)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_output_hash",
                    control: "readonly",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Hash",
                    },
                    description: {
                      default:
                        "This is an output of this component. (type: string)",
                      placement: "on_panel",
                    },
                    data: {
                      format: "outputpath",
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "component_source",
                    control: "readonly",
                    label: {
                      default: "Component Source",
                    },
                    description: {
                      default:
                        "Unique information used to identify this component.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                ],
                group_info: [
                  {
                    id: "nodeGroupInfo",
                    type: "panels",
                    group_info: [
                      {
                        id: "label",
                        type: "controls",
                        parameter_refs: ["label"],
                      },
                      {
                        id: "elyra_data",
                        type: "controls",
                        parameter_refs: ["elyra_data"],
                      },
                      {
                        id: "elyra_hash_algorithm",
                        type: "controls",
                        parameter_refs: ["elyra_hash_algorithm"],
                      },
                      {
                        id: "elyra_output_hash",
                        type: "controls",
                        parameter_refs: ["elyra_output_hash"],
                      },
                      {
                        id: "component_source",
                        type: "controls",
                        parameter_refs: ["component_source"],
                      },
                    ],
                  },
                ],
              },
              resources: {},
            },
          },
        },
        {
          op: "elyra-kfp-examples-catalog:a08014f9252f",
          description: "",
          id: "elyra-kfp-examples-catalog:a08014f9252f",
          image: "/static/elyra/kubeflow.svg",
          label: "Download data",
          runtime_type: "KUBEFLOW_PIPELINES",
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
            image: "/static/elyra/kubeflow.svg",
            ui_data: {
              description: "",
              label: "Download data",
              image: "/static/elyra/kubeflow.svg",
              x_pos: 0,
              y_pos: 0,
            },
            properties: {
              current_parameters: {
                label: "",
                elyra_url: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_curl_options: {
                  activeControl: "StringControl",
                  StringControl: "--location",
                },
                elyra_output_data: "",
                component_source:
                  "{'catalog_type': 'elyra-kfp-examples-catalog', 'component_ref': {'component-id': 'download_data.yaml'}}",
              },
              parameters: [
                {
                  id: "label",
                },
                {
                  id: "elyra_url",
                },
                {
                  id: "elyra_curl_options",
                },
                {
                  id: "elyra_output_data",
                },
                {
                  id: "component_source",
                },
              ],
              uihints: {
                id: "nodeProperties",
                parameter_info: [
                  {
                    parameter_ref: "label",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Label",
                    },
                    description: {
                      default: "A custom label for the node.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                  {
                    parameter_ref: "elyra_url",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "Url",
                    },
                    description: {
                      default: "(type: URI)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_curl_options",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "curl options",
                    },
                    description: {
                      default:
                        "Additional options given to the curl program. See https://curl.haxx.se/docs/manpage.html (type: string)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_output_data",
                    control: "readonly",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Data",
                    },
                    description: {
                      default:
                        "This is an output of this component. (type: string)",
                      placement: "on_panel",
                    },
                    data: {
                      format: "outputpath",
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "component_source",
                    control: "readonly",
                    label: {
                      default: "Component Source",
                    },
                    description: {
                      default:
                        "Unique information used to identify this component.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                ],
                group_info: [
                  {
                    id: "nodeGroupInfo",
                    type: "panels",
                    group_info: [
                      {
                        id: "label",
                        type: "controls",
                        parameter_refs: ["label"],
                      },
                      {
                        id: "elyra_url",
                        type: "controls",
                        parameter_refs: ["elyra_url"],
                      },
                      {
                        id: "elyra_curl_options",
                        type: "controls",
                        parameter_refs: ["elyra_curl_options"],
                      },
                      {
                        id: "elyra_output_data",
                        type: "controls",
                        parameter_refs: ["elyra_output_data"],
                      },
                      {
                        id: "component_source",
                        type: "controls",
                        parameter_refs: ["component_source"],
                      },
                    ],
                  },
                ],
              },
              resources: {},
            },
          },
        },
        {
          op: "elyra-kfp-examples-catalog:737915b826e9",
          description:
            "Filter input text according to the given regex pattern using shell and grep.",
          id: "elyra-kfp-examples-catalog:737915b826e9",
          image: "/static/elyra/kubeflow.svg",
          label: "Filter text",
          runtime_type: "KUBEFLOW_PIPELINES",
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
            image: "/static/elyra/kubeflow.svg",
            ui_data: {
              description:
                "Filter input text according to the given regex pattern using shell and grep.",
              label: "Filter text",
              image: "/static/elyra/kubeflow.svg",
              x_pos: 0,
              y_pos: 0,
            },
            properties: {
              current_parameters: {
                component_description:
                  "Filter input text according to the given regex pattern using shell and grep.",
                label: "",
                elyra_text: "None",
                elyra_pattern: {
                  activeControl: "StringControl",
                  StringControl: ".*",
                },
                elyra_output_filtered_text: "",
                component_source:
                  "{'catalog_type': 'elyra-kfp-examples-catalog', 'component_ref': {'component-id': 'filter_text_using_shell_and_grep.yaml'}}",
              },
              parameters: [
                {
                  id: "component_description",
                },
                {
                  id: "label",
                },
                {
                  id: "elyra_text",
                },
                {
                  id: "elyra_pattern",
                },
                {
                  id: "elyra_output_filtered_text",
                },
                {
                  id: "component_source",
                },
              ],
              uihints: {
                id: "nodeProperties",
                parameter_info: [
                  {
                    parameter_ref: "component_description",
                    control: "readonly",
                    label: {
                      default: "Component Description",
                    },
                    description: {
                      default: " ",
                      placement: "on_panel",
                    },
                    data: {
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "label",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Label",
                    },
                    description: {
                      default: "A custom label for the node.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                  {
                    parameter_ref: "elyra_text",
                    control: "custom",
                    custom_control_id: "NestedEnumControl",
                    label: {
                      default: "Text",
                    },
                    description: {
                      default: "Path to file to be filtered",
                      placement: "on_panel",
                    },
                    data: {
                      format: "inputpath",
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_pattern",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "Pattern",
                    },
                    description: {
                      default: "Regex pattern (type: string)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_output_filtered_text",
                    control: "readonly",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Filtered text",
                    },
                    description: {
                      default:
                        "This is an output of this component. (type: string)",
                      placement: "on_panel",
                    },
                    data: {
                      format: "outputpath",
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "component_source",
                    control: "readonly",
                    label: {
                      default: "Component Source",
                    },
                    description: {
                      default:
                        "Unique information used to identify this component.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                ],
                group_info: [
                  {
                    id: "nodeGroupInfo",
                    type: "panels",
                    group_info: [
                      {
                        id: "component_description",
                        type: "controls",
                        parameter_refs: ["component_description"],
                      },
                      {
                        id: "label",
                        type: "controls",
                        parameter_refs: ["label"],
                      },
                      {
                        id: "elyra_text",
                        type: "controls",
                        parameter_refs: ["elyra_text"],
                      },
                      {
                        id: "elyra_pattern",
                        type: "controls",
                        parameter_refs: ["elyra_pattern"],
                      },
                      {
                        id: "elyra_output_filtered_text",
                        type: "controls",
                        parameter_refs: ["elyra_output_filtered_text"],
                      },
                      {
                        id: "component_source",
                        type: "controls",
                        parameter_refs: ["component_source"],
                      },
                    ],
                  },
                ],
              },
              resources: {},
            },
          },
        },
        {
          op: "elyra-kfp-examples-catalog:61e6f4141f65",
          description:
            "Run Jupyter notebook using papermill. The notebook will receive the parameter values passed to it as well as the INPUT_DATA_PATH and OUTPUT_DATA_PATH variables that will be set to the input data path (if provided) and directory for the optional output data.",
          id: "elyra-kfp-examples-catalog:61e6f4141f65",
          image: "/static/elyra/kubeflow.svg",
          label: "Run notebook using papermill",
          runtime_type: "KUBEFLOW_PIPELINES",
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
            image: "/static/elyra/kubeflow.svg",
            ui_data: {
              description:
                "Run Jupyter notebook using papermill. The notebook will receive the parameter values passed to it as well as the INPUT_DATA_PATH and OUTPUT_DATA_PATH variables that will be set to the input data path (if provided) and directory for the optional output data.",
              label: "Run notebook using papermill",
              image: "/static/elyra/kubeflow.svg",
              x_pos: 0,
              y_pos: 0,
            },
            properties: {
              current_parameters: {
                component_description:
                  "Run Jupyter notebook using papermill. The notebook will receive the parameter values passed to it as well as the INPUT_DATA_PATH and OUTPUT_DATA_PATH variables that will be set to the input data path (if provided) and directory for the optional output data.",
                label: "",
                elyra_notebook: "None",
                elyra_parameters: {
                  activeControl: "StringControl",
                  StringControl: "{}",
                },
                elyra_packages_to_install: {
                  activeControl: "StringControl",
                  StringControl: "[]",
                },
                elyra_input_data: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_output_notebook: "",
                elyra_output_output_data: "",
                component_source:
                  "{'catalog_type': 'elyra-kfp-examples-catalog', 'component_ref': {'component-id': 'run_notebook_using_papermill.yaml'}}",
              },
              parameters: [
                {
                  id: "component_description",
                },
                {
                  id: "label",
                },
                {
                  id: "elyra_notebook",
                },
                {
                  id: "elyra_parameters",
                },
                {
                  id: "elyra_packages_to_install",
                },
                {
                  id: "elyra_input_data",
                },
                {
                  id: "elyra_output_notebook",
                },
                {
                  id: "elyra_output_output_data",
                },
                {
                  id: "component_source",
                },
              ],
              uihints: {
                id: "nodeProperties",
                parameter_info: [
                  {
                    parameter_ref: "component_description",
                    control: "readonly",
                    label: {
                      default: "Component Description",
                    },
                    description: {
                      default: " ",
                      placement: "on_panel",
                    },
                    data: {
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "label",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Label",
                    },
                    description: {
                      default: "A custom label for the node.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                  {
                    parameter_ref: "elyra_notebook",
                    control: "custom",
                    custom_control_id: "NestedEnumControl",
                    label: {
                      default: "Notebook",
                    },
                    description: {
                      default: "Required. Notebook to execute.",
                      placement: "on_panel",
                    },
                    data: {
                      format: "inputpath",
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_parameters",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "Parameters",
                    },
                    description: {
                      default:
                        "Map with notebook parameter values. (type: JsonObject)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_packages_to_install",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "Packages to install",
                    },
                    description: {
                      default: "Python packages to install (type: JsonArray)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "list",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_input_data",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "Input data",
                    },
                    description: {
                      default:
                        "Optional data that can be passed to notebook. In notebook, the INPUT_DATA_PATH variable will point to the data (if passed). (type: string)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_output_notebook",
                    control: "readonly",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Notebook",
                    },
                    description: {
                      default:
                        "This is an output of this component. Executed notebook. (type: JupyterNotebook)",
                      placement: "on_panel",
                    },
                    data: {
                      format: "outputpath",
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_output_output_data",
                    control: "readonly",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Output data",
                    },
                    description: {
                      default:
                        "This is an output of this component. Directory with any output data. In notebook, the OUTPUT_DATA_PATH variable will point to this directory, so that the notebook can write output data there. (type: string)",
                      placement: "on_panel",
                    },
                    data: {
                      format: "outputpath",
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "component_source",
                    control: "readonly",
                    label: {
                      default: "Component Source",
                    },
                    description: {
                      default:
                        "Unique information used to identify this component.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                ],
                group_info: [
                  {
                    id: "nodeGroupInfo",
                    type: "panels",
                    group_info: [
                      {
                        id: "component_description",
                        type: "controls",
                        parameter_refs: ["component_description"],
                      },
                      {
                        id: "label",
                        type: "controls",
                        parameter_refs: ["label"],
                      },
                      {
                        id: "elyra_notebook",
                        type: "controls",
                        parameter_refs: ["elyra_notebook"],
                      },
                      {
                        id: "elyra_parameters",
                        type: "controls",
                        parameter_refs: ["elyra_parameters"],
                      },
                      {
                        id: "elyra_packages_to_install",
                        type: "controls",
                        parameter_refs: ["elyra_packages_to_install"],
                      },
                      {
                        id: "elyra_input_data",
                        type: "controls",
                        parameter_refs: ["elyra_input_data"],
                      },
                      {
                        id: "elyra_output_notebook",
                        type: "controls",
                        parameter_refs: ["elyra_output_notebook"],
                      },
                      {
                        id: "elyra_output_output_data",
                        type: "controls",
                        parameter_refs: ["elyra_output_output_data"],
                      },
                      {
                        id: "component_source",
                        type: "controls",
                        parameter_refs: ["component_source"],
                      },
                    ],
                  },
                ],
              },
              resources: {},
            },
          },
        },
      ],
      image: "/static/elyra/kubeflow.svg",
    },
    {
      id: "airflow-examples",
      label: "airflow-examples",
      node_types: [
        {
          op: "elyra-airflow-examples-catalog:3a55d015ea96",
          description: "",
          id: "elyra-airflow-examples-catalog:3a55d015ea96",
          image: "/static/elyra/airflow.svg",
          label: "BashOperator",
          runtime_type: "APACHE_AIRFLOW",
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
            image: "/static/elyra/airflow.svg",
            ui_data: {
              description: "",
              label: "BashOperator",
              image: "/static/elyra/airflow.svg",
              x_pos: 0,
              y_pos: 0,
            },
            properties: {
              current_parameters: {
                label: "",
                elyra_bash_command: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_xcom_push: {
                  activeControl: "BooleanControl",
                  BooleanControl: false,
                },
                elyra_env: {
                  activeControl: "StringControl",
                  StringControl: "{}",
                },
                elyra_output_encoding: {
                  activeControl: "StringControl",
                  StringControl: "utf-8",
                },
                component_source:
                  "{'catalog_type': 'elyra-airflow-examples-catalog', 'component_ref': {'component-id': 'bash_operator.py'}}",
              },
              parameters: [
                {
                  id: "label",
                },
                {
                  id: "elyra_bash_command",
                },
                {
                  id: "elyra_xcom_push",
                },
                {
                  id: "elyra_env",
                },
                {
                  id: "elyra_output_encoding",
                },
                {
                  id: "component_source",
                },
              ],
              uihints: {
                id: "nodeProperties",
                parameter_info: [
                  {
                    parameter_ref: "label",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Label",
                    },
                    description: {
                      default: "A custom label for the node.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                  {
                    parameter_ref: "elyra_bash_command",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "bash_command",
                    },
                    description: {
                      default:
                        "The command, set of commands or reference to a        bash script (must be '.sh') to be executed. (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_xcom_push",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "xcom_push",
                    },
                    description: {
                      default:
                        "If xcom_push is True, the last line written to stdout        will also be pushed to an XCom when the bash command completes. (type: bool)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        BooleanControl: {
                          label: "Please select or deselect the checkbox :",
                          format: "boolean",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_env",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "env",
                    },
                    description: {
                      default:
                        "If env is not None, it must be a mapping that defines the        environment variables for the new process; these are used instead        of inheriting the current process environment, which is the default        behavior. (templated) (type: dict)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "dictionary",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_output_encoding",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "output_encoding",
                    },
                    description: {
                      default: "Output encoding of bash command (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "component_source",
                    control: "readonly",
                    label: {
                      default: "Component Source",
                    },
                    description: {
                      default:
                        "Unique information used to identify this component.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                ],
                group_info: [
                  {
                    id: "nodeGroupInfo",
                    type: "panels",
                    group_info: [
                      {
                        id: "label",
                        type: "controls",
                        parameter_refs: ["label"],
                      },
                      {
                        id: "elyra_bash_command",
                        type: "controls",
                        parameter_refs: ["elyra_bash_command"],
                      },
                      {
                        id: "elyra_xcom_push",
                        type: "controls",
                        parameter_refs: ["elyra_xcom_push"],
                      },
                      {
                        id: "elyra_env",
                        type: "controls",
                        parameter_refs: ["elyra_env"],
                      },
                      {
                        id: "elyra_output_encoding",
                        type: "controls",
                        parameter_refs: ["elyra_output_encoding"],
                      },
                      {
                        id: "component_source",
                        type: "controls",
                        parameter_refs: ["component_source"],
                      },
                    ],
                  },
                ],
              },
              resources: {},
            },
          },
        },
        {
          op: "elyra-airflow-examples-catalog:a043648d3897",
          description: "",
          id: "elyra-airflow-examples-catalog:a043648d3897",
          image: "/static/elyra/airflow.svg",
          label: "EmailOperator",
          runtime_type: "APACHE_AIRFLOW",
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
            image: "/static/elyra/airflow.svg",
            ui_data: {
              description: "",
              label: "EmailOperator",
              image: "/static/elyra/airflow.svg",
              x_pos: 0,
              y_pos: 0,
            },
            properties: {
              current_parameters: {
                label: "",
                elyra_to: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_subject: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_html_content: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_files: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_cc: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_bcc: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_mime_subtype: {
                  activeControl: "StringControl",
                  StringControl: "mixed",
                },
                elyra_mime_charset: {
                  activeControl: "StringControl",
                  StringControl: "us_ascii",
                },
                component_source:
                  "{'catalog_type': 'elyra-airflow-examples-catalog', 'component_ref': {'component-id': 'email_operator.py'}}",
              },
              parameters: [
                {
                  id: "label",
                },
                {
                  id: "elyra_to",
                },
                {
                  id: "elyra_subject",
                },
                {
                  id: "elyra_html_content",
                },
                {
                  id: "elyra_files",
                },
                {
                  id: "elyra_cc",
                },
                {
                  id: "elyra_bcc",
                },
                {
                  id: "elyra_mime_subtype",
                },
                {
                  id: "elyra_mime_charset",
                },
                {
                  id: "component_source",
                },
              ],
              uihints: {
                id: "nodeProperties",
                parameter_info: [
                  {
                    parameter_ref: "label",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Label",
                    },
                    description: {
                      default: "A custom label for the node.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                  {
                    parameter_ref: "elyra_to",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "to",
                    },
                    description: {
                      default:
                        "list of emails to send the email to. (templated) (type: list or string (comma or semicolon delimited))",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "list",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_subject",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "subject",
                    },
                    description: {
                      default:
                        "subject line for the email. (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_html_content",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "html_content",
                    },
                    description: {
                      default:
                        "content of the email, html markup        is allowed. (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_files",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "files",
                    },
                    description: {
                      default: "file names to attach in email (type: list)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "list",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_cc",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "cc",
                    },
                    description: {
                      default:
                        "list of recipients to be added in CC field (type: list or string (comma or semicolon delimited))",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "list",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_bcc",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "bcc",
                    },
                    description: {
                      default:
                        "list of recipients to be added in BCC field (type: list or string (comma or semicolon delimited))",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "list",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_mime_subtype",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "mime_subtype",
                    },
                    description: {
                      default: "MIME sub content type (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_mime_charset",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "mime_charset",
                    },
                    description: {
                      default:
                        "character set parameter added to the Content-Type        header. (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "component_source",
                    control: "readonly",
                    label: {
                      default: "Component Source",
                    },
                    description: {
                      default:
                        "Unique information used to identify this component.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                ],
                group_info: [
                  {
                    id: "nodeGroupInfo",
                    type: "panels",
                    group_info: [
                      {
                        id: "label",
                        type: "controls",
                        parameter_refs: ["label"],
                      },
                      {
                        id: "elyra_to",
                        type: "controls",
                        parameter_refs: ["elyra_to"],
                      },
                      {
                        id: "elyra_subject",
                        type: "controls",
                        parameter_refs: ["elyra_subject"],
                      },
                      {
                        id: "elyra_html_content",
                        type: "controls",
                        parameter_refs: ["elyra_html_content"],
                      },
                      {
                        id: "elyra_files",
                        type: "controls",
                        parameter_refs: ["elyra_files"],
                      },
                      {
                        id: "elyra_cc",
                        type: "controls",
                        parameter_refs: ["elyra_cc"],
                      },
                      {
                        id: "elyra_bcc",
                        type: "controls",
                        parameter_refs: ["elyra_bcc"],
                      },
                      {
                        id: "elyra_mime_subtype",
                        type: "controls",
                        parameter_refs: ["elyra_mime_subtype"],
                      },
                      {
                        id: "elyra_mime_charset",
                        type: "controls",
                        parameter_refs: ["elyra_mime_charset"],
                      },
                      {
                        id: "component_source",
                        type: "controls",
                        parameter_refs: ["component_source"],
                      },
                    ],
                  },
                ],
              },
              resources: {},
            },
          },
        },
        {
          op: "elyra-airflow-examples-catalog:b94cd49692e2",
          description: "",
          id: "elyra-airflow-examples-catalog:b94cd49692e2",
          image: "/static/elyra/airflow.svg",
          label: "SimpleHttpOperator",
          runtime_type: "APACHE_AIRFLOW",
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
            image: "/static/elyra/airflow.svg",
            ui_data: {
              description: "",
              label: "SimpleHttpOperator",
              image: "/static/elyra/airflow.svg",
              x_pos: 0,
              y_pos: 0,
            },
            properties: {
              current_parameters: {
                label: "",
                elyra_endpoint: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_method: {
                  activeControl: "StringControl",
                  StringControl: "POST",
                },
                elyra_data: {
                  activeControl: "StringControl",
                  StringControl: "{}",
                },
                elyra_headers: {
                  activeControl: "StringControl",
                  StringControl: "{}",
                },
                elyra_response_check: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_extra_options: {
                  activeControl: "StringControl",
                  StringControl: "{}",
                },
                elyra_xcom_push: {
                  activeControl: "BooleanControl",
                  BooleanControl: false,
                },
                elyra_http_conn_id: {
                  activeControl: "StringControl",
                  StringControl: "http_default",
                },
                elyra_log_response: {
                  activeControl: "BooleanControl",
                  BooleanControl: false,
                },
                component_source:
                  "{'catalog_type': 'elyra-airflow-examples-catalog', 'component_ref': {'component-id': 'http_operator.py'}}",
              },
              parameters: [
                {
                  id: "label",
                },
                {
                  id: "elyra_endpoint",
                },
                {
                  id: "elyra_method",
                },
                {
                  id: "elyra_data",
                },
                {
                  id: "elyra_headers",
                },
                {
                  id: "elyra_response_check",
                },
                {
                  id: "elyra_extra_options",
                },
                {
                  id: "elyra_xcom_push",
                },
                {
                  id: "elyra_http_conn_id",
                },
                {
                  id: "elyra_log_response",
                },
                {
                  id: "component_source",
                },
              ],
              uihints: {
                id: "nodeProperties",
                parameter_info: [
                  {
                    parameter_ref: "label",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Label",
                    },
                    description: {
                      default: "A custom label for the node.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                  {
                    parameter_ref: "elyra_endpoint",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "endpoint",
                    },
                    description: {
                      default:
                        "The relative part of the full url. (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_method",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "method",
                    },
                    description: {
                      default:
                        "The HTTP method to use, default = 'POST' (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_data",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "data",
                    },
                    description: {
                      default:
                        "The data to pass. POST-data in POST/PUT and params        in the URL for a GET request. (templated) (type: For POST/PUT, depends on the content-type parameter,        for GET a dictionary of key/value string pairs)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "dictionary",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_headers",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "headers",
                    },
                    description: {
                      default:
                        "The HTTP headers to be added to the GET request (type: a dictionary of string key/value pairs)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "dictionary",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_response_check",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "response_check",
                    },
                    description: {
                      default:
                        "A check against the 'requests' response object.        Returns True for 'pass' and False otherwise. (type: A lambda or defined function.)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_extra_options",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "extra_options",
                    },
                    description: {
                      default:
                        "Extra options for the 'requests' library, see the        'requests' documentation (options to modify timeout, ssl, etc.) (type: A dictionary of options, where key is string and value        depends on the option that's being modified.)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "dictionary",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_xcom_push",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "xcom_push",
                    },
                    description: {
                      default:
                        "Push the response to Xcom (default: False).        If xcom_push is True, response of an HTTP request will also        be pushed to an XCom. (type: bool)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        BooleanControl: {
                          label: "Please select or deselect the checkbox :",
                          format: "boolean",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_http_conn_id",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "http_conn_id",
                    },
                    description: {
                      default:
                        "The connection to run the operator against (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_log_response",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "log_response",
                    },
                    description: {
                      default: "Log the response (default: False) (type: bool)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        BooleanControl: {
                          label: "Please select or deselect the checkbox :",
                          format: "boolean",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "component_source",
                    control: "readonly",
                    label: {
                      default: "Component Source",
                    },
                    description: {
                      default:
                        "Unique information used to identify this component.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                ],
                group_info: [
                  {
                    id: "nodeGroupInfo",
                    type: "panels",
                    group_info: [
                      {
                        id: "label",
                        type: "controls",
                        parameter_refs: ["label"],
                      },
                      {
                        id: "elyra_endpoint",
                        type: "controls",
                        parameter_refs: ["elyra_endpoint"],
                      },
                      {
                        id: "elyra_method",
                        type: "controls",
                        parameter_refs: ["elyra_method"],
                      },
                      {
                        id: "elyra_data",
                        type: "controls",
                        parameter_refs: ["elyra_data"],
                      },
                      {
                        id: "elyra_headers",
                        type: "controls",
                        parameter_refs: ["elyra_headers"],
                      },
                      {
                        id: "elyra_response_check",
                        type: "controls",
                        parameter_refs: ["elyra_response_check"],
                      },
                      {
                        id: "elyra_extra_options",
                        type: "controls",
                        parameter_refs: ["elyra_extra_options"],
                      },
                      {
                        id: "elyra_xcom_push",
                        type: "controls",
                        parameter_refs: ["elyra_xcom_push"],
                      },
                      {
                        id: "elyra_http_conn_id",
                        type: "controls",
                        parameter_refs: ["elyra_http_conn_id"],
                      },
                      {
                        id: "elyra_log_response",
                        type: "controls",
                        parameter_refs: ["elyra_log_response"],
                      },
                      {
                        id: "component_source",
                        type: "controls",
                        parameter_refs: ["component_source"],
                      },
                    ],
                  },
                ],
              },
              resources: {},
            },
          },
        },
        {
          op: "elyra-airflow-examples-catalog:16a204f716a2",
          description: "",
          id: "elyra-airflow-examples-catalog:16a204f716a2",
          image: "/static/elyra/airflow.svg",
          label: "SlackAPIPostOperator",
          runtime_type: "APACHE_AIRFLOW",
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
            image: "/static/elyra/airflow.svg",
            ui_data: {
              description: "",
              label: "SlackAPIPostOperator",
              image: "/static/elyra/airflow.svg",
              x_pos: 0,
              y_pos: 0,
            },
            properties: {
              current_parameters: {
                label: "",
                elyra_slack_conn_id: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_token: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_api_params: {
                  activeControl: "StringControl",
                  StringControl: "{}",
                },
                elyra_channel: {
                  activeControl: "StringControl",
                  StringControl: "#general",
                },
                elyra_username: {
                  activeControl: "StringControl",
                  StringControl: "Airflow",
                },
                elyra_text: {
                  activeControl: "StringControl",
                  StringControl:
                    "No message has been set. Here is a cat video instead https://www.youtube.com/watch?v=J---aiyznGQ",
                },
                elyra_icon_url: {
                  activeControl: "StringControl",
                  StringControl:
                    "https://raw.githubusercontent.com/apache/airflow/master/airflow/www/static/pin_100.png",
                },
                elyra_attachments: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_blocks: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                component_source:
                  "{'catalog_type': 'elyra-airflow-examples-catalog', 'component_ref': {'component-id': 'slack_operator.py'}}",
              },
              parameters: [
                {
                  id: "label",
                },
                {
                  id: "elyra_slack_conn_id",
                },
                {
                  id: "elyra_token",
                },
                {
                  id: "elyra_api_params",
                },
                {
                  id: "elyra_channel",
                },
                {
                  id: "elyra_username",
                },
                {
                  id: "elyra_text",
                },
                {
                  id: "elyra_icon_url",
                },
                {
                  id: "elyra_attachments",
                },
                {
                  id: "elyra_blocks",
                },
                {
                  id: "component_source",
                },
              ],
              uihints: {
                id: "nodeProperties",
                parameter_info: [
                  {
                    parameter_ref: "label",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Label",
                    },
                    description: {
                      default: "A custom label for the node.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                  {
                    parameter_ref: "elyra_slack_conn_id",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "slack_conn_id",
                    },
                    description: {
                      default:
                        "Slack connection ID which its password is Slack API token (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_token",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "token",
                    },
                    description: {
                      default:
                        "Slack API token (https://api.slack.com/web) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_api_params",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "api_params",
                    },
                    description: {
                      default:
                        "API Method call parameters (https://api.slack.com/methods) (type: dict)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "dictionary",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_channel",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "channel",
                    },
                    description: {
                      default:
                        "channel in which to post message on slack name (#general) or        ID (C12318391). (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_username",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "username",
                    },
                    description: {
                      default:
                        "Username that airflow will be posting to Slack as. (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_text",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "text",
                    },
                    description: {
                      default:
                        "message to send to slack. (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_icon_url",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "icon_url",
                    },
                    description: {
                      default: "url to icon used for this message (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_attachments",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "attachments",
                    },
                    description: {
                      default:
                        "extra formatting details. (templated)        - see https://api.slack.com/docs/attachments. (type: list of hashes)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "list",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_blocks",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "blocks",
                    },
                    description: {
                      default:
                        "extra block layouts. (templated)        - see https://api.slack.com/reference/block-kit/blocks. (type: list of hashes)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "list",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "component_source",
                    control: "readonly",
                    label: {
                      default: "Component Source",
                    },
                    description: {
                      default:
                        "Unique information used to identify this component.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                ],
                group_info: [
                  {
                    id: "nodeGroupInfo",
                    type: "panels",
                    group_info: [
                      {
                        id: "label",
                        type: "controls",
                        parameter_refs: ["label"],
                      },
                      {
                        id: "elyra_slack_conn_id",
                        type: "controls",
                        parameter_refs: ["elyra_slack_conn_id"],
                      },
                      {
                        id: "elyra_token",
                        type: "controls",
                        parameter_refs: ["elyra_token"],
                      },
                      {
                        id: "elyra_api_params",
                        type: "controls",
                        parameter_refs: ["elyra_api_params"],
                      },
                      {
                        id: "elyra_channel",
                        type: "controls",
                        parameter_refs: ["elyra_channel"],
                      },
                      {
                        id: "elyra_username",
                        type: "controls",
                        parameter_refs: ["elyra_username"],
                      },
                      {
                        id: "elyra_text",
                        type: "controls",
                        parameter_refs: ["elyra_text"],
                      },
                      {
                        id: "elyra_icon_url",
                        type: "controls",
                        parameter_refs: ["elyra_icon_url"],
                      },
                      {
                        id: "elyra_attachments",
                        type: "controls",
                        parameter_refs: ["elyra_attachments"],
                      },
                      {
                        id: "elyra_blocks",
                        type: "controls",
                        parameter_refs: ["elyra_blocks"],
                      },
                      {
                        id: "component_source",
                        type: "controls",
                        parameter_refs: ["component_source"],
                      },
                    ],
                  },
                ],
              },
              resources: {},
            },
          },
        },
        {
          op: "elyra-airflow-examples-catalog:3b639742748f",
          description: "",
          id: "elyra-airflow-examples-catalog:3b639742748f",
          image: "/static/elyra/airflow.svg",
          label: "SparkSqlOperator",
          runtime_type: "APACHE_AIRFLOW",
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
            image: "/static/elyra/airflow.svg",
            ui_data: {
              description: "",
              label: "SparkSqlOperator",
              image: "/static/elyra/airflow.svg",
              x_pos: 0,
              y_pos: 0,
            },
            properties: {
              current_parameters: {
                label: "",
                elyra_sql: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_conf: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_conn_id: {
                  activeControl: "StringControl",
                  StringControl: "spark_sql_default",
                },
                elyra_total_executor_cores: {
                  activeControl: "NumberControl",
                  NumberControl: 0,
                },
                elyra_executor_cores: {
                  activeControl: "NumberControl",
                  NumberControl: 0,
                },
                elyra_executor_memory: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_keytab: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_principal: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_master: {
                  activeControl: "StringControl",
                  StringControl: "yarn",
                },
                elyra_name: {
                  activeControl: "StringControl",
                  StringControl: "default-name",
                },
                elyra_num_executors: {
                  activeControl: "NumberControl",
                  NumberControl: 0,
                },
                elyra_verbose: {
                  activeControl: "BooleanControl",
                  BooleanControl: true,
                },
                elyra_yarn_queue: {
                  activeControl: "StringControl",
                  StringControl: "default",
                },
                component_source:
                  "{'catalog_type': 'elyra-airflow-examples-catalog', 'component_ref': {'component-id': 'spark_sql_operator.py'}}",
              },
              parameters: [
                {
                  id: "label",
                },
                {
                  id: "elyra_sql",
                },
                {
                  id: "elyra_conf",
                },
                {
                  id: "elyra_conn_id",
                },
                {
                  id: "elyra_total_executor_cores",
                },
                {
                  id: "elyra_executor_cores",
                },
                {
                  id: "elyra_executor_memory",
                },
                {
                  id: "elyra_keytab",
                },
                {
                  id: "elyra_principal",
                },
                {
                  id: "elyra_master",
                },
                {
                  id: "elyra_name",
                },
                {
                  id: "elyra_num_executors",
                },
                {
                  id: "elyra_verbose",
                },
                {
                  id: "elyra_yarn_queue",
                },
                {
                  id: "component_source",
                },
              ],
              uihints: {
                id: "nodeProperties",
                parameter_info: [
                  {
                    parameter_ref: "label",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Label",
                    },
                    description: {
                      default: "A custom label for the node.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                  {
                    parameter_ref: "elyra_sql",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "sql",
                    },
                    description: {
                      default:
                        "The SQL query to execute. (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: true,
                    },
                  },
                  {
                    parameter_ref: "elyra_conf",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "conf",
                    },
                    description: {
                      default:
                        "arbitrary Spark configuration property (type: str (format: PROP=VALUE))",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_conn_id",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "conn_id",
                    },
                    description: {
                      default: "connection_id string (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_total_executor_cores",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "total_executor_cores",
                    },
                    description: {
                      default:
                        "(Standalone & Mesos only) Total cores for all        executors (Default: all the available cores on the worker) (type: int)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        NumberControl: {
                          label: "Please enter a number value :",
                          format: "number",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_executor_cores",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "executor_cores",
                    },
                    description: {
                      default:
                        "(Standalone & YARN only) Number of cores per        executor (Default: 2) (type: int)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        NumberControl: {
                          label: "Please enter a number value :",
                          format: "number",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_executor_memory",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "executor_memory",
                    },
                    description: {
                      default:
                        "Memory per executor (e.g. 1000M, 2G) (Default: 1G) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_keytab",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "keytab",
                    },
                    description: {
                      default:
                        "Full path to the file that contains the keytab (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_principal",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "principal",
                    },
                    description: {
                      default: "(type: string)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_master",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "master",
                    },
                    description: {
                      default:
                        "spark://host:port, mesos://host:port, yarn, or local (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_name",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "name",
                    },
                    description: {
                      default: "Name of the job (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_num_executors",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "num_executors",
                    },
                    description: {
                      default: "Number of executors to launch (type: int)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        NumberControl: {
                          label: "Please enter a number value :",
                          format: "number",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_verbose",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "verbose",
                    },
                    description: {
                      default:
                        "Whether to pass the verbose flag to spark-sql (type: bool)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        BooleanControl: {
                          label: "Please select or deselect the checkbox :",
                          format: "boolean",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_yarn_queue",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "yarn_queue",
                    },
                    description: {
                      default:
                        "The YARN queue to submit to (Default: 'default') (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "component_source",
                    control: "readonly",
                    label: {
                      default: "Component Source",
                    },
                    description: {
                      default:
                        "Unique information used to identify this component.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                ],
                group_info: [
                  {
                    id: "nodeGroupInfo",
                    type: "panels",
                    group_info: [
                      {
                        id: "label",
                        type: "controls",
                        parameter_refs: ["label"],
                      },
                      {
                        id: "elyra_sql",
                        type: "controls",
                        parameter_refs: ["elyra_sql"],
                      },
                      {
                        id: "elyra_conf",
                        type: "controls",
                        parameter_refs: ["elyra_conf"],
                      },
                      {
                        id: "elyra_conn_id",
                        type: "controls",
                        parameter_refs: ["elyra_conn_id"],
                      },
                      {
                        id: "elyra_total_executor_cores",
                        type: "controls",
                        parameter_refs: ["elyra_total_executor_cores"],
                      },
                      {
                        id: "elyra_executor_cores",
                        type: "controls",
                        parameter_refs: ["elyra_executor_cores"],
                      },
                      {
                        id: "elyra_executor_memory",
                        type: "controls",
                        parameter_refs: ["elyra_executor_memory"],
                      },
                      {
                        id: "elyra_keytab",
                        type: "controls",
                        parameter_refs: ["elyra_keytab"],
                      },
                      {
                        id: "elyra_principal",
                        type: "controls",
                        parameter_refs: ["elyra_principal"],
                      },
                      {
                        id: "elyra_master",
                        type: "controls",
                        parameter_refs: ["elyra_master"],
                      },
                      {
                        id: "elyra_name",
                        type: "controls",
                        parameter_refs: ["elyra_name"],
                      },
                      {
                        id: "elyra_num_executors",
                        type: "controls",
                        parameter_refs: ["elyra_num_executors"],
                      },
                      {
                        id: "elyra_verbose",
                        type: "controls",
                        parameter_refs: ["elyra_verbose"],
                      },
                      {
                        id: "elyra_yarn_queue",
                        type: "controls",
                        parameter_refs: ["elyra_yarn_queue"],
                      },
                      {
                        id: "component_source",
                        type: "controls",
                        parameter_refs: ["component_source"],
                      },
                    ],
                  },
                ],
              },
              resources: {},
            },
          },
        },
        {
          op: "elyra-airflow-examples-catalog:b29c25ec8bd6",
          description: "",
          id: "elyra-airflow-examples-catalog:b29c25ec8bd6",
          image: "/static/elyra/airflow.svg",
          label: "SparkSubmitOperator",
          runtime_type: "APACHE_AIRFLOW",
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
            image: "/static/elyra/airflow.svg",
            ui_data: {
              description: "",
              label: "SparkSubmitOperator",
              image: "/static/elyra/airflow.svg",
              x_pos: 0,
              y_pos: 0,
            },
            properties: {
              current_parameters: {
                label: "",
                elyra_application: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_conf: {
                  activeControl: "StringControl",
                  StringControl: "{}",
                },
                elyra_conn_id: {
                  activeControl: "StringControl",
                  StringControl: "spark_default",
                },
                elyra_files: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_py_files: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_archives: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_driver_class_path: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_jars: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_java_class: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_packages: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_exclude_packages: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_repositories: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_total_executor_cores: {
                  activeControl: "NumberControl",
                  NumberControl: 0,
                },
                elyra_executor_cores: {
                  activeControl: "NumberControl",
                  NumberControl: 0,
                },
                elyra_executor_memory: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_driver_memory: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_keytab: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_principal: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_proxy_user: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_name: {
                  activeControl: "StringControl",
                  StringControl: "airflow-spark",
                },
                elyra_num_executors: {
                  activeControl: "NumberControl",
                  NumberControl: 0,
                },
                elyra_status_poll_interval: {
                  activeControl: "NumberControl",
                  NumberControl: 1,
                },
                elyra_application_args: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                elyra_env_vars: {
                  activeControl: "StringControl",
                  StringControl: "{}",
                },
                elyra_verbose: {
                  activeControl: "BooleanControl",
                  BooleanControl: false,
                },
                elyra_spark_binary: {
                  activeControl: "StringControl",
                  StringControl: "",
                },
                component_source:
                  "{'catalog_type': 'elyra-airflow-examples-catalog', 'component_ref': {'component-id': 'spark_submit_operator.py'}}",
              },
              parameters: [
                {
                  id: "label",
                },
                {
                  id: "elyra_application",
                },
                {
                  id: "elyra_conf",
                },
                {
                  id: "elyra_conn_id",
                },
                {
                  id: "elyra_files",
                },
                {
                  id: "elyra_py_files",
                },
                {
                  id: "elyra_archives",
                },
                {
                  id: "elyra_driver_class_path",
                },
                {
                  id: "elyra_jars",
                },
                {
                  id: "elyra_java_class",
                },
                {
                  id: "elyra_packages",
                },
                {
                  id: "elyra_exclude_packages",
                },
                {
                  id: "elyra_repositories",
                },
                {
                  id: "elyra_total_executor_cores",
                },
                {
                  id: "elyra_executor_cores",
                },
                {
                  id: "elyra_executor_memory",
                },
                {
                  id: "elyra_driver_memory",
                },
                {
                  id: "elyra_keytab",
                },
                {
                  id: "elyra_principal",
                },
                {
                  id: "elyra_proxy_user",
                },
                {
                  id: "elyra_name",
                },
                {
                  id: "elyra_num_executors",
                },
                {
                  id: "elyra_status_poll_interval",
                },
                {
                  id: "elyra_application_args",
                },
                {
                  id: "elyra_env_vars",
                },
                {
                  id: "elyra_verbose",
                },
                {
                  id: "elyra_spark_binary",
                },
                {
                  id: "component_source",
                },
              ],
              uihints: {
                id: "nodeProperties",
                parameter_info: [
                  {
                    parameter_ref: "label",
                    control: "custom",
                    custom_control_id: "StringControl",
                    label: {
                      default: "Label",
                    },
                    description: {
                      default: "A custom label for the node.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                  {
                    parameter_ref: "elyra_application",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "application",
                    },
                    description: {
                      default:
                        "The application that submitted as a job, either jar or py file. (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_conf",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "conf",
                    },
                    description: {
                      default:
                        "Arbitrary Spark configuration properties (templated) (type: dict)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "dictionary",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_conn_id",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "conn_id",
                    },
                    description: {
                      default:
                        "The connection id as configured in Airflow administration. When an                    invalid connection_id is supplied, it will default to yarn. (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_files",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "files",
                    },
                    description: {
                      default:
                        "Upload additional files to the executor running the job, separated by a                  comma. Files will be placed in the working directory of each executor.                  For example, serialized objects. (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_py_files",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "py_files",
                    },
                    description: {
                      default:
                        "Additional python files used by the job, can be .zip, .egg or .py. (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_archives",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "archives",
                    },
                    description: {
                      default: "(type: string)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_driver_class_path",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "driver_class_path",
                    },
                    description: {
                      default:
                        "Additional, driver-specific, classpath settings. (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_jars",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "jars",
                    },
                    description: {
                      default:
                        "Submit additional jars to upload and place them in executor classpath. (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_java_class",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "java_class",
                    },
                    description: {
                      default:
                        "the main class of the Java application (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_packages",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "packages",
                    },
                    description: {
                      default:
                        "Comma-separated list of maven coordinates of jars to include on the                     driver and executor classpaths. (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_exclude_packages",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "exclude_packages",
                    },
                    description: {
                      default:
                        "Comma-separated list of maven coordinates of jars to exclude                             while resolving the dependencies provided in 'packages' (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_repositories",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "repositories",
                    },
                    description: {
                      default:
                        "Comma-separated list of additional remote repositories to search                         for the maven coordinates given with 'packages' (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_total_executor_cores",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "total_executor_cores",
                    },
                    description: {
                      default:
                        "(Standalone & Mesos only) Total cores for all executors                                 (Default: all the available cores on the worker) (type: int)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        NumberControl: {
                          label: "Please enter a number value :",
                          format: "number",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_executor_cores",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "executor_cores",
                    },
                    description: {
                      default:
                        "(Standalone & YARN only) Number of cores per executor (Default: 2) (type: int)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        NumberControl: {
                          label: "Please enter a number value :",
                          format: "number",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_executor_memory",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "executor_memory",
                    },
                    description: {
                      default:
                        "Memory per executor (e.g. 1000M, 2G) (Default: 1G) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_driver_memory",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "driver_memory",
                    },
                    description: {
                      default:
                        "Memory allocated to the driver (e.g. 1000M, 2G) (Default: 1G) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_keytab",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "keytab",
                    },
                    description: {
                      default:
                        "Full path to the file that contains the keytab (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_principal",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "principal",
                    },
                    description: {
                      default:
                        "The name of the kerberos principal used for keytab (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_proxy_user",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "proxy_user",
                    },
                    description: {
                      default:
                        "User to impersonate when submitting the application (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_name",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "name",
                    },
                    description: {
                      default:
                        "Name of the job (default airflow-spark). (templated) (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_num_executors",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "num_executors",
                    },
                    description: {
                      default: "Number of executors to launch (type: int)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        NumberControl: {
                          label: "Please enter a number value :",
                          format: "number",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_status_poll_interval",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "status_poll_interval",
                    },
                    description: {
                      default:
                        "Seconds to wait between polls of driver status in cluster        mode (Default: 1) (type: int)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        NumberControl: {
                          label: "Please enter a number value :",
                          format: "number",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_application_args",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "application_args",
                    },
                    description: {
                      default:
                        "Arguments for the application being submitted (templated) (type: list)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "list",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_env_vars",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "env_vars",
                    },
                    description: {
                      default:
                        "Environment variables for spark-submit. It supports yarn and k8s mode too. (templated) (type: dict)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "dictionary",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_verbose",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "verbose",
                    },
                    description: {
                      default:
                        "Whether to pass the verbose flag to spark-submit process for debugging (type: bool)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        BooleanControl: {
                          label: "Please select or deselect the checkbox :",
                          format: "boolean",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "elyra_spark_binary",
                    control: "custom",
                    custom_control_id: "OneOfControl",
                    label: {
                      default: "spark_binary",
                    },
                    description: {
                      default:
                        "The command to use for spark submit.                         Some distros may use spark2-submit. (type: str)",
                      placement: "on_panel",
                    },
                    data: {
                      controls: {
                        StringControl: {
                          label: "Please enter a string value :",
                          format: "string",
                        },
                        NestedEnumControl: {
                          label: "Please select an output from a parent :",
                          format: "inputpath",
                          allownooptions: false,
                        },
                      },
                      required: false,
                    },
                  },
                  {
                    parameter_ref: "component_source",
                    control: "readonly",
                    label: {
                      default: "Component Source",
                    },
                    description: {
                      default:
                        "Unique information used to identify this component.",
                      placement: "on_panel",
                    },
                    data: {},
                  },
                ],
                group_info: [
                  {
                    id: "nodeGroupInfo",
                    type: "panels",
                    group_info: [
                      {
                        id: "label",
                        type: "controls",
                        parameter_refs: ["label"],
                      },
                      {
                        id: "elyra_application",
                        type: "controls",
                        parameter_refs: ["elyra_application"],
                      },
                      {
                        id: "elyra_conf",
                        type: "controls",
                        parameter_refs: ["elyra_conf"],
                      },
                      {
                        id: "elyra_conn_id",
                        type: "controls",
                        parameter_refs: ["elyra_conn_id"],
                      },
                      {
                        id: "elyra_files",
                        type: "controls",
                        parameter_refs: ["elyra_files"],
                      },
                      {
                        id: "elyra_py_files",
                        type: "controls",
                        parameter_refs: ["elyra_py_files"],
                      },
                      {
                        id: "elyra_archives",
                        type: "controls",
                        parameter_refs: ["elyra_archives"],
                      },
                      {
                        id: "elyra_driver_class_path",
                        type: "controls",
                        parameter_refs: ["elyra_driver_class_path"],
                      },
                      {
                        id: "elyra_jars",
                        type: "controls",
                        parameter_refs: ["elyra_jars"],
                      },
                      {
                        id: "elyra_java_class",
                        type: "controls",
                        parameter_refs: ["elyra_java_class"],
                      },
                      {
                        id: "elyra_packages",
                        type: "controls",
                        parameter_refs: ["elyra_packages"],
                      },
                      {
                        id: "elyra_exclude_packages",
                        type: "controls",
                        parameter_refs: ["elyra_exclude_packages"],
                      },
                      {
                        id: "elyra_repositories",
                        type: "controls",
                        parameter_refs: ["elyra_repositories"],
                      },
                      {
                        id: "elyra_total_executor_cores",
                        type: "controls",
                        parameter_refs: ["elyra_total_executor_cores"],
                      },
                      {
                        id: "elyra_executor_cores",
                        type: "controls",
                        parameter_refs: ["elyra_executor_cores"],
                      },
                      {
                        id: "elyra_executor_memory",
                        type: "controls",
                        parameter_refs: ["elyra_executor_memory"],
                      },
                      {
                        id: "elyra_driver_memory",
                        type: "controls",
                        parameter_refs: ["elyra_driver_memory"],
                      },
                      {
                        id: "elyra_keytab",
                        type: "controls",
                        parameter_refs: ["elyra_keytab"],
                      },
                      {
                        id: "elyra_principal",
                        type: "controls",
                        parameter_refs: ["elyra_principal"],
                      },
                      {
                        id: "elyra_proxy_user",
                        type: "controls",
                        parameter_refs: ["elyra_proxy_user"],
                      },
                      {
                        id: "elyra_name",
                        type: "controls",
                        parameter_refs: ["elyra_name"],
                      },
                      {
                        id: "elyra_num_executors",
                        type: "controls",
                        parameter_refs: ["elyra_num_executors"],
                      },
                      {
                        id: "elyra_status_poll_interval",
                        type: "controls",
                        parameter_refs: ["elyra_status_poll_interval"],
                      },
                      {
                        id: "elyra_application_args",
                        type: "controls",
                        parameter_refs: ["elyra_application_args"],
                      },
                      {
                        id: "elyra_env_vars",
                        type: "controls",
                        parameter_refs: ["elyra_env_vars"],
                      },
                      {
                        id: "elyra_verbose",
                        type: "controls",
                        parameter_refs: ["elyra_verbose"],
                      },
                      {
                        id: "elyra_spark_binary",
                        type: "controls",
                        parameter_refs: ["elyra_spark_binary"],
                      },
                      {
                        id: "component_source",
                        type: "controls",
                        parameter_refs: ["component_source"],
                      },
                    ],
                  },
                ],
              },
              resources: {},
            },
          },
        },
      ],
      image: "/static/elyra/airflow.svg",
    },
  ],
};
