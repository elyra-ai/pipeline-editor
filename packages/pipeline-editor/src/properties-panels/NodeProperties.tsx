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

import produce from "immer";
import { useState } from "react";
import styled from "styled-components";

import { PropertiesPanel, Message } from "./PropertiesPanel";

interface Props {
  selectedNodes?: any[];
  nodes: {
    op: string;
    label?: string;
    app_data: {
      properties?: any;
      parameter_refs?: {
        filehandler?: string;
      };
    };
  }[];
  upstreamNodes?: any[];
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
  upstreamNodes,
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

  if (nodePropertiesSchema === undefined) {
    return (
      <Message>
        This node uses a component that is not stored in your component
        registry.
        {selectedNode.app_data.component_source !== undefined
          ? ` The component's path is: ${selectedNode.app_data.component_source}`
          : ""}
      </Message>
    );
  }

  if (nodePropertiesSchema?.app_data.properties === undefined) {
    return (
      <Message>This node type doesn't have any editable properties.</Message>
    );
  }

  const refs = nodePropertiesSchema.app_data.parameter_refs;

  // returns the node properties for selectedNode with the most recent content
  const getNodeProperties = (): any => {
    const oneOfValues: any[] = [];

    // add each upstream node to the data list
    for (const upstreamNode of upstreamNodes ?? []) {
      const nodeDef = nodes.find((n) => n.op === upstreamNode.op);
      const options = [];

      const nodeProperties =
        nodeDef?.app_data.properties.properties.component_parameters.properties;
      // Add each property with a format of outputpath to the options field
      for (const prop in nodeProperties ?? {}) {
        const properties = nodeProperties[prop] ?? {};
        if (properties.uihints?.outputpath) {
          // Creates a "oneof" object for each node / output pair
          oneOfValues.push({
            title: `${upstreamNode.app_data?.ui_data?.label}: ${properties.title}`,
            type: "object",
            properties: {
              value: {
                type: "string",
                default: upstreamNode.id,
              },
              option: {
                type: "string",
                default: prop,
              },
            },
            uihints: {
              value: {
                "ui:field": "hidden",
              },
              option: {
                "ui:field": "hidden",
              },
              label: "false",
            },
          });
        }
      }
    }

    // update property data to include data for properties with inputpath format
    return produce(
      nodePropertiesSchema?.app_data.properties.properties.component_parameters,
      (draft: any) => {
        draft.properties = {
          label: {
            title: "Label",
            type: "string",
          },
          ...draft.properties,
        };
        for (let prop in draft.properties) {
          if (draft.properties[prop].uihints?.inputpath) {
            if (oneOfValues.length > 0) {
              draft.properties[prop].oneOf = oneOfValues;
            } else {
              draft.properties[prop].type = "string";
              draft.properties[prop].enum = [];
            }
          } else if (draft.properties[prop].oneOf) {
            for (const i in draft.properties[prop].oneOf) {
              if (
                draft.properties[prop].oneOf[i].properties.widget.default ===
                "inputpath"
              ) {
                if (oneOfValues.length === 0) {
                  draft.properties[prop].oneOf[i].properties.value.type =
                    "string";
                  draft.properties[prop].oneOf[i].properties.value.enum = [];
                } else {
                  draft.properties[prop].oneOf[
                    i
                  ].properties.value.oneOf = oneOfValues;
                  delete draft.properties[prop].oneOf[i].uihints.value;
                }
              }
            }
          }
        }
      }
    );
  };

  const [formData, setFormData] = useState(selectedNodes[0].app_data);

  return (
    <div>
      <Heading>{nodePropertiesSchema.label}</Heading>
      <PropertiesPanel
        schema={getNodeProperties()}
        data={formData}
        onChange={(data: any) => {
          setFormData(data);
          onChange?.(selectedNode.id, data);
        }}
        onFileRequested={onFileRequested}
        onPropertiesUpdateRequested={onPropertiesUpdateRequested}
      />
    </div>
  );
}

export default NodeProperties;
