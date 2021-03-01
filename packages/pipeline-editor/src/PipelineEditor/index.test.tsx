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

import { render, screen } from "@testing-library/react";

import { nodeSpec, samplePipeline } from "../test-utils";
import PipelineEditor from "./";

it("shows custom empty component for undefined pipeline", () => {
  render(
    <PipelineEditor pipeline={undefined}>custom empty message</PipelineEditor>
  );
  expect(screen.getByText(/custom empty message/i)).toBeInTheDocument();
});

it("shows custom empty component for null pipeline", () => {
  render(<PipelineEditor pipeline={null}>custom empty message</PipelineEditor>);
  expect(screen.getByText(/custom empty message/i)).toBeInTheDocument();
});

it("renders a pipeline with two nodes", () => {
  const { container } = render(<PipelineEditor pipeline={samplePipeline} />);

  expect(container.getElementsByClassName("d3-node-group")).toHaveLength(2);
});

it("renders a pipeline with two nodes in readOnly mode", () => {
  const { container } = render(
    <PipelineEditor pipeline={samplePipeline} readOnly />
  );

  expect(container.getElementsByClassName("d3-node-group")).toHaveLength(2);
});

it("throws error for invalid pipeline json", () => {
  const handleError = jest.fn();
  render(<PipelineEditor pipeline="xxx" onError={handleError} />);

  expect(handleError).toHaveBeenCalledTimes(1);
  expect(handleError).toHaveBeenCalledWith(expect.any(Error));
});

it("renders", () => {
  const handleError = jest.fn();
  render(
    <PipelineEditor
      pipeline={samplePipeline}
      nodes={[]}
      onError={handleError}
    />
  );
  expect(handleError).not.toHaveBeenCalled();
});

it("can add node through imperative handle", () => {
  let handle: any;
  const { container } = render(
    <PipelineEditor
      ref={(r) => (handle = r)}
      pipeline={samplePipeline}
      nodes={[nodeSpec]}
    />
  );

  expect(container.getElementsByClassName("d3-node-group")).toHaveLength(2);

  handle.addFile({ op: "execute-notebook-node", path: "example.ipynb" });

  expect(container.getElementsByClassName("d3-node-group")).toHaveLength(3);
});
