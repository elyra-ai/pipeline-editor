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

import SplitPanelLayout from "./";

it("renders only left panel by default", () => {
  const { container } = render(
    <SplitPanelLayout
      left={<div>left panel</div>}
      right={<div>right panel</div>}
    />
  );
  expect(container.firstChild).toHaveTextContent(/left panel/i);
  expect(container.firstChild).not.toHaveTextContent(/right panel/i);
});

it("renders both panels", () => {
  const { container } = render(
    <SplitPanelLayout
      left={<div>left panel</div>}
      right={<div>right panel</div>}
      rightOpen
    />
  );

  expect(container.firstChild).toHaveTextContent("left panel");
  expect(container.firstChild).toHaveTextContent("right panel");
});
