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

export const nodeSpec = {
  op: "execute-notebook-node",
  app_data: {
    properties: {
      type: "object",
      properties: {
        label: {
          title: "Label",
          description: "A custom label for the node.",
          type: "string",
        },
        component_parameters: {
          type: "object",
          properties: {
            filename: {
              type: "string",
              title: "Filename",
              description: "The path to the Notebook.",
              uihints: { "ui:widget": "file", extensions: [".ipynb"] },
            },
            runtime_image: {
              type: "string",
              title: "Runtime Image",
              required: true,
              description: "Container image used as execution environment.",
              uihints: { items: [] },
              enumNames: ["Anaconda (2021.11) with Python 3.x", "Pandas 1.4.1"],
              enum: [
                "continuumio/anaconda3:2021.11",
                "amancevice/pandas:1.4.1",
              ],
            },
            cpu: {
              type: "integer",
              title: "CPU",
              description:
                "For CPU-intensive workloads, you can choose more than 1 CPU (e.g. 1.5).",
              minimum: 0,
            },
            gpu: {
              type: "integer",
              title: "GPU",
              description:
                "For GPU-intensive workloads, you can choose more than 1 GPU. Must be an integer.",
              minimum: 0,
            },
            memory: {
              type: "integer",
              title: "RAM(GB)",
              description: "The total amount of RAM specified.",
              minimum: 0,
            },
            dependencies: {
              type: "array",
              items: { type: "string" },
              title: "File Dependencies",
              description:
                "Local file dependencies that need to be copied to remote execution environment.",
              uihints: {
                items: { "ui:placeholder": "*.py", "ui:widget": "file" },
              },
            },
            include_subdirectories: {
              type: "boolean",
              title: "Include Subdirectories",
              description:
                "Recursively include subdirectories when submitting a pipeline (This may increase submission time).",
            },
            env_vars: {
              type: "array",
              items: { type: "string" },
              title: "Environment Variables",
              description:
                "Environment variables to be set on the execution environment.",
              uihints: {
                pipeline_defaults: ["key=value"],
                "ui:placeholder": "env_var=VALUE",
                canRefresh: true,
                keyValueEntries: true,
              },
            },
            kubernetes_secrets: {
              type: "array",
              items: { type: "string" },
              title: "Kubernetes Secrets",
              description:
                "Kubernetes secrets to make available as environment variables to this node. The secret name and key given must be present in the Kubernetes namespace where the node is executed or this node will not run.",
              uihints: {
                items: { "ui:placeholder": "env_var=secret-name:secret-key" },
                keyValueEntries: true,
              },
            },
            kubernetes_pod_annotations: {
              type: "array",
              items: { type: "string" },
              title: "Kubernetes Pod Annotations",
              description:
                "Metadata to be added to this node. The metadata is exposed as annotation in the Kubernetes pod that executes this node.",
              uihints: {
                items: { "ui:placeholder": "annotation_key=annotation_value" },
                keyValueEntries: true,
              },
            },
            outputs: {
              type: "array",
              items: { type: "string" },
              title: "Output Files",
              description:
                "Files generated during execution that will become available to all subsequent pipeline steps.",
              uihints: { items: { "ui:placeholder": "*.csv" } },
            },
            mounted_volumes: {
              type: "array",
              items: { type: "string" },
              title: "Data Volumes",
              description:
                "Volumes to be mounted in this node. The specified Persistent Volume Claims must exist in the Kubernetes namespace where the node is executed or this node will not run.",
              uihints: {
                items: { "ui:placeholder": "/mount/path=pvc-name" },
                keyValueEntries: true,
              },
            },
            kubernetes_tolerations: {
              type: "array",
              items: { type: "string" },
              title: "Kubernetes Tolerations",
              description:
                "Kubernetes tolerations to apply to the pod where the node is executed.",
              uihints: {
                items: { "ui:placeholder": "TOL_ID=key:operator:value:effect" },
                keyValueEntries: true,
              },
            },
          },
          required: ["filename"],
        },
      },
      required: ["component_parameters"],
    },
  },
};
