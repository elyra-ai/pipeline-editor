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
import { IntlProvider } from "react-intl";

import PropertiesPanel from "./";

it("renders with no nodes selected", () => {
  const { container } = render(<PropertiesPanel nodes={[]} />);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="elyra-noContentMessage"
    >
      Select a node to edit its properties.
    </div>
  `);
});

it("renders with no nodes selected", () => {
  const { container } = render(
    <PropertiesPanel nodes={[]} selectedNodes={[]} />
  );
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="elyra-noContentMessage"
    >
      Select a node to edit its properties.
    </div>
  `);
});

it("renders with multiple nodes selected", () => {
  const { container } = render(
    <PropertiesPanel nodes={[]} selectedNodes={[{}, {}]} />
  );
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="elyra-noContentMessage"
    >
      Multiple nodes are selected. Select a single node to edit its properties.
    </div>
  `);
});

it("renders with supernode selected", () => {
  const { container } = render(
    <PropertiesPanel nodes={[]} selectedNodes={[{ type: "super_node" }]} />
  );
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="elyra-noContentMessage"
    >
      This node type doesn't have any editable properties.
    </div>
  `);
});

it("renders if selected node op isn't defined in schema", () => {
  const { container } = render(
    <PropertiesPanel
      nodes={[]}
      selectedNodes={[
        {
          id: "0af8e1e7-4dd5-412e-95f1-812550843657",
          type: "execution_node",
          op: "execute-notebook-node",
          app_data: {
            filename: "example.ipynb",
            runtime_image: "example/runtime:2020.07",
            env_vars: [],
            include_subdirectories: false,
            outputs: [
              {
                value: "file1.csv",
                id: "Dkab7Ue1kg16BNy9muH0v",
              },
              {
                value: "file2.zip",
                id: "784X1_3yUJY9N_hmbPszs",
              },
            ],
            dependencies: [
              {
                value: "file.ipynb",
                id: "N7ohLGA_xMaMdElCIEW2X",
              },
            ],
          },
        },
      ]}
    />
  );
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="elyra-noContentMessage"
    >
      This node type doesn't have any editable properties.
    </div>
  `);
});

const node = {
  op: "execute-notebook-node",
  properties: {
    current_parameters: {
      filename: "",
      runtime_image: "",
      dependencies: [],
      include_subdirectories: false,
      env_vars: [],
      outputs: [],
    },
    parameters: [
      { id: "filename", type: "string", required: true },
      {
        id: "runtime_image",
        enum: ["continuumio/anaconda3:2020.07", "amancevice/pandas:1.0.3"],
        required: true,
      },
      { id: "dependencies", type: "array[string]", required: false },
      { id: "include_subdirectories", type: "cboolean", required: false },
      { id: "env_vars", type: "array[string]", required: false },
      { id: "outputs", type: "array[string]", required: false },
    ],
    uihints: {
      id: "nodeProperties",
      parameter_info: [
        {
          control: "custom",
          custom_control_id: "pipeline-editor-file-control",
          parameter_ref: "filename",
          label: { default: "File" },
          description: {
            default: "The path to the notebook file.",
            placement: "on_panel",
          },
        },
        {
          parameter_ref: "runtime_image",
          label: { default: "Runtime Image" },
          control: "oneofselect",
          description: {
            default: "Docker image used as execution environment.",
            placement: "on_panel",
          },
        },
        {
          control: "custom",
          custom_control_id: "pipeline-editor-string-array-control",
          parameter_ref: "dependencies",
          label: { default: "File Dependencies" },
          description: {
            default:
              "Local file dependencies that need to be copied to remote execution environment.",
            placement: "on_panel",
          },
          data: { placeholder: "*.py", fileBrowser: true },
        },
        {
          control: "custom",
          custom_control_id: "pipeline-editor-boolean-control",
          parameter_ref: "include_subdirectories",
          label: { default: "Include Subdirectories" },
          data: {
            helperText:
              "Wether or not to include recursively include subdirectories when submitting a pipeline (This may increase submission time).",
          },
        },
        {
          control: "custom",
          custom_control_id: "pipeline-editor-string-array-control",
          parameter_ref: "env_vars",
          label: { default: "Environment Variables" },
          description: {
            default:
              "Environment variables to be set on the execution environment.",
            placement: "on_panel",
          },
          data: { placeholder: "ENV_VAR=value" },
        },
        {
          control: "custom",
          custom_control_id: "pipeline-editor-string-array-control",
          parameter_ref: "outputs",
          label: { default: "Output Files" },
          description: {
            default:
              "Files generated during execution that will become available to all subsequent pipeline steps.",
            placement: "on_panel",
          },
          data: { placeholder: "*.csv" },
        },
      ],
      group_info: [
        {
          id: "nodeGroupInfo",
          type: "panels",
          group_info: [
            { id: "filename", type: "controls", parameter_refs: ["filename"] },
            {
              id: "runtime_image",
              type: "controls",
              parameter_refs: ["runtime_image"],
            },
            {
              id: "dependencies",
              type: "controls",
              parameter_refs: ["dependencies"],
            },
            {
              id: "include_subdirectories",
              type: "controls",
              parameter_refs: ["include_subdirectories"],
            },
            { id: "env_vars", type: "controls", parameter_refs: ["env_vars"] },
            { id: "outputs", type: "controls", parameter_refs: ["outputs"] },
          ],
        },
      ],
    },
    resources: {},
  },
};

it("renders with one node selected", () => {
  const { container } = render(
    <IntlProvider locale="en">
      <PropertiesPanel
        nodes={[node]}
        selectedNodes={[
          {
            id: "0af8e1e7-4dd5-412e-95f1-812550843657",
            type: "execution_node",
            op: "execute-notebook-node",
            app_data: {
              filename: "example.ipynb",
              runtime_image: "example/runtime:2020.07",
              env_vars: [],
              include_subdirectories: false,
              outputs: [
                {
                  value: "file1.csv",
                  id: "Dkab7Ue1kg16BNy9muH0v",
                },
                {
                  value: "file2.zip",
                  id: "784X1_3yUJY9N_hmbPszs",
                },
              ],
              dependencies: [
                {
                  value: "file.ipynb",
                  id: "N7ohLGA_xMaMdElCIEW2X",
                },
              ],
            },
          },
        ]}
      />
    </IntlProvider>
  );
  expect(container.firstChild).toMatchInlineSnapshot(`
    <aside
      aria-label="Properties"
      class="properties-wrapper properties-large"
      role="complementary"
      tabindex="0"
    >
      <div />
      <div
        class="properties-custom-container"
      >
        <div
          class="properties-editor-form"
        >
          <div
            class="properties-category"
          >
            <div
              class="properties-control-panel"
              data-id="properties-nodeGroupInfo"
            >
              <div
                class="properties-control-panel"
                data-id="properties-filename"
              >
                <div
                  class="properties-control-item"
                  data-id="properties-ci-filename"
                >
                  <div
                    class="properties-label-container"
                  >
                    <label
                      class="properties-control-label"
                    >
                      File
                    </label>
                    <span
                      class="properties-required-indicator"
                    >
                      *
                    </span>
                  </div>
                  <div
                    class="properties-control-description"
                  >
                    The path to the notebook file.
                  </div>
                  <div
                    class="properties-custom-ctrl"
                  >
                    <div
                      class="elyra-fileControl"
                    >
                      <input
                        disabled=""
                        type="text"
                        value="example.ipynb"
                      />
                      <button>
                        Browse
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="properties-control-panel"
                data-id="properties-runtime_image"
              >
                <div
                  class="properties-control-item"
                  data-id="properties-ci-runtime_image"
                >
                  <div
                    class="properties-label-container"
                  >
                    <label
                      class="properties-control-label"
                    >
                      Runtime Image
                    </label>
                    <span
                      class="properties-required-indicator"
                    >
                      *
                    </span>
                  </div>
                  <div
                    class="properties-control-description"
                  >
                    Docker image used as execution environment.
                  </div>
                  <div
                    class="properties-dropdown error"
                    data-id="properties-runtime_image"
                  >
                    <div
                      class="bx--dropdown__wrapper bx--list-box__wrapper"
                    >
                      
                      <div
                        class="bx--dropdown bx--dropdown--light bx--list-box bx--list-box--light"
                        id="properties-runtime_image-dropdown"
                      >
                        <button
                          aria-disabled="false"
                          aria-expanded="false"
                          aria-haspopup="listbox"
                          aria-labelledby="downshift-0-label downshift-0-toggle-button"
                          class="bx--list-box__field"
                          id="downshift-0-toggle-button"
                          type="button"
                        >
                          <span
                            class="bx--list-box__label"
                          >
                            ...
                          </span>
                          <div
                            class="bx--list-box__menu-icon"
                          >
                            <svg
                              aria-label="Open menu"
                              fill="currentColor"
                              focusable="false"
                              height="16"
                              name="chevron--down"
                              preserveAspectRatio="xMidYMid meet"
                              role="img"
                              viewBox="0 0 16 16"
                              width="16"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z"
                              />
                              <title>
                                Open menu
                              </title>
                            </svg>
                          </div>
                        </button>
                        <div
                          aria-labelledby="downshift-0-label"
                          class="bx--list-box__menu"
                          id="downshift-0-menu"
                          role="listbox"
                          tabindex="-1"
                        />
                      </div>
                    </div>
                    <div
                      class="properties-validation-message"
                    >
                      <div
                        class="icon"
                      >
                        <svg
                          aria-hidden="true"
                          class="canvas-state-icon-error properties-icon "
                          fill="currentColor"
                          focusable="false"
                          height="16"
                          preserveAspectRatio="xMidYMid meet"
                          viewBox="0 0 16 16"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8,1C4.1,1,1,4.1,1,8s3.1,7,7,7s7-3.1,7-7S11.9,1,8,1z M10.7,11.5L4.5,5.3l0.8-0.8l6.2,6.2L10.7,11.5z"
                          />
                          <path
                            d="M10.7,11.5L4.5,5.3l0.8-0.8l6.2,6.2L10.7,11.5z"
                            data-icon-path="inner-path"
                            fill="none"
                            opacity="0"
                          />
                        </svg>
                      </div>
                      <span>
                        Required parameter 'Runtime Image' has no value.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="properties-control-panel"
                data-id="properties-dependencies"
              >
                <div
                  class="properties-control-item"
                  data-id="properties-ci-dependencies"
                >
                  <div
                    class="properties-label-container"
                  >
                    <label
                      class="properties-control-label"
                    >
                      File Dependencies
                    </label>
                  </div>
                  <div
                    class="properties-control-description"
                  >
                    Local file dependencies that need to be copied to remote execution environment.
                  </div>
                  <div
                    class="properties-custom-ctrl"
                  >
                    <div
                      class="elyra-stringArrayControl"
                    >
                      <div
                        class="elyra-stringArrayControl-listGroup"
                      >
                        <div
                          class="elyra-stringArrayControl-listRow"
                        >
                          <div
                            class="elyra-stringArrayControl-listItem"
                          >
                            file.ipynb
                          </div>
                          <div
                            class="elyra-stringArrayControl-listActions"
                          >
                            <div
                              class="elyra-actionItem"
                            >
                              <div
                                class="elyra-icon elyra-actionItemIcon elyra-item-edit"
                              />
                            </div>
                            <div
                              class="elyra-actionItem"
                            >
                              <div
                                class="elyra-icon elyra-actionItemIcon elyra-item-delete"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="elyra-stringArrayControl-buttonGroup"
                        style="display: flex;"
                      >
                        <button>
                          Add 
                          Item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="properties-control-panel"
                data-id="properties-include_subdirectories"
              >
                <div
                  class="properties-control-item"
                  data-id="properties-ci-include_subdirectories"
                >
                  <div
                    class="properties-label-container"
                  >
                    <label
                      class="properties-control-label"
                    >
                      Include Subdirectories
                    </label>
                  </div>
                  <div
                    class="properties-custom-ctrl"
                  >
                    <div
                      style="display: flex;"
                    >
                      <div
                        aria-checked="false"
                        aria-label=""
                        class="elyra-icon properties-checkbox"
                        role="checkbox"
                        tabindex="0"
                      />
                      <div
                        class="properties-control-description"
                      >
                        Wether or not to include recursively include subdirectories when submitting a pipeline (This may increase submission time).
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="properties-control-panel"
                data-id="properties-env_vars"
              >
                <div
                  class="properties-control-item"
                  data-id="properties-ci-env_vars"
                >
                  <div
                    class="properties-label-container"
                  >
                    <label
                      class="properties-control-label"
                    >
                      Environment Variables
                    </label>
                  </div>
                  <div
                    class="properties-control-description"
                  >
                    Environment variables to be set on the execution environment.
                  </div>
                  <div
                    class="properties-custom-ctrl"
                  >
                    <div
                      class="elyra-stringArrayControl"
                    >
                      <div
                        class="elyra-stringArrayControl-listGroup"
                      />
                      <div
                        class="elyra-stringArrayControl-buttonGroup"
                        style="display: flex;"
                      >
                        <button>
                          Add 
                          Item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="properties-control-panel"
                data-id="properties-outputs"
              >
                <div
                  class="properties-control-item"
                  data-id="properties-ci-outputs"
                >
                  <div
                    class="properties-label-container"
                  >
                    <label
                      class="properties-control-label"
                    >
                      Output Files
                    </label>
                  </div>
                  <div
                    class="properties-control-description"
                  >
                    Files generated during execution that will become available to all subsequent pipeline steps.
                  </div>
                  <div
                    class="properties-custom-ctrl"
                  >
                    <div
                      class="elyra-stringArrayControl"
                    >
                      <div
                        class="elyra-stringArrayControl-listGroup"
                      >
                        <div
                          class="elyra-stringArrayControl-listRow"
                        >
                          <div
                            class="elyra-stringArrayControl-listItem"
                          >
                            file1.csv
                          </div>
                          <div
                            class="elyra-stringArrayControl-listActions"
                          >
                            <div
                              class="elyra-actionItem"
                            >
                              <div
                                class="elyra-icon elyra-actionItemIcon elyra-item-edit"
                              />
                            </div>
                            <div
                              class="elyra-actionItem"
                            >
                              <div
                                class="elyra-icon elyra-actionItemIcon elyra-item-delete"
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          class="elyra-stringArrayControl-listRow"
                        >
                          <div
                            class="elyra-stringArrayControl-listItem"
                          >
                            file2.zip
                          </div>
                          <div
                            class="elyra-stringArrayControl-listActions"
                          >
                            <div
                              class="elyra-actionItem"
                            >
                              <div
                                class="elyra-icon elyra-actionItemIcon elyra-item-edit"
                              />
                            </div>
                            <div
                              class="elyra-actionItem"
                            >
                              <div
                                class="elyra-icon elyra-actionItemIcon elyra-item-delete"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="elyra-stringArrayControl-buttonGroup"
                        style="display: flex;"
                      >
                        <button>
                          Add 
                          Item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div />
        </div>
      </div>
      <div />
    </aside>
  `);
});
