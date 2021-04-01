import { useState } from "react";

import { PipelineEditor, ThemeProvider } from "@elyra/pipeline-editor";

import { createNode } from "./node-utils";
import imagePath from "./node.svg";
import theme from "./theme";

const node = createNode({
  op: "execute-node",
  description: "A simple node",
  label: "Node",
  labelField: "label",
  image: imagePath,
  properties: [
    {
      id: "label",
      type: "string",
      label: "Label",
      description: "The label that shows up on the node.",
      default: "",
      required: true,
    },
    {
      id: "enum",
      type: "string",
      enum: ["one", "two"],
      label: "Choose",
      description: "Choose one or the other.",
      default: "one",
    },
    {
      id: "yes-or-no",
      type: "boolean",
      label: "Yes or no?",
      description: "Something should happen when this node is run.",
      default: false,
    },
    {
      id: "array",
      type: "string[]",
      label: "Things",
      description: "Add some things okay.",
      default: [],
    },
  ],
});

function App() {
  const [pipeline, setPipeline] = useState();
  return (
    <ThemeProvider theme={theme}>
      <PipelineEditor
        pipeline={pipeline}
        nodes={[node]}
        onChange={setPipeline}
      />
    </ThemeProvider>
  );
}

export default App;
