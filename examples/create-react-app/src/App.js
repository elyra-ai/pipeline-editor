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

import { useState } from "react";

import { PipelineEditor, ThemeProvider } from "@elyra/pipeline-editor";

import { createNode } from "./node-utils";
import imagePath from "./node.svg";
import theme from "./theme";

const node = createNode({
  op: "execute-node",
  description: "A simple node",
  label: "Node",
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
        palette={{
          version: "3.0",
          categories: [{ node_types: [node] }],
        }}
        onChange={setPipeline}
      />
    </ThemeProvider>
  );
}

export default App;
