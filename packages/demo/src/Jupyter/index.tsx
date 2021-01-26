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
    console.log(panelOpen);
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
