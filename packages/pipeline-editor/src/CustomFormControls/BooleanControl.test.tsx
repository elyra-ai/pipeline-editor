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
import { Provider } from "react-redux";

import BooleanControl from "./BooleanControl";
import { createPropertiesStore } from "./test-utils";

const propertyId = { name: "boolean" };

it("has an id", () => {
  expect(BooleanControl.id()).toBe("pipeline-editor-boolean-control");
});

it("renders helper text", () => {
  const store = createPropertiesStore(propertyId, true);

  const data = { helperText: "helper text" };

  const control = new BooleanControl(propertyId, {}, data);
  const { container } = render(
    <Provider store={store}>{control.renderControl()}</Provider>
  );

  expect(container.firstChild).toHaveTextContent(/helper text/i);
});

it("renders checked", () => {
  const store = createPropertiesStore(propertyId, true);

  const data = { helperText: "helper text" };

  const control = new BooleanControl(propertyId, {}, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  expect(screen.getByRole("checkbox")).toBeChecked();
});

it("renders not checked", () => {
  const store = createPropertiesStore(propertyId, false);

  const data = { helperText: "helper text" };

  const control = new BooleanControl(propertyId, {}, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  expect(screen.getByRole("checkbox")).not.toBeChecked();
});

it("calls updatePropertyValue on with true when not checked", () => {
  const store = createPropertiesStore(propertyId, false);

  const updatePropertyValue = jest.fn();

  const data = { helperText: "helper text" };

  const control = new BooleanControl(propertyId, { updatePropertyValue }, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByRole("checkbox"));

  expect(updatePropertyValue).toHaveBeenCalledWith(propertyId, true);
});

it("calls updatePropertyValue on with false when checked", () => {
  const store = createPropertiesStore(propertyId, true);

  const updatePropertyValue = jest.fn();

  const data = { helperText: "helper text" };

  const control = new BooleanControl(propertyId, { updatePropertyValue }, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByRole("checkbox"));

  expect(updatePropertyValue).toHaveBeenCalledWith(propertyId, false);
});
