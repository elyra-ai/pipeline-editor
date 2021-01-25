import { useEffect, useRef } from "react";

import { CommonProperties } from "@elyra/canvas";
import { nanoid } from "nanoid";

import { BooleanControl, StringArrayControl } from "../CustomFormControls";
import { fillPropertiesWithSavedData } from "./properties-utils";

interface Props {
  selectedNodes?: any[];
  nodes: any[];
  onChange?: (nodeID: string, data: any) => any;
}

function PropertiesPanel({ selectedNodes, nodes, onChange }: Props) {
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
        actionHandler: (e: any) => {},
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
