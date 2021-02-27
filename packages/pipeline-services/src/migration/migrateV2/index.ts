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

// NOTE: technically a pipeline can have a missing app_data field however, if
// this is really an Elyra v1 pipeline, it should be guaranteed to have app_data
// otherwise we wouldn't know this is a v1 pipeline.
function migrate(pipeline: any) {
  for (const node of pipeline.pipelines[0].nodes) {
    if (node.app_data === undefined) {
      continue;
    }

    // Going from absolute to relative path with this logic, won't work in many
    // cases:
    //  - `path.relative(path.dirname(currentPipelinePath), absolutePath);`
    //
    // Additionally, our migration functions shouldn't rely on external
    // information (like the current pipeline path). Instead we should replace
    // absolute paths with a logical guess that is deterministic.
    //
    // Option 1: replace path with just the filename.
    //  - user will need to update files that aren't next to pipeline.
    //  - there could be situations where files all have the same name, but
    //    have different folders: `one/index.py` `two/index.py` would both
    //    become `index.py`. This could make it difficult for the user to find
    //    the right file for the node.
    //
    // Option 2: guess the base path by finding a common ancestor.
    //  - this will be wrong if there aren't any files next to the pipeline.
    //  - this will also be wrong if a file falls outside the base path.
    //
    // Going with `option 1`, because it is much simpler.

    node.app_data.filename = path.basename(node.app_data.filename);
  }

  pipeline.pipelines[0].app_data.version = 2;

  return pipeline;
}

export default migrate;
