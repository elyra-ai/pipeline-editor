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

import React, { useEffect, useRef } from "react";

import { CommonProperties } from "@elyra/canvas";

import {
  BooleanControl,
  FileControl,
  StringArrayControl,
} from "../CustomFormControls";
import { fillPropertiesWithSavedData } from "./properties-utils";

interface Props {
  selectedNodes?: any[];
  nodes: any[];
  onFileRequested?: (options: any) => any;
  onChange?: (nodeID: string, data: any) => any;
}

function PropertiesPanel({
  selectedNodes,
  nodes,
  onFileRequested,
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
    return (
      <div className="elyra-noContentMessage">
        Select a node to edit its properties.
      </div>
    );
  }

  if (selectedNodes.length > 1) {
    return (
      <div className="elyra-noContentMessage">
        Multiple nodes are selected. Select a single node to edit its
        properties.
      </div>
    );
  }

  const selectedNode = selectedNodes[0];

  if (selectedNode.type !== "execution_node") {
    return (
      <div className="elyra-noContentMessage">
        This node type doesn't have any editable properties.
      </div>
    );
  }

  const nodePropertiesSchema = nodes.find((n: any) => n.op === selectedNode.op);

  if (nodePropertiesSchema === undefined) {
    return (
      <div className="elyra-noContentMessage">
        This node type doesn't have any editable properties.
      </div>
    );
  }

  return (
    <CommonProperties
      key={selectedNode.id}
      propertiesInfo={{
        parameterDef: fillPropertiesWithSavedData(
          nodePropertiesSchema.properties,
          selectedNode.app_data
        ),
        labelEditable: false,
      }}
      propertiesConfig={{
        containerType: "Custom",
        rightFlyout: false,
      }}
      callbacks={{
        actionHandler: async (id: string, _appData: any, data: any) => {
          switch (id) {
            case "browse_file":
              return await onFileRequested?.(data);
          }
        },
        controllerHandler: (e: any) => {
          controller.current = e;
        },
        propertyListener: (e: any) => {
          if (e.action === "UPDATE_PROPERTY") {
            onChange?.(selectedNode.id, controller.current.getPropertyValues());
          }
        },
      }}
      customControls={[StringArrayControl, BooleanControl, FileControl]}
    />
  );
}

export default PropertiesPanel;
