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

import PipelineEditor from "./";

it("shows custom empty component for undefined pipeline", () => {
  const { container } = render(
    <PipelineEditor pipeline={undefined}>custom empty message</PipelineEditor>
  );
  expect(container.firstChild).toHaveTextContent(/custom empty message/i);
});

it("shows custom empty component for null pipeline", () => {
  const { container } = render(
    <PipelineEditor pipeline={null}>custom empty message</PipelineEditor>
  );
  expect(container.firstChild).toHaveTextContent(/custom empty message/i);
});
