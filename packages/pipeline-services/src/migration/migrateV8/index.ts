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

const widgetMap: { [key: string]: string } = {
  BooleanControl: "boolean",
  NumberControl: "number",
  NestedEnumControl: "inputpath",
  StringControl: "string",
};

const regexMap: { [key: string]: RegExp } = {
  env_vars: /(?<env_var>\w+)=?(?<value>[^,]*?)(?= \w+=|$)/,
  mounted_volumes: /(?<path>[\w/]+)=?(?<pvc_name>[^,]*?)(?= \w+=|$)/,
  kubernetes_pod_annotations: /(?<key>\w+)=?(?<value>[^,]*?)(?= \w+=|$)/,
  kubernetes_secrets: /(?<env_var>\w+)=?(?<name>[^:,\n\]]*):?(?<key>[^,]*?)(?= \w+=|$)/,
  kubernetes_tolerations: /\w+=(?<key>.*?):(?<operator>[^,]*?):(?<value>[^,]*?):(?<effect>[^,]*?)(?= \w+=|$)/,
};

function migrate(pipelineFlow: any) {
  console.log(pipelineFlow);
  for (const pipeline of pipelineFlow.pipelines) {
    Object.keys(pipeline.app_data?.properties?.pipeline_defaults ?? {}).forEach(
      (key) => {
        // Update KeyValue arrays to dict arrays
        if (Object.keys(regexMap).includes(key)) {
          const new_items: any[] = [];
          for (const item of pipeline.app_data.properties.pipeline_defaults[
            key
          ]) {
            const dict = item.match(regexMap[key]).groups;
            new_items.push(dict);
          }
          pipeline.app_data.properties.pipeline_defaults[key] = new_items;
        }
      }
    );

    for (const node of pipeline.nodes) {
      Object.keys(node.app_data?.component_parameters ?? {}).forEach((key) => {
        // Update oneOf format
        const activeControl =
          node.app_data.component_parameters[key]?.activeControl;
        if (activeControl) {
          node.app_data.component_parameters[key] = {
            widget: widgetMap[activeControl],
            value: node.app_data.component_parameters[key][activeControl],
          };
        }
        // Update inputpath format
        const propKeys = Object.keys(
          node.app_data.component_parameters[key] ?? {}
        );
        if (
          propKeys.length === 2 &&
          propKeys.includes("option") &&
          propKeys.includes("value")
        ) {
          node.app_data.component_parameters[key] = {
            widget: "inputpath",
            value: node.app_data.component_parameters[key],
          };
        }
        // Update KeyValue arrays to dict arrays
        if (Object.keys(regexMap).includes(key)) {
          const new_items: any[] = [];
          for (const item of node.app_data.component_parameters[key]) {
            const dict = item.match(regexMap[key]).groups;
            new_items.push(dict);
          }
          node.app_data.component_parameters[key] = new_items;
        }
      });
    }
  }

  pipelineFlow.pipelines[0].app_data.version = 8;

  return pipelineFlow;
}

export default migrate;
