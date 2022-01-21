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

import styled from "styled-components";

import { hasValue, toPrettyString } from "./utils";

interface Props {
  error?: string;
  nodeLabel?: string;
  properties: {
    label: string;
    value: any;
  }[];
}

const Container = styled.div`
  padding-top: 7px;
  text-align: left;
`;

const Key = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  font-weight: 600;
`;

const Value = styled.div`
  margin-left: 7px;
  margin-bottom: 7px;
  white-space: pre-wrap;
`;

const ErrorValue = styled(Value)`
  color: ${({ theme }) => theme.palette.text.error};
`;

function NodeTooltip({ error, nodeLabel, properties }: Props) {
  return (
    <Container>
      {error && (
        <div>
          <Key>Error</Key>
          <ErrorValue>{toPrettyString(error)}</ErrorValue>
        </div>
      )}
      <Key>{nodeLabel}</Key>
      {properties
        .filter(({ value }) => hasValue(value))
        .map(({ label, value }) => (
          <div key={label}>
            <Key>{label}</Key>
            <Value>{toPrettyString(value)}</Value>
          </div>
        ))}
    </Container>
  );
}

export default NodeTooltip;
