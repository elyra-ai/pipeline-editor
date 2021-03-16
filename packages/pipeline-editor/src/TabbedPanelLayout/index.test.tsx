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
import userEvent from "@testing-library/user-event";

import TabbedPanelLayout from "./";

it("calls onTabClick with correct tab id in collapsed mode", async () => {
  const handleTabClick = jest.fn();
  render(
    <TabbedPanelLayout
      currentTab="one"
      tabs={[
        {
          id: "one",
          label: "Tab one",
          content: <div>Tab one content</div>,
        },
        {
          id: "two",
          label: "Tab two",
          content: <div>Tab two content</div>,
        },
      ]}
      collapsed
      onTabClick={handleTabClick}
    />
  );

  userEvent.click(screen.getByTitle(/tab two/i));

  expect(handleTabClick).toHaveBeenCalledWith("two");
});

it("calls onTabClick with correct tab id in expanded mode", async () => {
  const handleTabClick = jest.fn();
  render(
    <TabbedPanelLayout
      currentTab="one"
      tabs={[
        {
          id: "one",
          label: "Tab one",
          content: <div>Tab one content</div>,
        },
        {
          id: "two",
          label: "Tab two",
          content: <div>Tab two content</div>,
        },
      ]}
      onTabClick={handleTabClick}
    />
  );

  userEvent.click(screen.getByText(/tab two/i));

  expect(handleTabClick).toHaveBeenCalledWith("two");
});

it("calls onClose", async () => {
  const handleClose = jest.fn();
  render(
    <TabbedPanelLayout
      currentTab="one"
      tabs={[
        {
          id: "one",
          label: "Tab one",
          content: <div>Tab one content</div>,
        },
        {
          id: "two",
          label: "Tab two",
          content: <div>Tab two content</div>,
        },
      ]}
      onClose={handleClose}
      showCloseButton
    />
  );

  userEvent.click(screen.getByTitle(/close panel/i));

  expect(handleClose).toHaveBeenCalled();
});

it("does not break with no close handler", async () => {
  render(
    <TabbedPanelLayout
      currentTab="one"
      tabs={[
        {
          id: "one",
          label: "Tab one",
          content: <div>Tab one content</div>,
        },
        {
          id: "two",
          label: "Tab two",
          content: <div>Tab two content</div>,
        },
      ]}
      showCloseButton
    />
  );

  userEvent.click(screen.getByTitle(/close panel/i));
});

it("does not break with no tab click handler", async () => {
  const { rerender } = render(
    <TabbedPanelLayout
      currentTab="one"
      tabs={[
        {
          id: "one",
          label: "Tab one",
          content: <div>Tab one content</div>,
        },
        {
          id: "two",
          label: "Tab two",
          content: <div>Tab two content</div>,
        },
      ]}
    />
  );

  userEvent.click(screen.getByText(/tab two/i));

  rerender(
    <TabbedPanelLayout
      currentTab="one"
      tabs={[
        {
          id: "one",
          label: "Tab one",
          content: <div>Tab one content</div>,
        },
        {
          id: "two",
          label: "Tab two",
          content: <div>Tab two content</div>,
        },
      ]}
      collapsed
    />
  );

  userEvent.click(screen.getByTitle(/tab two/i));
});

it("renders the first tab when no current tab is provided", async () => {
  const { container } = render(
    <TabbedPanelLayout
      tabs={[
        {
          id: "one",
          label: "Tab one",
          content: <div>Tab one content</div>,
        },
        {
          id: "two",
          label: "Tab two",
          content: <div>Tab two content</div>,
        },
      ]}
    />
  );

  expect(container).toHaveTextContent(/tab one content/i);
});

it("shows invalid tab message when current tab doesn't exist", async () => {
  const { container } = render(
    <TabbedPanelLayout
      currentTab="three"
      tabs={[
        {
          id: "one",
          label: "Tab one",
          content: <div>Tab one content</div>,
        },
        {
          id: "two",
          label: "Tab two",
          content: <div>Tab two content</div>,
        },
      ]}
    />
  );

  expect(container).toHaveTextContent(/invalid tab id/i);
});
