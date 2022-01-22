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

import path from "path";

// NOTE: technically a pipeline can have a missing app_data field however, if
// this is really an Elyra v1 pipeline, it should be guaranteed to have app_data
// otherwise we wouldn't know this is a v1 pipeline.
function migrate(
  pipeline: any,
  setNodePathsRelativeToPipelineV2?: (pipeline: any) => any
) {
  if (setNodePathsRelativeToPipelineV2) {
    pipeline.pipelines[0] = setNodePathsRelativeToPipelineV2(
      pipeline.pipelines[0]
    );
  } else {
    for (const node of pipeline.pipelines[0].nodes) {
      if (node.app_data) {
        // If setNodePathsRelativeToPipeline is not given then just set
        // filename to the basename and the user will have to update the correct
        // path in node properties
        node.app_data.filename = path.basename(node.app_data.filename);
      }
    }
  }

  pipeline.pipelines[0].app_data.version = 2;

  return pipeline;
}

export default migrate;
