import React, { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_PANEL_WIDTH = 500;
const MIN_PANEL_WIDTH = 300;

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
}

function SplitPanelLayout({ left, right }: Props) {
  const [width, setWidth] = useState(DEFAULT_PANEL_WIDTH);

  const dragging = useRef(false);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (dragging.current) {
        e.preventDefault();
        const { clientX } = e;
        const rawPanelWidth = document.body.clientWidth - clientX;
        const panelWidth = Math.max(
          Math.min(document.body.clientWidth - MIN_PANEL_WIDTH, rawPanelWidth),
          MIN_PANEL_WIDTH
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
          // zIndex: 10000,
          position: "absolute",
          top: 0,
          bottom: 0,
          background: "var(--elyra-color-panel-bg)",
          // width: `${width}px`,
          left: 0,
          right: `${width}px`,
        }}
      >
        {left}
      </div>
      <div
        style={{
          // zIndex: 10000,
          position: "absolute",
          top: 0,
          bottom: 0,
          background: "var(--elyra-color-panel-border)",
          width: "1px",
          right: `${width}px`,
        }}
      />
      <div
        style={{
          // zIndex: 10000,
          position: "absolute",
          top: 0,
          bottom: 0,
          background: "var(--elyra-color-panel-bg)",
          width: `${width}px`,
          right: 0,
        }}
      >
        {right}
      </div>
      <div
        style={{
          // zIndex: 10000,
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

export default SplitPanelLayout;
