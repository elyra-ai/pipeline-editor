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

const opMap: { [key: string]: string } = {
  "run-notebook-using-papermill":
    "run_notebook_using_papermill_Runnotebookusingpapermill",
  "filter-text": "filter_text_using_shell_and_grep_Filtertext",
  "bash-operator_BashOperator": "bash_operator_BashOperator",
  "email-operator_EmailOperator": "email_operator_EmailOperator",
  "http-operator_SimpleHttpOperator": "http_operator_SimpleHttpOperator",
  "spark-sql-operator_SparkSqlOperator": "spark_sql_operator_SparkSqlOperator",
  "spark-submit-operator_SparkSubmitOperator":
    "spark_submit_operator_SparkSubmitOperator",
  "slack-operator_SlackAPIPostOperator": "slack_operator_SlackAPIPostOperator",
};

function migrate(pipelineFlow: any) {
  for (const pipeline of pipelineFlow.pipelines) {
    for (const node of pipeline.nodes) {
      const newOp = opMap[node.op];
      if (newOp) {
        node.op = newOp;
      }
    }
  }

  pipelineFlow.pipelines[0].app_data.version = 5;

  return pipelineFlow;
}

export default migrate;
