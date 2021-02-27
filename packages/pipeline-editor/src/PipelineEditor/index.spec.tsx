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

it("renders with undefined pipeline", () => {
  const { container } = render(<PipelineEditor pipeline={undefined} />);
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      style="height: 100%;"
    >
      <div
        style="position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;"
      >
        <div
          class="common-canvas"
        >
          <div
            class="common-canvas-right-side-items"
          >
            <div
              class="common-canvas-items-container"
              id="common-canvas-items-container-0"
            >
              <main
                aria-label="Canvas"
                role="main"
              >
                <div
                  class="common-canvas-drop-div common-canvas-toolbar-none"
                  id="canvas-div-0"
                >
                  <div
                    class="empty-canvas"
                  >
                    <div
                      class="empty-canvas-image"
                    >
                      <svg
                        aria-hidden="true"
                        fill="currentColor"
                        focusable="false"
                        height="16"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 32 32"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20,23H11.86a4.17,4.17,0,0,0-.43-1L22,11.43A3.86,3.86,0,0,0,24,12a4,4,0,1,0-3.86-5H11.86a4,4,0,1,0,0,2h8.28a4.17,4.17,0,0,0,.43,1L10,20.57A3.86,3.86,0,0,0,8,20a4,4,0,1,0,3.86,5H20v3h8V20H20ZM8,10a2,2,0,1,1,2-2A2,2,0,0,1,8,10ZM24,6a2,2,0,1,1-2,2A2,2,0,0,1,24,6ZM8,26a2,2,0,1,1,2-2A2,2,0,0,1,8,26Zm14-4h4v4H22Z"
                        />
                      </svg>
                    </div>
                    <span
                      class="empty-canvas-text1"
                    >
                      Your flow is empty.
                    </span>
                    <span
                      class="empty-canvas-text2"
                    >
                      Get started by adding a node.
                    </span>
                  </div>
                  <div
                    class="d3-svg-canvas-div"
                    id="d3-svg-canvas-div-0"
                    tabindex="-1"
                  >
                    <svg
                      class="svg-area"
                      height="100%"
                      style="display: inherit;"
                      width="100%"
                      x="0"
                      y="0"
                    >
                      <rect
                        class="d3-svg-background"
                        data-pipeline-id="00000000-0000-4000-8000-000000000000"
                        height="100%"
                        pointer-events="all"
                        style="cursor: default;"
                        width="100%"
                        x="0"
                        y="0"
                      />
                      <defs>
                        <filter
                          height="200%"
                          id="node_drop_shadow_0"
                          width="200%"
                          x="-20%"
                          y="-20%"
                        >
                          <feoffset
                            dx="1"
                            dy="1"
                            in="SourceAlpha"
                            result="offOut"
                          />
                          <fegaussianblur
                            in="offOut"
                            result="blurOut"
                            stdDeviation="3"
                          />
                          <feblend
                            in="SourceGraphic"
                            in2="blurOut"
                            mode="normal"
                          />
                          <fecomponenttransfer>
                            <fefunca
                              slope="0.2"
                              type="linear"
                            />
                          </fecomponenttransfer>
                          <femerge>
                            <femergenode />
                            <femergenode
                              in="SourceGraphic"
                            />
                          </femerge>
                        </filter>
                      </defs>
                      <g
                        class="d3-canvas-group"
                      >
                        <g
                          class="d3-comments-group"
                        />
                        <g
                          class="d3-nodes-links-group"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </main>
              <div
                class="notification-panel-container panel-hidden"
              >
                <div
                  class="notification-panel"
                >
                  <div
                    class="notification-panel-header-container"
                  >
                    <div
                      class="notification-panel-header"
                    >
                      Notifications
                      <svg
                        aria-hidden="true"
                        class="notification-panel-close-icon"
                        fill="currentColor"
                        focusable="false"
                        height="16"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 32 32"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div
                    class="notification-panel-messages-container"
                  >
                    <div
                      class="notification-panel-messages"
                    >
                      <div
                        class="notification-panel-empty-message-container"
                      >
                        <div
                          class="notification-panel-empty-message"
                        />
                      </div>
                    </div>
                  </div>
                  <svg
                    class="notification-popup-arrow"
                    viewBox="0 0 16 9"
                    x="0px"
                    y="0px"
                  >
                    <polyline
                      points="0,9 8,0 16,9"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div
              class="right-flyout-panel"
            />
          </div>
        </div>
      </div>
      <div>
        <div
          style="position: absolute; top: 0px; bottom: 0px; width: 32px; right: 0px;"
        >
          <div
            class="elyra-verticalTabGroup"
          >
            <div
              class="elyra-tabItem"
            >
              <div
                class="elyra-icon elyra-tabItemIcon properties"
                title="Node Properties"
              />
            </div>
            <div
              class="elyra-tabItem"
            >
              <div
                class="elyra-icon elyra-tabItemIcon palette"
                title="Palette"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
});

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
