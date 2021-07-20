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

import userEvent from "@testing-library/user-event";
import { IntlProvider } from "react-intl";

import {
  render,
  screen,
  nodeSpec,
  selectedNode,
  createPalette,
} from "../test-utils";
import NodeProperties from "./NodeProperties";

const nodes = createPalette([nodeSpec]).categories![0].node_types![0];

it("renders with undefined nodes selected", () => {
  const { container } = render(<NodeProperties nodes={[]} />);
  expect(container.firstChild).toHaveTextContent(
    /select a node to edit its properties/i
  );
});

it("renders with no nodes selected", () => {
  const { container } = render(
    <NodeProperties nodes={[]} selectedNodes={[]} />
  );
  expect(container.firstChild).toHaveTextContent(
    /select a node to edit its properties/i
  );
});

it("renders with multiple nodes selected", () => {
  const { container } = render(
    <NodeProperties nodes={[]} selectedNodes={[{}, {}]} />
  );
  expect(container.firstChild).toHaveTextContent(
    /multiple nodes are selected/i
  );
});

it("renders with supernode selected", () => {
  const { container } = render(
    <NodeProperties nodes={[]} selectedNodes={[{ type: "super_node" }]} />
  );
  expect(container.firstChild).toHaveTextContent(
    /this node type doesn't have any editable properties/i
  );
});

it("renders if selected node op isn't defined in schema", () => {
  const { container } = render(
    <NodeProperties nodes={[]} selectedNodes={[selectedNode]} />
  );
  expect(container.firstChild).toHaveTextContent(
    /this node type doesn't have any editable properties/i
  );
});

it("renders common properties with one node selected", () => {
  render(
    <IntlProvider locale="en">
      <NodeProperties nodes={[nodes]} selectedNodes={[selectedNode]} />
    </IntlProvider>
  );
  expect(screen.getByText(/notebook label/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/properties/i)).toBeInTheDocument();
});

it("calls onFileRequested when a browse button is pressed", async () => {
  const handleFileRequested = jest.fn().mockResolvedValue([]);
  render(
    <IntlProvider locale="en">
      <NodeProperties
        nodes={[nodes]}
        selectedNodes={[selectedNode]}
        onFileRequested={handleFileRequested}
      />
    </IntlProvider>
  );
  userEvent.click(screen.getByText(/browse/i));
  expect(handleFileRequested).toHaveBeenCalledTimes(1);
  expect(handleFileRequested).toHaveBeenCalledWith({
    canSelectMany: false,
    defaultUri: "example.ipynb",
    filters: { File: undefined },
    filename: "example.ipynb",
    propertyID: "elyra_filename",
  });
});

it("doesn't crash when a browse button is pressed and onFileRequested is undefined", async () => {
  render(
    <IntlProvider locale="en">
      <NodeProperties nodes={[nodes]} selectedNodes={[selectedNode]} />
    </IntlProvider>
  );
  userEvent.click(screen.getByText(/browse/i));
});

it("calls onChange when a field changes", async () => {
  const handleChange = jest.fn();
  render(
    <IntlProvider locale="en">
      <NodeProperties
        nodes={[nodes]}
        selectedNodes={[selectedNode]}
        onChange={handleChange}
      />
    </IntlProvider>
  );
  // UPDATE_PROPERTY is triggered on mount sometimes?
  const initialCalls = handleChange.mock.calls.length;
  userEvent.click(screen.getByRole("checkbox"));
  expect(handleChange).toHaveBeenCalledTimes(initialCalls + 1);
});
