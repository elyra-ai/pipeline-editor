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

import { fireEvent, render, screen } from "@testing-library/react";

import PalettePanel, { Node } from "./";

describe("Node", () => {
  it("renders", () => {
    render(<Node image="fake" label="example label" />);
    expect(screen.getByText("example label")).toBeInTheDocument();
  });
});

it("can drag node", () => {
  render(
    <PalettePanel
      nodes={[
        {
          image: "fake",
          label: "example label",
          op: "",
          description: "",
        },
      ]}
    />
  );

  const setDragImage = jest.fn();
  const setData = jest.fn();
  fireEvent.dragStart(screen.getByText("example label"), {
    dataTransfer: {
      setDragImage,
      setData,
    },
  });

  expect(setDragImage).toHaveBeenCalledTimes(1);
  expect(setData).toHaveBeenCalledTimes(1);
  expect(setData).toHaveBeenCalledWith("text", expect.any(String));
});
