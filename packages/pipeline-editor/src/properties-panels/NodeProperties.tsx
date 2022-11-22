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

import { NodeType } from "@elyra/canvas";
import produce from "immer";
import styled from "styled-components";

import { PropertiesPanel, Message } from "./PropertiesPanel";

interface Props {
  selectedNodes?: any[];
  nodes: NodeType[];
  upstreamNodes?: any[];
  onFileRequested?: (options: any) => any;
  onPropertiesUpdateRequested?: (options: any) => any;
  onChange?: (nodeID: string, data: any) => any;
  parameters?: {
    name: string;
    default_value?: {
      type: "str" | "int" | "float" | "bool" | "list" | "dict";
      value: any;
    };
    type?: string;
    required?: boolean;
  }[];
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

function getOneOfValue(value: string, option: string, label: string) {
  return {
    title: label,
    type: "object",
    properties: {
      value: {
        type: "string",
        default: value,
      },
      option: {
        type: "string",
        default: option,
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
  };
}

function NodeProperties({
  selectedNodes,
  nodes,
  upstreamNodes,
  onFileRequested,
  onPropertiesUpdateRequested,
  onChange,
  parameters,
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

  // returns the node properties for selectedNode with the most recent content
  const getNodeProperties = (): any => {
    const oneOfValues: any[] = [];
    const oneOfValuesNoOpt: any[] = [];

    // add each upstream node to the data list
    for (const upstreamNode of upstreamNodes ?? []) {
      const nodeDef = nodes.find((n) => n.op === upstreamNode.op);
      const prevLen = oneOfValuesNoOpt.length;

      const nodeProperties =
        nodeDef?.app_data.properties.properties.component_parameters.properties;
      // Add each property with a format of outputpath to the options field
      for (const prop in nodeProperties ?? {}) {
        const properties = nodeProperties[prop] ?? {};
        if (properties.uihints?.outputpath) {
          // Creates a "oneof" object for each node / output pair
          const oneOfValue = getOneOfValue(
            upstreamNode.id,
            prop,
            `${upstreamNode.app_data?.ui_data?.label}: ${properties.title}`
          );
          oneOfValues.push(oneOfValue);
          oneOfValuesNoOpt.push(oneOfValue);
        }
      }
      if (oneOfValuesNoOpt.length <= prevLen) {
        // Add oneOfValue for parent without specified outputs
        oneOfValuesNoOpt.push(
          getOneOfValue(
            upstreamNode.id,
            "",
            upstreamNode.app_data?.ui_data?.label
          )
        );
      }
    }

    // update property data to include data for properties with inputpath format
    return produce(
      nodePropertiesSchema?.app_data?.properties ?? {},
      (draft: any) => {
        draft.properties = {
          label: {
            title: "Label",
            description: "A custom label for the node.",
            type: "string",
          },
          ...draft.properties,
        };
        const component_properties =
          draft.properties.component_parameters?.properties ?? {};
        if (component_properties.pipeline_parameters?.items?.enum) {
          component_properties.pipeline_parameters.items.enum = parameters?.map(
            (param) => {
              return param.name;
            }
          );
          component_properties.pipeline_parameters.uihints = {
            "ui:widget": "checkboxes",
          };
        }
        for (let prop in component_properties) {
          if (
            component_properties[prop].properties?.value &&
            component_properties[prop].properties?.widget
          ) {
            const properties = component_properties[prop].properties;
            const oneOf = properties.value?.uihints?.allownooptions
              ? oneOfValuesNoOpt
              : oneOfValues;
            component_properties[prop].required = ["value"];
            if (
              properties?.widget?.default === "inputpath" &&
              properties.value
            ) {
              if (oneOf.length > 0) {
                properties.value.oneOf = oneOf;
                delete properties.value.enum;
                delete properties.value.type;
              }
            }
          } else if (component_properties[prop].oneOf) {
            for (const i in component_properties[prop].oneOf) {
              const nestedOneOf = component_properties[prop].oneOf[i].uihints
                ?.allownooptions
                ? oneOfValuesNoOpt
                : oneOfValues;
              component_properties[prop].oneOf[i].required = ["value"];
              if (
                component_properties[prop].oneOf[i].properties?.value
                  ?.default === undefined &&
                component_properties[prop].oneOf[i].properties?.value?.type ===
                  "string"
              ) {
                component_properties[prop].oneOf[i].properties.value.default =
                  "";
              }
              if (
                component_properties[prop].oneOf[i].properties.widget
                  .default === "inputpath"
              ) {
                if (nestedOneOf.length > 0) {
                  component_properties[prop].oneOf[
                    i
                  ].properties.value.oneOf = nestedOneOf;
                  delete component_properties[prop].oneOf[i].properties.value
                    .type;
                  delete component_properties[prop].oneOf[i].properties.value
                    .enum;
                }
              }
            }
          }
        }
      }
    );
  };

  return (
    <div>
      <Heading>{nodePropertiesSchema.label}</Heading>
      <span className="nodeDescription">
        {nodePropertiesSchema.description}
      </span>
      <PropertiesPanel
        key={selectedNode.id}
        schema={getNodeProperties()}
        data={selectedNode.app_data}
        onChange={(data: any) => {
          onChange?.(selectedNode.id, data);
        }}
        onFileRequested={onFileRequested}
        onPropertiesUpdateRequested={onPropertiesUpdateRequested}
      />
    </div>
  );
}

export default NodeProperties;
