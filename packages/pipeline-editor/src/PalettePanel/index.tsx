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

interface Props {
  nodes: any[];
}

function PalettePanel({ nodes }: Props) {
  const handleDragStart = useCallback((e, op) => {
    const evData = {
      operation: "addToCanvas",
      data: {
        editType: "createExternalNode",
        op,
      },
    };
    e.dataTransfer.setData("text", JSON.stringify(evData));
  }, []);

  return (
    <React.Fragment>
      {nodes.map((n) => (
        <div
          style={{
            display: "flex",
            height: "40px",
            backgroundColor: "red",
            margin: "16px",
            alignItems: "center",
            cursor: "grab",
          }}
          draggable="true"
          onDragStart={(e) => {
            handleDragStart(e, n.op);
          }}
        >
          <img
            style={{
              height: "26px",
              margin: "0 7px",
            }}
            draggable="false"
            src={n.image}
            alt=""
          />
          {n.label}
        </div>
      ))}
    </React.Fragment>
  );
}

export default PalettePanel;
