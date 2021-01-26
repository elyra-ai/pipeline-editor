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
  rightOpen?: boolean;
}

function SplitPanelLayout({ left, right, rightOpen }: Props) {
  const [width, setWidth] = useState(rightOpen ? DEFAULT_PANEL_WIDTH : 0);

  const dragging = useRef(false);

  useEffect(() => {
    setWidth(rightOpen ? DEFAULT_PANEL_WIDTH : 0);
  }, [rightOpen]);

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
      {rightOpen ? (
        <div>
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
        </div>
      ) : null}
    </React.Fragment>
  );
}

export default SplitPanelLayout;
