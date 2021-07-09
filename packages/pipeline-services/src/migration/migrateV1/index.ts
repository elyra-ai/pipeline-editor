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

const hasAppdataField = (node: any, fieldName: string): boolean => {
  return (
    Object.prototype.hasOwnProperty.call(node, "app_data") &&
    Object.prototype.hasOwnProperty.call(node["app_data"], fieldName)
  );
};

const deleteAppdataField = (node: any, fieldName: string): void => {
  if (hasAppdataField(node, fieldName)) {
    delete node.app_data[fieldName];
  }
};

const renameAppdataField = (
  node: any,
  currentFieldName: string,
  newFieldName: string
): void => {
  if (hasAppdataField(node, currentFieldName)) {
    node.app_data[newFieldName] = node.app_data[currentFieldName];
    deleteAppdataField(node, currentFieldName);
  }
};

function migrate(pipeline: any) {
  renameAppdataField(pipeline.pipelines[0], "title", "name");
  deleteAppdataField(pipeline.pipelines[0], "export");
  deleteAppdataField(pipeline.pipelines[0], "export_format");
  deleteAppdataField(pipeline.pipelines[0], "export_path");

  for (const node of pipeline.pipelines[0].nodes) {
    if (node.type === "pipeline_node") {
      node.type = "execution_node";
    }
    node.op = "execute-notebook-node";
    renameAppdataField(node, "notebook", "filename");
    renameAppdataField(node, "artifact", "filename");
    renameAppdataField(node, "docker_image", "runtime_image");
    renameAppdataField(node, "image", "runtime_image");
    renameAppdataField(node, "vars", "env_vars");
    renameAppdataField(node, "file_dependencies", "dependencies");
    renameAppdataField(
      node,
      "recursive_dependencies",
      "include_subdirectories"
    );
  }

  if (pipeline.pipelines[0].app_data) {
    pipeline.pipelines[0].app_data.version = 1;
  } else {
    pipeline.pipelines[0].app_data = { version: 1 };
  }

  return pipeline;
}

export default migrate;
