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

import { nanoid } from "nanoid";

import migrate from "./";

jest.mock("nanoid");

describe("migrate v3 to v4", () => {
  it("should only bump version", () => {
    // @ts-ignore
    nanoid.mockImplementation(() => "test-id");

    const v2 = {
      pipelines: [
        {
          app_data: {
            name: "name",
            version: 3,
          },
          nodes: [
            {
              app_data: {
                filename: "metric-aix360-lime.ipynb",
                runtime_image: "continuumio/anaconda3:2020.07",
                env_vars: [],
                include_subdirectories: false,
                outputs: [],
                dependencies: ["codait_utils.ipynb"],
                ui_data: {},
              },
            },
            {
              app_data: {
                filename: "metric-aix360-lime.ipynb",
                runtime_image: "continuumio/anaconda3:2020.07",
                env_vars: [],
                include_subdirectories: false,
                outputs: [],
                dependencies: [
                  "codait_utils.ipynb",
                  "codait_utils.ipynb",
                  "codait_utils.ipynb",
                ],
                ui_data: {},
              },
            },
          ],
        },
      ],
    };
    const expected = {
      pipelines: [
        {
          app_data: {
            name: "name",
            version: 4,
          },
          nodes: [
            {
              app_data: {
                filename: "metric-aix360-lime.ipynb",
                runtime_image: "continuumio/anaconda3:2020.07",
                env_vars: [],
                include_subdirectories: false,
                outputs: [],
                dependencies: [
                  {
                    value: "codait_utils.ipynb",
                    id: "test-id",
                  },
                ],
                ui_data: {},
              },
            },
            {
              app_data: {
                filename: "metric-aix360-lime.ipynb",
                runtime_image: "continuumio/anaconda3:2020.07",
                env_vars: [],
                include_subdirectories: false,
                outputs: [],
                dependencies: [
                  {
                    value: "codait_utils.ipynb",
                    id: "test-id",
                  },
                  {
                    value: "codait_utils.ipynb",
                    id: "test-id",
                  },
                  {
                    value: "codait_utils.ipynb",
                    id: "test-id",
                  },
                ],
                ui_data: {},
              },
            },
          ],
        },
      ],
    };
    const actual = migrate(v2);
    expect(actual).toEqual(expected);
  });
});
