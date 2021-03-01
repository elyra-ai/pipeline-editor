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

import React, { useCallback } from "react";
import ReactDOM from "react-dom";

import { CustomNodeSpecification } from "../types";

interface Props {
  nodes: CustomNodeSpecification[];
}

export function Node({ image, label }: any) {
  return (
    <svg className="svg-area" width="172px" height="40px" x="0" y="0">
      <g className="d3-canvas-group">
        <g className="d3-nodes-links-group">
          <g className="d3-node-group" transform="translate(6, 0)">
            <path
              className="d3-node-body-outline"
              d="M 0 0 L 160 0  L 160 14 A 6 6 180 0 1 160 26 L 160 40 L 0 40 L 0 26 A 6 6 180 0 1 0 14 Z"
            />
            <image
              className="node-image"
              xlinkHref={image}
              x="6"
              y="7"
              width="26"
              height="26"
            />
            <text className="d3-node-label" x="38" y="24.5">
              {label}
            </text>
            <circle className="d3-node-port-input" r="3" cx="0" cy="20" />
            <path
              className="d3-node-port-input-arrow"
              d="M -2 17 L 2 20 -2 23"
            />
            <circle className="d3-node-port-output" r="3" cx="160" cy="20" />
          </g>
        </g>
      </g>
    </svg>
  );
}

function PalettePanel({ nodes }: Props) {
  const handleDragStart = useCallback((e, node) => {
    const evData = {
      operation: "addToCanvas",
      data: {
        editType: "createExternalNode",
        op: node.op,
      },
    };

    const nodeGhost = document.createElement("div");
    nodeGhost.style.position = "absolute";
    nodeGhost.style.top = "-100px";
    document.body.appendChild(nodeGhost);
    ReactDOM.render(<Node {...node} />, nodeGhost);

    e.dataTransfer.setDragImage(nodeGhost, 86, 20);
    e.dataTransfer.setData("text", JSON.stringify(evData));
  }, []);

  return (
    <div className="elyra-palette">
      {nodes.map((n) => (
        <div
          key={n.op}
          className="elyra-paletteItem"
          draggable="true"
          onDragStart={(e) => {
            handleDragStart(e, n);
          }}
        >
          <img
            className="elyra-paletteItemIcon"
            draggable="false"
            src={n.image}
            alt=""
          />
          <div className="elyra-paletteItemLabel">{n.label}</div>
        </div>
      ))}
    </div>
  );
}

export default PalettePanel;
