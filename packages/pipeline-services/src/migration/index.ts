/*
 * Copyright 2018-2023 Elyra Authors
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
import migrateV4 from "./migrateV4";
import migrateV5 from "./migrateV5";
import migrateV6 from "./migrateV6";
import migrateV7 from "./migrateV7";
import migrateV8 from "./migrateV8";
import { mockPaletteV7 } from "./utils";

export * from "./errors";

export function migrate(
  pipelineJSON: any,
  setNodePathsRelativeToPipelineV2?: (pipeline: any) => any
) {
  return produce(pipelineJSON, (draft: any) => {
    const version = draft.pipelines[0].app_data?.version ?? 0;
    if (version < 1) {
      console.debug("migrating pipeline from v0 to v1");
      migrateV1(draft);
    }
    if (version < 2) {
      console.debug("migrating pipeline from v1 to v2");
      migrateV2(draft, setNodePathsRelativeToPipelineV2);
    }
    if (version < 3) {
      console.debug("migrating pipeline from v2 to v3");
      migrateV3(draft);
    }
    if (version < 4) {
      console.debug("migrating pipeline from v3 to v4");
      migrateV4(draft);
    }
    if (version < 5) {
      console.debug("migrating pipeline from v4 to v5");
      migrateV5(draft);
    }
    // Note: starting with v8 the palette changed, so we now use
    // a copy of the palette as it was at v7 to migrate to v6/v7
    if (version < 6) {
      console.debug("migrating pipeline from v5 to v6");
      migrateV6(draft, mockPaletteV7);
    }
    if (version < 7) {
      console.debug("migrating pipeline from v6 to v7");
      migrateV7(draft, mockPaletteV7);
    }
    if (version < 8) {
      console.debug("migrating pipeline from v7 to v8");
      migrateV8(draft);
    }
  });
}
