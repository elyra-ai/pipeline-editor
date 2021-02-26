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

import { nanoid } from "nanoid";

function migrate(pipeline: any) {
  for (const p in pipeline.pipelines) {
    for (const n in pipeline.pipelines[p].nodes) {
      const { ui_data, ...rest } = pipeline.pipelines[p].nodes[n].app_data;

      for (const [key, value] of Object.entries(rest)) {
        if (Array.isArray(value)) {
          rest[key] = value.map((v) => ({ value: v, id: nanoid() }));
        }
      }

      pipeline.pipelines[p].nodes[n].app_data = {
        ui_data,
        ...rest,
      };
    }
  }

  if (pipeline.pipelines[0].app_data) {
    pipeline.pipelines[0].app_data.version = 4;
  }

  return pipeline;
}

export default migrate;
