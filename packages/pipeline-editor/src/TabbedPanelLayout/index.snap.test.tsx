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

import TabbedPanelLayout from "./";

it("renders", () => {
  const { container } = render(
    <TabbedPanelLayout
      currentTab="one"
      tabs={[
        {
          id: "one",
          label: "Tab one",
          content: <div>Tab one content</div>,
        },
        {
          id: "two",
          label: "Tab two",
          content: <div>Tab two content</div>,
        },
      ]}
    />
  );
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="elyra-tabPanel"
    >
      <div
        class="elyra-actionBar"
      >
        <div
          class="elyra-tabGroup"
        >
          <div
            class="elyra-tab"
          >
            <div
              class="elyra-tabText activeTab"
            >
              Tab one
            </div>
          </div>
          <div
            class="elyra-tab"
          >
            <div
              class="elyra-tabText"
            >
              Tab two
            </div>
          </div>
        </div>
      </div>
      <div
        class="elyra-tabContent"
        style="position: absolute; top: 35px; bottom: 0px; overflow: auto; width: 100%;"
      >
        <div>
          Tab one content
        </div>
      </div>
    </div>
  `);
});

it("renders collapsed", () => {
  const { container } = render(
    <TabbedPanelLayout
      currentTab="one"
      tabs={[
        {
          id: "one",
          label: "Tab one",
          content: <div>Tab one content</div>,
        },
        {
          id: "two",
          label: "Tab two",
          content: <div>Tab two content</div>,
        },
      ]}
      collapsed
    />
  );
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      class="elyra-verticalTabGroup"
    >
      <div
        class="elyra-tabItem"
      >
        <div
          class="elyra-icon elyra-tabItemIcon one"
          title="Tab one"
        />
      </div>
      <div
        class="elyra-tabItem"
      >
        <div
          class="elyra-icon elyra-tabItemIcon two"
          title="Tab two"
        />
      </div>
    </div>
  `);
});
