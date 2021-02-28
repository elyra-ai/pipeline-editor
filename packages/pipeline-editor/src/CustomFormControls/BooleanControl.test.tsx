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

import { fireEvent, render } from "@testing-library/react";
import { Provider } from "react-redux";

import BooleanControl from "./BooleanControl";
import { createPropertiesStore } from "./test-utils";

it("has an id", () => {
  expect(BooleanControl.id()).toBe("pipeline-editor-boolean-control");
});

it("renders helper text", () => {
  const store = createPropertiesStore("boolean", true);

  const control = new BooleanControl(
    { name: "boolean" },
    {},
    { helperText: "helper text" }
  );
  const { container } = render(
    <Provider store={store}>{control.renderControl()}</Provider>
  );

  expect(container.firstChild).toHaveTextContent(/helper text/i);
});

it("renders checked", () => {
  const store = createPropertiesStore("boolean", true);

  const control = new BooleanControl(
    { name: "boolean" },
    {},
    { helperText: "helper text" }
  );
  const { getByRole } = render(
    <Provider store={store}>{control.renderControl()}</Provider>
  );

  expect(getByRole("checkbox").getAttribute("aria-checked")).toBe("true");
});

it("renders not checked", () => {
  const store = createPropertiesStore("boolean", false);

  const control = new BooleanControl(
    { name: "boolean" },
    {},
    { helperText: "helper text" }
  );
  const { getByRole } = render(
    <Provider store={store}>{control.renderControl()}</Provider>
  );

  expect(getByRole("checkbox").getAttribute("aria-checked")).toBe("false");
});

it("calls updatePropertyValue on with true when not checked", () => {
  const store = createPropertiesStore("boolean", false);

  const updatePropertyValue = jest.fn();

  const control = new BooleanControl(
    { name: "boolean" },
    { updatePropertyValue },
    { helperText: "helper text" }
  );
  const { getByRole } = render(
    <Provider store={store}>{control.renderControl()}</Provider>
  );

  fireEvent.click(getByRole("checkbox"));

  expect(updatePropertyValue).toHaveBeenCalledWith({ name: "boolean" }, true);
});

it("calls updatePropertyValue on with false when checked", () => {
  const store = createPropertiesStore("boolean", true);

  const updatePropertyValue = jest.fn();

  const control = new BooleanControl(
    { name: "boolean" },
    { updatePropertyValue },
    { helperText: "helper text" }
  );
  const { getByRole } = render(
    <Provider store={store}>{control.renderControl()}</Provider>
  );

  fireEvent.click(getByRole("checkbox"));

  expect(updatePropertyValue).toHaveBeenCalledWith({ name: "boolean" }, false);
});
