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

import { PropertiesPanel, Message } from "./PropertiesPanel";

interface Props {
  selectedNodes?: any[];
  nodes: any[];
  onFileRequested?: (options: any) => any;
  onPropertiesUpdateRequested?: (options: any) => any;
  onChange?: (nodeID: string, data: any) => any;
}

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

  const nodePropertiesSchema = nodes.find((n: any) => n.op === selectedNode.op);

  if (nodePropertiesSchema === undefined) {
    return (
      <Message>This node type doesn't have any editable properties.</Message>
    );
  }

  return (
    <PropertiesPanel
      currentProperties={selectedNode.app_data}
      propertiesSchema={nodePropertiesSchema}
      onFileRequested={onFileRequested}
      onChange={(data: any) => {
        onChange?.(selectedNode.id, data);
      }}
      id={selectedNode.id}
    />
  );
}

export default NodeProperties;
