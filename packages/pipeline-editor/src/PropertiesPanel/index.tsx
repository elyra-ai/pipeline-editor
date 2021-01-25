import React, { useEffect, useRef } from "react";

import { CommonProperties } from "@elyra/canvas";
import { nanoid } from "nanoid";

import { BooleanControl, StringArrayControl } from "./CustomFormControls";
import { toCommonProperties } from "./properties-utils";

function PropertiesContent({
  selectedNodes,
  nodes,
  canvasController,
  onChange,
}: any) {
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
        parameterDef: toCommonProperties(
          nodePropertiesSchema.properties ?? [],
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
        actionHandler: (e: any) => {},
        controllerHandler: (e: any) => {
          controller.current = e;
        },
        applyPropertyChanges: (e: any) => {
          canvasController.setNodeProperties(
            selectedNode.id,
            { app_data: e },
            canvasController.getPrimaryPipelineId()
          );

          onChange();
        },
        closePropertiesDialog: () => {},
      }}
      customControls={[StringArrayControl, BooleanControl]}
    />
  );
}

function PropertiesPanel({
  selectedNodes,
  nodes,
  canvasController,
  onPropertiesChange,
}: any) {
  return (
    <React.Fragment>
      <div>
        <div style={{ display: "flex" }}>
          <div>NODE PROPERTIES</div>
          <div>PALETTE</div>
        </div>
        <div>
          <div className="codicon codicon-close"></div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: "35px",
          bottom: 0,
          overflow: "scroll",
          width: "100%",
        }}
      >
        <PropertiesContent
          selectedNodes={selectedNodes}
          nodes={nodes}
          canvasController={canvasController}
          onChange={onPropertiesChange}
        />
      </div>
    </React.Fragment>
  );
}

export default PropertiesPanel;
