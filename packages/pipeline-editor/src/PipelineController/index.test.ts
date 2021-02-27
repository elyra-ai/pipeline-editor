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

import {
  PipelineOutOfDateError,
  InvalidPipelineError,
  ElyraOutOfDateError,
} from "../errors";
import PipelineController, { PIPELINE_CURRENT_VERSION } from "./";

it("should throw for an invalid pipeline", () => {
  function open() {
    const controller = new PipelineController();
    controller.open({
      version: "3.0",
      pipelines: [{ app_data: { version: "3" } }],
    });
  }
  expect(open).toThrow(new InvalidPipelineError());
});

it("should throw for an out of date pipeline", () => {
  function open() {
    const controller = new PipelineController();
    controller.open({
      version: "3.0",
      pipelines: [{ app_data: { version: 1 } }],
    });
  }
  expect(open).toThrow(new PipelineOutOfDateError());
});

it("should throw for an out of date elyra", () => {
  function open() {
    const controller = new PipelineController();
    controller.open({
      version: "3.0",
      pipelines: [{ app_data: { version: PIPELINE_CURRENT_VERSION + 1 } }],
    });
  }
  expect(open).toThrow(new ElyraOutOfDateError());
});

it("should open a valid pipeline", () => {
  function open() {
    const controller = new PipelineController();
    controller.open({
      version: "3.0",
      pipelines: [{ app_data: { version: PIPELINE_CURRENT_VERSION } }],
    });
  }

  expect(open).not.toThrow();
});

it("should not attempt to re-open the same pipeline", () => {
  const pipeline = {
    version: "3.0",
    pipelines: [{ app_data: { version: 1 } }],
  };

  const controller = new PipelineController();
  function open() {
    controller.open(pipeline);
  }
  expect(open).toThrow(new PipelineOutOfDateError());
  expect(open).not.toThrow();
});

it("should attempt to re-open the same pipeline if they are not the same reference", () => {
  const controller = new PipelineController();
  function open() {
    const pipeline = {
      version: "3.0",
      pipelines: [{ app_data: { version: 1 } }],
    };
    controller.open(pipeline);
  }
  expect(open).toThrow(new PipelineOutOfDateError());
  expect(open).toThrow(new PipelineOutOfDateError());
});
