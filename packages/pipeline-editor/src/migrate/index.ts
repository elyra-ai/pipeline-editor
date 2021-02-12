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

import produce from "immer";

import {
  convertPipelineV0toV1,
  convertPipelineV1toV2,
  convertPipelineV2toV3,
} from "./migration";

function migrate(pipelineJSON: any) {
  return produce(pipelineJSON, (draft: any) => {
    const version = draft.pipelines[0].app_data?.version ?? 0;
    if (version < 1) {
      // original pipeline definition without a version
      console.info("Migrating pipeline to version 1.");
      convertPipelineV0toV1(draft);
    }
    if (version < 2) {
      // adding relative path on the pipeline filenames
      console.info("Migrating pipeline to version 2.");
      convertPipelineV1toV2(draft);
    }
    if (version < 3) {
      // Adding python script support
      console.info("Migrating pipeline to version 3 (current version).");
      convertPipelineV2toV3(draft);
    }
  });
}

export default migrate;
