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

export interface Link {
  id: string;
  trgNodeId: string;
  srcNodeId: string;
  type: string;
  path: any[];
}

export interface CircularReferenceInfo {
  type: "circularReference";
  pipelineID: string;
  linkID: string;
}

export interface MissingPropertyInfo {
  type: "missingProperty";
  pipelineID: string;
  nodeID?: string;
  property: string;
}

export interface InvalidPropertyInfo {
  type: "invalidProperty";
  pipelineID: string;
  nodeID?: string;
  property: string;
  message: string;
}

export interface MissingComponentInfo {
  type: "missingComponent";
  pipelineID: string;
  nodeID: string;
  op: string;
}

export interface Problem {
  severity: 1 | 2 | 3 | 4 | undefined;
  range: {
    offset: number;
    length: number;
  };
  message: string;
  info:
    | CircularReferenceInfo
    | MissingPropertyInfo
    | InvalidPropertyInfo
    | MissingComponentInfo;
}

export interface PartialProblem {
  message: string;
  path: any[];
  info:
    | CircularReferenceInfo
    | MissingPropertyInfo
    | InvalidPropertyInfo
    | MissingComponentInfo;
}

export interface NestedEnumData {
  value: string;
  label: string;
  options?: {
    value: string;
    label: string;
  }[];
}

export interface NestedEnumFlatData {
  value: string;
  option: string;
}
