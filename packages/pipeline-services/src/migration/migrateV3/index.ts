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

// NOTE: technically a pipeline can have a missing app_data field however, if
// this is really an Elyra v2 pipeline, it should be guaranteed to have app_data
// otherwise we wouldn't know this is a v2 pipeline.
function migrate(pipeline: any) {
  // No-Op this is to disable old versions of Elyra
  // to see a pipeline with Python Script nodes
  pipeline.pipelines[0].app_data.version = 3;

  return pipeline;
}

export default migrate;
