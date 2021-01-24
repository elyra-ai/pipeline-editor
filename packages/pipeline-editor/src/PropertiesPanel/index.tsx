import React, { useCallback, useEffect, useRef, useState } from "react";

import { CommonProperties } from "@elyra/canvas";

import { BooleanControl, StringArrayControl } from "./CustomFormControls";
import { toCommonProperties } from "./properties-utils";

function PropertiesPanel({ schema }: any) {
  const [width, setWidth] = useState(600);

  const dragging = useRef(false);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (dragging.current) {
        e.preventDefault();
        const min = 300;
        const { clientX } = e;
        const rawPanelWidth = document.body.clientWidth - clientX;
        const panelWidth = Math.max(
          Math.min(document.body.clientWidth - min, rawPanelWidth),
          min
        );
        setWidth(panelWidth);
      }
    }

    function handleMouseUp() {
      dragging.current = false;
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = useCallback(() => {
    dragging.current = true;
  }, []);

  return (
    <React.Fragment>
      <div
        style={{
          zIndex: 10000,
          position: "absolute",
          top: 0,
          bottom: 0,
          background: "var(--color-panel-border)",
          width: "1px",
          right: `${width}px`,
        }}
      />
      <div
        style={{
          zIndex: 10000,
          position: "absolute",
          top: 0,
          bottom: 0,
          background: "var(--color-panel-bg)",
          width: `${width}px`,
          right: 0,
        }}
      >
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
          }}
        >
          <CommonProperties
            propertiesInfo={{
              parameterDef: toCommonProperties(schema),
              appData: { id: "" },
              labelEditable: false,
            }}
            propertiesConfig={{
              containerType: "Custom",
              rightFlyout: false,
              applyOnBlur: true,
            }}
            callbacks={{
              actionHandler: () => {},
              controllerHandler: () => {},
              applyPropertyChanges: () => {},
              closePropertiesDialog: () => {},
            }}
            customControls={[StringArrayControl, BooleanControl]}
          />
        </div>
      </div>
      <div
        style={{
          zIndex: 10000,
          position: "absolute",
          cursor: "col-resize",
          top: 0,
          bottom: 0,
          width: "8px",
          right: `${width - 4}px`,
        }}
        onMouseDown={handleMouseDown}
      />
    </React.Fragment>
  );
}

export default PropertiesPanel;
