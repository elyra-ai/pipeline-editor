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

import path from "path";

// TODO: this map will need to be updated once https://github.com/elyra-ai/elyra/pull/2272 is merged
const opMap: { [key: string]: string } = {
  run_notebook_using_papermill_Runnotebookusingpapermill:
    "local-directory-catalog:61e6f4141f65",
  filter_text_using_shell_and_grep_Filtertext:
    "local-directory-catalog:737915b826e9",
  component_Downloaddata: "url-catalog:c6c0588048ae",
  component_Calculatedatahash: "url-catalog:4fc759382b1b",
  bash_operator_BashOperator: "url-catalog:49f8e61b78c3",
  email_operator_EmailOperator: "url-catalog:8bef428ea3cd",
  http_operator_SimpleHttpOperator: "url-catalog:e97030fb448a",
  spark_sql_operator_SparkSqlOperator: "url-catalog:ff0d51b70719",
  spark_submit_operator_SparkSubmitOperator: "url-catalog:2756314f3ff5",
  slack_operator_SlackAPIPostOperator: "local-file-catalog:81b4f925702e",
};

const runtimeTypeMap: { [key: string]: string } = {
  kfp: "KUBEFLOW_PIPELINES",
  airflow: "APACHE_AIRFLOW",
  Generic: "Generic",
};

function migrate(pipelineFlow: any, palette: any) {
  let paletteNodes = [];
  for (const c of palette.categories) {
    if (c.node_types) {
      paletteNodes.push(...c.node_types);
    }
  }

  // TODO: unwrap this once https://github.com/elyra-ai/elyra/pull/2263 is merged
  if (false) {
    pipelineFlow.app_data.runtime_type =
      runtimeTypeMap[pipelineFlow.app_data.properties.runtime];
    delete pipelineFlow.app_data.properties.runtime;
  }
  for (const pipeline of pipelineFlow.pipelines) {
    for (const node of pipeline.nodes) {
      const newOp = opMap[node.op];
      if (newOp) {
        node.op = newOp;

        let catalog_type = "";
        const component_ref: { [key: string]: any } = {};
        if (node.app_data.component_source.startsWith("http")) {
          catalog_type = "url-catalog";
          component_ref["url"] = node.app_data.component_source;
        } else if (
          node.app_data.component_source.includes("/components/kfp/")
        ) {
          catalog_type = "local-directory-catalog";
          component_ref["base_dir"] = path.dirname(
            node.app_data.component_source
          );
          component_ref["path"] = path.basename(node.app_data.component_source);
        } else if (
          node.app_data.component_source.includes("/components/airflow/")
        ) {
          catalog_type = "local-file-catalog";
          const parts = node.app_data.component_source.split(
            "/components/airflow/"
          );
          component_ref["base_dir"] = parts[0] + "/components";
          component_ref["path"] = "airflow/" + parts[1];
        }
        node.app_data.component_source = { catalog_type, component_ref };
      }

      const nodePropertiesSchema = paletteNodes.find(
        (n: any) => n.op === node.op
      );
      const propertyDefs =
        nodePropertiesSchema?.app_data.properties.uihints.parameter_info;

      Object.keys(node.app_data.component_parameters).forEach((key) => {
        const propDef = propertyDefs.find(
          (p: any) => p.parameter_ref === "elyra_" + key
        );
        if (propDef.custom_control_id === "OneOfControl") {
          const activeControl: string =
            Object.keys(propDef.data.controls).find(
              (c: string) => c !== "NestedEnumControl"
            ) || "";
          node.app_data.component_parameters[key] = {
            activeControl,
            [activeControl]: node.app_data.component_parameters[key],
          };
        }
      });
    }
  }

  pipelineFlow.pipelines[0].app_data.version = 6;

  return pipelineFlow;
}

export default migrate;
