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

import { fillPropertiesWithSavedData } from "./properties-utils";

describe("fillPropertiesWithSavedData", () => {
  it("should not fill properties that are not defined in schema", () => {
    const defaults = {
      current_parameters: {
        filename: "",
        runtime_image: "",
        dependencies: [],
        include_subdirectories: false,
        env_vars: [],
        outputs: [],
      },
    };
    const result = fillPropertiesWithSavedData(defaults, { bloop: "hello" });
    expect(result.current_parameters).toEqual({
      filename: "",
      runtime_image: "",
      dependencies: [],
      include_subdirectories: false,
      env_vars: [],
      outputs: [],
    });
  });

  it("should use defaults values", () => {
    const defaults = {
      current_parameters: {
        filename: "example.ipynb",
        runtime_image: "",
        dependencies: [],
        include_subdirectories: true,
        env_vars: [],
        outputs: [],
      },
    };
    const result = fillPropertiesWithSavedData(defaults, {});
    expect(result.current_parameters).toEqual({
      filename: "example.ipynb",
      runtime_image: "",
      dependencies: [],
      include_subdirectories: true,
      env_vars: [],
      outputs: [],
    });
  });

  it("should not override a value if it is undefined", () => {
    const defaults = {
      current_parameters: {
        filename: "example.ipynb",
        runtime_image: "",
        dependencies: [],
        include_subdirectories: false,
        env_vars: [],
        outputs: [],
      },
    };
    const result = fillPropertiesWithSavedData(defaults, {
      filename: undefined,
    });
    expect(result.current_parameters).toEqual({
      filename: "example.ipynb",
      runtime_image: "",
      dependencies: [],
      include_subdirectories: false,
      env_vars: [],
      outputs: [],
    });
  });

  it("should not override a value if it is null", () => {
    const defaults = {
      current_parameters: {
        filename: "example.ipynb",
        runtime_image: "",
        dependencies: [],
        include_subdirectories: false,
        env_vars: [],
        outputs: [],
      },
    };
    const result = fillPropertiesWithSavedData(defaults, {
      filename: null,
    });
    expect(result.current_parameters).toEqual({
      filename: "example.ipynb",
      runtime_image: "",
      dependencies: [],
      include_subdirectories: false,
      env_vars: [],
      outputs: [],
    });
  });

  it("should fill values", () => {
    const defaults = {
      current_parameters: {
        filename: "",
        runtime_image: "",
        dependencies: [],
        include_subdirectories: false,
        env_vars: [],
        outputs: [],
      },
    };
    const result = fillPropertiesWithSavedData(defaults, {
      filename: "example.ipynb",
      runtime_image: "example/runtime",
      dependencies: [{ value: "one" }],
      include_subdirectories: true,
      env_vars: [],
      outputs: [{ value: "one" }, { value: "two" }],
    });
    expect(result.current_parameters).toEqual({
      filename: "example.ipynb",
      runtime_image: "example/runtime",
      dependencies: [{ value: "one" }],
      include_subdirectories: true,
      env_vars: [],
      outputs: [{ value: "one" }, { value: "two" }],
    });
  });
});
