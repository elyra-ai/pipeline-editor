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

import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import FileControl from "./FileControl";
import { createPropertiesStore } from "./test-utils";

const propertyId = { name: "file" };

it("has an id", () => {
  expect(FileControl.id()).toBe("pipeline-editor-file-control");
});

it("renders nothing when path is an undefined", () => {
  const store = createPropertiesStore(propertyId, undefined);

  const data = {};

  const control = new FileControl(propertyId, {}, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  const input = screen.getByRole("textbox");

  expect(input.getAttribute("placeholder")).toBeFalsy();
  expect(input).toHaveValue("");
});

it("renders nothing when path is an empty string", () => {
  const store = createPropertiesStore(propertyId, "");

  const data = {};

  const control = new FileControl(propertyId, {}, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  const input = screen.getByRole("textbox");

  expect(input.getAttribute("placeholder")).toBeFalsy();
  expect(input).toHaveValue("");
});

it("renders placeholder when path is undefined", () => {
  const store = createPropertiesStore(propertyId, undefined);

  const data = { placeholder: "placeholder text" };

  const control = new FileControl(propertyId, {}, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  expect(screen.getByPlaceholderText("placeholder text")).toBeTruthy();

  const input = screen.getByRole("textbox");

  expect(input).toHaveValue("");
});

it("renders placeholder when path is an empty string", () => {
  const store = createPropertiesStore(propertyId, "");

  const data = { placeholder: "placeholder text" };

  const control = new FileControl(propertyId, {}, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  expect(screen.getByPlaceholderText("placeholder text")).toBeTruthy();

  const input = screen.getByRole("textbox");

  expect(input).toHaveValue("");
});

it("renders errors", () => {
  const store = createPropertiesStore(propertyId, "", { type: "error" });

  const data = {};

  const control = new FileControl(propertyId, {}, data);
  const { container } = render(
    <Provider store={store}>{control.renderControl()}</Provider>
  );

  expect(container.firstChild).toHaveClass("error");
});

it("renders a path", () => {
  const store = createPropertiesStore(propertyId, "path/example.ipynb");

  const data = {};

  const control = new FileControl(propertyId, {}, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  const input = screen.getByRole("textbox");

  expect(input).toHaveValue("path/example.ipynb");
});

it("has input dissabled", () => {
  const store = createPropertiesStore(propertyId, "");

  const data = {};

  const control = new FileControl(propertyId, {}, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  const input = screen.getByRole("textbox");

  expect(input).toBeDisabled();
});

it("does not call updatePropertyValue when no files are chosen", async () => {
  const store = createPropertiesStore(propertyId, "");

  const updatePropertyValue = jest.fn();

  const actionHandler = jest.fn().mockResolvedValue([]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    updatePropertyValue,
    getHandlers,
  };

  const data = {};

  const control = new FileControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByRole("button"));

  expect(actionHandler).toHaveBeenCalledTimes(1);
  expect(actionHandler).toHaveBeenCalledWith("browse_file", undefined, {
    canSelectMany: false,
    defaultUri: "",
    filters: { Notebook: ["ipynb"] },
  });

  await waitFor(() => {
    expect(updatePropertyValue).not.toHaveBeenCalled();
  });
});

it("calls updatePropertyValue when one file is chosen", async () => {
  const store = createPropertiesStore(propertyId, "");

  const updatePropertyValue = jest.fn();

  const actionHandler = jest.fn().mockResolvedValue(["example.ipynb"]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    updatePropertyValue,
    getHandlers,
  };

  const data = {};

  const control = new FileControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByRole("button"));

  expect(actionHandler).toHaveBeenCalledTimes(1);
  expect(actionHandler).toHaveBeenCalledWith("browse_file", undefined, {
    canSelectMany: false,
    defaultUri: "",
    filters: { Notebook: ["ipynb"] },
  });

  await waitFor(() => {
    expect(updatePropertyValue).toHaveBeenCalledWith(
      propertyId,
      "example.ipynb"
    );
  });
});

it("calls updatePropertyValue with the first file if multiple are chosen", async () => {
  const store = createPropertiesStore(propertyId, "");

  const updatePropertyValue = jest.fn();

  const actionHandler = jest.fn().mockResolvedValue(["one.ipynb", "two.ipynb"]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    updatePropertyValue,
    getHandlers,
  };

  const data = {};

  const control = new FileControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByRole("button"));

  expect(actionHandler).toHaveBeenCalledTimes(1);
  expect(actionHandler).toHaveBeenCalledWith("browse_file", undefined, {
    canSelectMany: false,
    defaultUri: "",
    filters: { Notebook: ["ipynb"] },
  });

  await waitFor(() => {
    expect(updatePropertyValue).toHaveBeenCalledWith(propertyId, "one.ipynb");
  });
});

it("calls actionHandler with a default uri if a path is already selected", async () => {
  const store = createPropertiesStore(propertyId, "some/path/example.ipynb");

  const updatePropertyValue = jest.fn();

  const actionHandler = jest.fn().mockResolvedValue([]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    updatePropertyValue,
    getHandlers,
  };

  const data = {};

  const control = new FileControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByRole("button"));

  expect(actionHandler).toHaveBeenCalledTimes(1);
  expect(actionHandler).toHaveBeenCalledWith("browse_file", undefined, {
    canSelectMany: false,
    defaultUri: "some/path/example.ipynb",
    filters: { Notebook: ["ipynb"] },
  });

  await waitFor(() => {
    expect(updatePropertyValue).not.toHaveBeenCalled();
  });
});

it("doesn't crash when actionHandler is not defined", async () => {
  const store = createPropertiesStore(propertyId, "some/path/example.ipynb");

  const updatePropertyValue = jest.fn();

  const getHandlers = jest.fn(() => ({}));

  const controller = {
    updatePropertyValue,
    getHandlers,
  };

  const data = {};

  const control = new FileControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByRole("button"));

  expect(getHandlers).toHaveBeenCalledTimes(1);
});
