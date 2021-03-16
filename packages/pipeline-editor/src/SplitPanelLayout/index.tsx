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

import React, { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_PANEL_WIDTH = 500;
const MIN_PANEL_WIDTH = 300;

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
  mode: "open" | "collapsed" | "closed";
}

interface RightPanelProps {
  mode: "open" | "collapsed" | "closed";
  width: number;
  children: React.ReactNode;
  onMouseDown: () => any;
}

function RightPanel({ mode, width, children, onMouseDown }: RightPanelProps) {
  switch (mode) {
    case "open":
      return (
        <div>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              background: "var(--elyra-color-panel-bg)",
              borderLeft: "1px solid var(--elyra-color-panel-border)",
              width: `${width}px`,
              right: 0,
            }}
          >
            {children}
          </div>
          <div
            data-testid="drag-handle"
            style={{
              position: "absolute",
              cursor: "col-resize",
              top: 0,
              bottom: 0,
              width: "8px",
              right: `${width - 4}px`,
            }}
            onMouseDown={onMouseDown}
          />
        </div>
      );
    case "collapsed":
      return (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            background: "var(--vscode-statusBar-background)",
            width: `${32}px`,
            right: 0,
          }}
        >
          {children}
        </div>
      );
    case "closed":
      return null;
  }
}

function SplitPanelLayout({ left, right, mode }: Props) {
  const [dragPosition, setDragPosition] = useState<number | undefined>(
    undefined
  );

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
        setDragPosition(panelWidth);
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

  const width = mode === "open" ? dragPosition ?? DEFAULT_PANEL_WIDTH : 0;

  return (
    <React.Fragment>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          background: "var(--elyra-color-panel-bg)",
          left: 0,
          right: `${width}px`,
        }}
      >
        {left}
      </div>
      <RightPanel mode={mode} width={width} onMouseDown={handleMouseDown}>
        {right}
      </RightPanel>
    </React.Fragment>
  );
}

export default SplitPanelLayout;
