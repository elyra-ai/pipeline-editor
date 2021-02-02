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

import { useEffect, useRef } from "react";

import { CommonProperties } from "@elyra/canvas";
import { nanoid } from "nanoid";

import { BooleanControl, StringArrayControl } from "../CustomFormControls";
import { fillPropertiesWithSavedData } from "./properties-utils";

interface Props {
  selectedNodes?: any[];
  nodes: any[];
  actionHandler?: (id: string, appData: any, data: any) => any;
  onChange?: (nodeID: string, data: any) => any;
}

function PropertiesPanel({
  selectedNodes,
  nodes,
  actionHandler,
  onChange,
}: Props) {
  const controller = useRef<any>();

  // always be validating
  useEffect(() => {
    if (controller.current !== undefined) {
      controller.current.validatePropertiesValues();
    }
  });

  if (selectedNodes === undefined || selectedNodes.length === 0) {
    return <div>no nodes selected</div>;
  }

  if (selectedNodes.length > 1) {
    return <div>more than 1 node selected</div>;
  }

  const selectedNode = selectedNodes[0];
  const nodePropertiesSchema = nodes.find((n: any) => n.op === selectedNode.op);

  return (
    <CommonProperties
      propertiesInfo={{
        parameterDef: fillPropertiesWithSavedData(
          nodePropertiesSchema.properties,
          selectedNode.app_data
        ),
        appData: { id: nanoid() },
        labelEditable: false,
      }}
      propertiesConfig={{
        containerType: "Custom",
        rightFlyout: false,
        applyOnBlur: true,
      }}
      callbacks={{
        actionHandler: async (
          id: string,
          appData: any,
          data: any
        ): Promise<void> => {
          if (data.parameter_ref && data.index === undefined) {
            data.propertyValue = controller.current?.getPropertyValue({
              name: data.parameter_ref,
            });
          }
          const newValue = await actionHandler?.(id, appData, data);
          if (newValue && data.parameter_ref) {
            if (data.index !== undefined) {
              // If multiple files are selected, replace the given index in the dependencies list
              // and insert the rest of the values after that index.
              if (typeof newValue === "string") {
                data.propertyValue[data.index] = newValue;
              } else {
                newValue.forEach((val: any, i: number) => {
                  if (i === 0) {
                    data.propertyValue[data.index] = val;
                  } else {
                    data.propertyValue.splice(data.index, 0, val);
                  }
                });
              }
            } else {
              data.propertyValue = newValue;
            }
            controller.current?.updatePropertyValue(
              data.parameter_ref,
              data.propertyValue[0]
            );
          }
        },
        controllerHandler: (e: any) => {
          controller.current = e;
        },
        applyPropertyChanges: (e: any) => {
          onChange?.(selectedNode.id, e);
        },
        closePropertiesDialog: () => {},
      }}
      customControls={[StringArrayControl, BooleanControl]}
    />
  );
}

export default PropertiesPanel;
