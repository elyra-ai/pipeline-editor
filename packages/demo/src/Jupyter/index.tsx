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

import { useEffect, useState } from "react";

import { PipelineEditor } from "@elyra/pipeline-editor";

import nodes from "../nodes";
import pipeline from "../pipeline";

import "./index.css";

function Jupyter() {
  useEffect(() => {
    document.body.classList.add("pipeline-editor-jupyter");
    return () => {
      document.body.classList.remove("pipeline-editor-jupyter");
    };
  }, []);

  const [panelOpen, setPanelOpen] = useState(false);
  const togglePanelOpen = () => {
    setPanelOpen(!panelOpen);
  };

  const toolbar = {
    leftBar: [
      {
        action: "run",
        label: "Run Pipeline",
        enable: true,
      },
      {
        action: "save",
        label: "Save Pipeline",
        enable: true,
      },
      {
        action: "export",
        label: "Export Pipeline",
        enable: true,
      },
      {
        action: "clear",
        label: "Clear Pipeline",
        enable: true,
      },
      {
        action: "openRuntimes",
        label: "Open Runtimes",
        enable: true,
      },
      { divider: true },
      { action: "undo", label: "Undo" },
      { action: "redo", label: "Redo" },
      { action: "cut", label: "Cut" },
      { action: "copy", label: "Copy" },
      { action: "paste", label: "Paste" },
      { action: "createAutoComment", label: "Add Comment", enable: true },
      { action: "deleteSelectedObjects", label: "Delete" },
      {
        action: "arrangeHorizontally",
        label: "Arrange Horizontally",
        enable: true,
      },
      {
        action: "arrangeVertically",
        label: "Arrange Vertically",
        enable: true,
      },
    ],
    rightBar: [
      {
        action: "toggleOpenPanel",
        label: panelOpen ? "Close panel" : "Open panel",
        enable: true,
        iconTypeOverride: panelOpen ? "paletteOpen" : "paletteClose",
      },
    ],
  };

  return (
    <div style={{ height: "100vh" }}>
      <PipelineEditor
        nodes={nodes}
        toolbar={toolbar}
        pipeline={pipeline}
        panelOpen={panelOpen}
        togglePanelOpen={togglePanelOpen}
      />
    </div>
  );
}

export default Jupyter;
