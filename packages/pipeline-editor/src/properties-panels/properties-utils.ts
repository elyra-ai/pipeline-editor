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

import { PropertyDefinitions } from "@elyra/canvas";
import produce from "immer";

import { nestedToPrefixed } from "../PipelineController";

export interface CommonPropertiesSchema {
  current_parameters: {
    [key: string]: any;
  };
  parameters: CommonPropertiesSchema.Parameter[];
  uihints: CommonPropertiesSchema.UIHints;
  resources: any;
}

declare namespace CommonPropertiesSchema {
  export interface UIHints {
    id: string;
    parameter_info: any[];
    action_info?: any[];
    group_info: any[];
  }
  export interface StringParameter {
    id: string;
    type: "string";
    required: boolean;
  }
  export interface StringArrayParameter {
    id: string;
    type: "array[string]";
    required: boolean;
    data?: any;
  }
  export interface BooleanParameter {
    id: string;
    type: "cboolean";
    required: boolean;
  }
  export interface EnumParameter {
    id: string;
    enum: any[];
    required: boolean;
  }
  export type Parameter =
    | StringParameter
    | StringArrayParameter
    | BooleanParameter
    | EnumParameter;
}

export function fillPropertiesWithSavedData(
  properties: PropertyDefinitions,
  appData: { [key: string]: any }
) {
  console.log("refilling", appData);
  return produce(properties, (draftState) => {
    const prefixed = nestedToPrefixed(appData);
    for (const [key, val] of Object.entries(prefixed)) {
      if (val !== undefined && val !== null) {
        console.log("filled");
        draftState.current_parameters![key] = val;
      } else {
        console.log("MISSED", key, val);
      }
    }
  });
}
