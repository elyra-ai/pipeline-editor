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

import { useCallback } from "react";
import ReactDOM from "react-dom";

import styled from "styled-components";

interface NodeProps {
  image: string;
  label: string;
}

export function Node({ image, label }: NodeProps) {
  return (
    <svg className="svg-area" width="172px" height="35px" x="0" y="0">
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
              x="12.5"
              y="0"
              width="16"
              height="35"
            />
            <foreignObject
              x="34.5"
              y="9"
              width="112"
              height="19"
              className="d3-foreign-object"
            >
              <div className="d3-node-label  d3-node-label-single-line">
                <span>{label}</span>
              </div>
            </foreignObject>
            <circle className="d3-node-port-input" r="3" cx="0" cy="17.5" />
            <path
              className="d3-node-port-input-arrow"
              d="M -2 17 L 2 20 -2 23"
            />
            <circle className="d3-node-port-output" r="3" cx="160" cy="17.5" />
          </g>
        </g>
      </g>
    </svg>
  );
}

const Container = styled.div`
  margin-top: 14px;
`;

const Item = styled.div.attrs({ draggable: true })`
  display: flex;
  align-items: center;
  cursor: grab;
  height: 40px;
  margin: 0 22px 8px;
  background-color: ${({ theme }) => theme.palette.background.secondary};
  border: 1px solid transparent;
`;

const Icon = styled.img.attrs({ draggable: false, alt: "" })`
  height: 26px;
  margin: 0 7px;
`;

const Label = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight};
  font-size: ${({ theme }) => theme.typography.fontSize};
  color: ${({ theme }) => theme.palette.text.primary};
`;

interface Props {
  nodes: {
    op: string;
    app_data: {
      ui_data?: {
        label?: string;
        image?: string;
      };
    };
  }[];
}

function PalettePanel({ nodes }: Props) {
  const handleDragStart = useCallback((e, node) => {
    const evData = {
      operation: "addToCanvas",
      data: {
        editType: "createExternalNode",
        nodeTemplate: {
          op: node.op,
        },
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
    <Container>
      {nodes.map((n) => (
        <Item key={n.op} onDragStart={(e) => handleDragStart(e, n)}>
          <Icon src={n.app_data.ui_data?.image} />
          <Label>{n.app_data.ui_data?.label}</Label>
        </Item>
      ))}
    </Container>
  );
}

export default PalettePanel;
