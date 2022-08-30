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

function migrate(pipelineFlow: any) {
  console.log(pipelineFlow);
  for (const pipeline of pipelineFlow.pipelines) {
    for (const node of pipeline.nodes) {
      Object.keys(node.app_data.component_parameters ?? {}).forEach((key) => {
        const activeControl =
          node.app_data.component_parameters[key]?.activeControl;
        if (activeControl) {
          node.app_data.component_parameters[key] = {
            widget: widgetMap[activeControl],
            value: node.app_data.component_parameters[key][activeControl],
          };
        }
      });
    }
  }

  pipelineFlow.pipelines[0].app_data.version = 7.5; // TODO: Update to 8 prior to 1.10 release

  return pipelineFlow;
}

export default migrate;
