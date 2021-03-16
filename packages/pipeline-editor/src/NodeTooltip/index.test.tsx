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

import { render } from "@testing-library/react";

import NodeTooltip from "./";

it("renders one item", () => {
  const { container } = render(
    <NodeTooltip properties={[{ label: "Label", value: "some value" }]} />
  );
  expect(container.firstChild).toHaveTextContent(/label/i);
  expect(container.firstChild).toHaveTextContent(/some value/i);
});

it("renders multiple items", () => {
  const { container } = render(
    <NodeTooltip
      properties={[
        { label: "Label", value: "some value" },
        { label: "Array", value: ["one", "two"] },
      ]}
    />
  );

  expect(container.firstChild).toHaveTextContent(/label/i);
  expect(container.firstChild).toHaveTextContent(/some value/i);

  expect(container.firstChild).toHaveTextContent(/array/i);
  expect(container.firstChild).toHaveTextContent(/one/i);
  expect(container.firstChild).toHaveTextContent(/two/i);
});

it("renders with errors", () => {
  const { container } = render(
    <NodeTooltip error="this is an error" properties={[]} />
  );

  expect(container.firstChild).toHaveTextContent(/error/i);
  expect(container.firstChild).toHaveTextContent(/this is an error/i);
});

it("renders with errors and properties", () => {
  const { container } = render(
    <NodeTooltip
      error="this is an error"
      properties={[{ label: "Label", value: "some value" }]}
    />
  );

  expect(container.firstChild).toHaveTextContent(/error/i);
  expect(container.firstChild).toHaveTextContent(/this is an error/i);

  expect(container.firstChild).toHaveTextContent(/label/i);
  expect(container.firstChild).toHaveTextContent(/some value/i);
});
