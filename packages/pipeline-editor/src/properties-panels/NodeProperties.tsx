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

import styled from "styled-components";

import { PropertiesPanel, Message } from "./PropertiesPanel";

interface Props {
  selectedNodes?: any[];
  nodes: {
    op: string;
    label?: string;
    app_data: {
      properties?: any;
    };
  }[];
  onFileRequested?: (options: any) => any;
  onPropertiesUpdateRequested?: (options: any) => any;
  onChange?: (nodeID: string, data: any) => any;
}

const Heading = styled.div`
  margin-top: 14px;
  padding: 0 47px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight};
  font-size: 16px;
  color: ${({ theme }) => theme.palette.text.primary};
  opacity: 0.5;
`;

function NodeProperties({
  selectedNodes,
  nodes,
  onFileRequested,
  onPropertiesUpdateRequested,
  onChange,
}: Props) {
  if (selectedNodes === undefined || selectedNodes.length === 0) {
    return <Message>Select a node to edit its properties.</Message>;
  }

  if (selectedNodes.length > 1) {
    return (
      <Message>
        Multiple nodes are selected. Select a single node to edit its
        properties.
      </Message>
    );
  }

  const selectedNode = selectedNodes[0];

  if (!selectedNode) {
    return <Message>Select a node to edit its properties.</Message>;
  }

  if (selectedNode.type !== "execution_node") {
    return (
      <Message>This node type doesn't have any editable properties.</Message>
    );
  }

  const nodePropertiesSchema = nodes.find((n) => n.op === selectedNode.op);

  if (nodePropertiesSchema?.app_data.properties === undefined) {
    return (
      <Message>This node type doesn't have any editable properties.</Message>
    );
  }

  return (
    <div>
      <Heading> {nodePropertiesSchema.label} </Heading>
      <PropertiesPanel
        currentProperties={selectedNode.app_data}
        onPropertiesUpdateRequested={onPropertiesUpdateRequested}
        propertiesSchema={nodePropertiesSchema.app_data.properties}
        onFileRequested={onFileRequested}
        onChange={(data: any) => {
          onChange?.(selectedNode.id, data);
        }}
        id={selectedNode.id}
      />
    </div>
  );
}

export default NodeProperties;
