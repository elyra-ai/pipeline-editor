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

import { nodeSpec, selectedNode } from "../test-utils";
import PropertiesPanel from "./";

it("renders with one node selected", () => {
  const { container } = render(
    <IntlProvider locale="en">
      <PropertiesPanel nodes={[nodeSpec]} selectedNodes={[selectedNode]} />
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
                          data-testid="list-row"
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
                                title="edit"
                              />
                            </div>
                            <div
                              class="elyra-actionItem"
                            >
                              <div
                                class="elyra-icon elyra-actionItemIcon elyra-item-delete"
                                title="delete"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="elyra-stringArrayControl-buttonGroup"
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
                          data-testid="list-row"
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
                                title="edit"
                              />
                            </div>
                            <div
                              class="elyra-actionItem"
                            >
                              <div
                                class="elyra-icon elyra-actionItemIcon elyra-item-delete"
                                title="delete"
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          class="elyra-stringArrayControl-listRow"
                          data-testid="list-row"
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
                                title="edit"
                              />
                            </div>
                            <div
                              class="elyra-actionItem"
                            >
                              <div
                                class="elyra-icon elyra-actionItemIcon elyra-item-delete"
                                title="delete"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="elyra-stringArrayControl-buttonGroup"
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
