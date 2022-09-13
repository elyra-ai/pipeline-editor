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

import { ComponentNotFoundError } from "../errors";
import { opMap } from "../migrateV6";

function migrate(pipelineFlow: any, palette: any) {
  let paletteNodes: any[] = [];
  for (const c of palette?.categories || []) {
    if (c.node_types) {
      paletteNodes.push(...c.node_types);
    }
  }
  const validOps = Object.values(opMap);
  if (
    pipelineFlow.pipelines[0].app_data.runtime_type === "KUBEFLOW_PIPELINES"
  ) {
    for (const pipeline of pipelineFlow.pipelines) {
      for (const node of pipeline.nodes) {
        // Only run on valid node ops as migrated in v6
        if (validOps.includes(node.op)) {
          // update format of inputvalue properties to using OneOfControl format
          const nodePropertiesSchema = paletteNodes.find(
            (n: any) => n.op === node.op
          );
          if (nodePropertiesSchema === undefined) {
            throw new ComponentNotFoundError();
          }
          const propertyDefs =
            nodePropertiesSchema.app_data.properties.uihints.parameter_info;
          Object.keys(node.app_data.component_parameters ?? {}).forEach(
            (key) => {
              const propDef = propertyDefs.find(
                (p: any) => p.parameter_ref === "elyra_" + key
              );
              if (propDef?.custom_control_id === "OneOfControl") {
                const activeControl: string =
                  Object.keys(propDef.data.controls).find(
                    (c: string) => c !== "NestedEnumControl"
                  ) || "";
                node.app_data.component_parameters[key] = {
                  activeControl,
                  [activeControl]: node.app_data.component_parameters[key],
                };
              }
            }
          );
        }
      }
    }
  }

  pipelineFlow.pipelines[0].app_data.version = 7;

  return pipelineFlow;
}

export default migrate;
