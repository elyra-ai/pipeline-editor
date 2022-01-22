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

export const nodeSpec = {
  op: "execute-notebook-node",
  app_data: {
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
              default: "The node label.",
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
              items: [
                "continuumio/anaconda3:2020.07",
                "amancevice/pandas:1.0.3",
              ],
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
            data: { placeholder: "*.py", format: "file" },
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
  },
};
