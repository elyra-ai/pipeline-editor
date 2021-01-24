import { useEffect } from "react";

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

  return (
    <div style={{ height: "100vh" }}>
      <PipelineEditor nodes={nodes} mode="jupyter" pipeline={pipeline} />
    </div>
  );
}

export default Jupyter;
