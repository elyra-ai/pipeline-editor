import { useEffect } from "react";

import { PipelineEditor } from "@elyra/pipeline-editor";

import nodes from "../nodes";
import pipeline from "../pipeline";

import "./index.css";

function VSCode() {
  useEffect(() => {
    document.body.classList.add("pipeline-editor-vscode");
    return () => {
      document.body.classList.remove("pipeline-editor-vscode");
    };
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <PipelineEditor nodes={nodes} pipeline={pipeline} />
    </div>
  );
}

export default VSCode;
