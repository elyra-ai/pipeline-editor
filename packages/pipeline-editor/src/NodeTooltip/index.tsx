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

import { hasValue, toPrettyString } from "./utils";

interface Props {
  error?: string;
  properties: {
    label: string;
    value: any;
  }[];
}

function NodeTooltip({ error, properties }: Props) {
  return (
    <div className="elyra-PipelineNodeTooltip">
      {error && (
        <div className="elyra-tooltipError">
          <div className="elyra-tooltipKey">Error</div>
          <div className="elyra-tooltipValue">{toPrettyString(error)}</div>
        </div>
      )}
      {properties
        .filter(({ value }) => hasValue(value))
        .map(({ label, value }) => (
          <div key={label}>
            <div className="elyra-tooltipKey">{label}</div>
            <div className="elyra-tooltipValue">{toPrettyString(value)}</div>
          </div>
        ))}
    </div>
  );
}

export default NodeTooltip;
