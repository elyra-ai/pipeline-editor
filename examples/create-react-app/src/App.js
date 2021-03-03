import { useState } from "react";

import { PipelineEditor } from "@elyra/pipeline-editor";

import node from "./node";
import PipelineLogo from "./PipelineLogo";

import "./styles.css";

function App() {
  const [pipeline, setPipeline] = useState();
  return (
    <PipelineEditor pipeline={pipeline} nodes={[node]} onChange={setPipeline}>
      <PipelineLogo />
    </PipelineEditor>
  );
}

export default App;
