import { useEffect } from "react";

import { PipelineEditor } from "@elyra/pipeline-editor";

import pipeline from "../pipeline";

import "./index.css";

function GitHub() {
  useEffect(() => {
    document.body.classList.add("pipeline-editor-github");
    return () => {
      document.body.classList.remove("pipeline-editor-github");
    };
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <PipelineEditor pipeline={pipeline} readOnly />
    </div>
  );
}

export default GitHub;
