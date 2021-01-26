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

import React, { useState } from "react";

interface Props {
  tabs: Tab[];
  togglePanelOpen: () => void;
}

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

function TabbedPanelLayout({ tabs, togglePanelOpen }: Props) {
  const [currentTab, setCurrentTab] = useState(tabs[0].id);

  return (
    <React.Fragment>
      <div>
        <div className="elyra-pipeline-tabBar">
          {tabs.map((t) => (
            <div
              className={
                "elyra-pipeline-tab" +
                (currentTab === t.id ? " elyra-pipeline-tab-active" : "")
              }
              onClick={() => {
                setCurrentTab(t.id);
              }}
            >
              {t.label}
            </div>
          ))}
        </div>
        <div className="elyra-pipeline-closePanel" onClick={togglePanelOpen}>
          X
        </div>
      </div>
      <div className="elyra-tabContent">
        {tabs.find((t) => t.id === currentTab)?.content}
      </div>
    </React.Fragment>
  );
}

export default TabbedPanelLayout;
