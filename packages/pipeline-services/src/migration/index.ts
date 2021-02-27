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

import migrateV1 from "./migrateV1";
import migrateV2 from "./migrateV2";
import migrateV3 from "./migrateV3";

export function migrate(pipelineJSON: any) {
  return produce(pipelineJSON, (draft: any) => {
    const version = draft.pipelines[0].app_data?.version ?? 0;
    if (version < 1) {
      migrateV1(draft);
    }
    if (version < 2) {
      migrateV2(draft);
    }
    if (version < 3) {
      migrateV3(draft);
    }
  });
}
