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

import SplitPanelLayout from "./";

it("renders only left panel when closed", () => {
  render(
    <SplitPanelLayout
      left={<div>left panel</div>}
      right={<div>right panel</div>}
      mode="closed"
    />
  );

  expect(screen.getByText(/left panel/i)).toBeInTheDocument();
  expect(screen.queryByText(/right panel/i)).not.toBeInTheDocument();
});

it("renders both panels when open", () => {
  render(
    <SplitPanelLayout
      left={<div>left panel</div>}
      right={<div>right panel</div>}
      mode="open"
    />
  );

  expect(screen.getByText(/left panel/i)).toBeInTheDocument();
  expect(screen.getByText(/right panel/i)).toBeInTheDocument();
});

it("renders both panels when collapsed", () => {
  render(
    <SplitPanelLayout
      left={<div>left panel</div>}
      right={<div>right panel</div>}
      mode="collapsed"
    />
  );

  expect(screen.getByText(/left panel/i)).toBeInTheDocument();
  expect(screen.getByText(/right panel/i)).toBeInTheDocument();
});

it("should adjust width when dragged", () => {
  render(
    <SplitPanelLayout
      left={<div>left panel</div>}
      right={<div>right panel</div>}
      mode="open"
    />
  );

  const before = screen.getByTestId("drag-handle").style.right;

  fireEvent.mouseDown(screen.getByTestId("drag-handle"));
  fireEvent.mouseMove(screen.getByTestId("drag-handle"), { clientX: 0 });
  fireEvent.mouseUp(screen.getByTestId("drag-handle"));

  const after = screen.getByTestId("drag-handle").style.right;

  expect(after).not.toBe(before);
});

it("should not adjust width when handle has not been clicked", () => {
  render(
    <SplitPanelLayout
      left={<div>left panel</div>}
      right={<div>right panel</div>}
      mode="open"
    />
  );

  const before = screen.getByTestId("drag-handle").style.right;

  fireEvent.mouseDown(screen.getByTestId("drag-handle"));
  fireEvent.mouseUp(screen.getByTestId("drag-handle"));

  fireEvent.mouseMove(screen.getByTestId("drag-handle"), { clientX: 0 });

  const after = screen.getByTestId("drag-handle").style.right;

  expect(after).toBe(before);
});
