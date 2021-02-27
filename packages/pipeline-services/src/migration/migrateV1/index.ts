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

function migrate(pipeline: any) {
  if (pipeline.pipelines[0].app_data) {
    // title -> name
    pipeline.pipelines[0].app_data.name = pipeline.pipelines[0].app_data.title;
    delete pipeline.pipelines[0].app_data.title;

    delete pipeline.pipelines[0].app_data.export;
    delete pipeline.pipelines[0].app_data.export_format;
    delete pipeline.pipelines[0].app_data.export_path;

    pipeline.pipelines[0].app_data.version = 1;
  } else {
    pipeline.pipelines[0].app_data = { version: 1 };
  }

  for (const node of pipeline.pipelines[0].nodes) {
    if (node.app_data === undefined) {
      continue;
    }
    // artifact -> filename
    node.app_data.filename = node.app_data.artifact;
    delete node.app_data.artifact;

    // image -> runtime_image
    node.app_data.runtime_image = node.app_data.image;
    delete node.app_data.image;

    // vars -> env_vars
    node.app_data.env_vars = node.app_data.vars;
    delete node.app_data.vars;

    // file_dependencies -> dependencies
    node.app_data.dependencies = node.app_data.file_dependencies;
    delete node.app_data.file_dependencies;

    // recursive_dependencies -> include_subdirectories
    node.app_data.include_subdirectories = node.app_data.recursive_dependencies;
    delete node.app_data.recursive_dependencies;
  }

  return pipeline;
}

export default migrate;
