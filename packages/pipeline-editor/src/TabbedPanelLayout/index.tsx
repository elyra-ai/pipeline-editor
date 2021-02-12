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

import React from "react";

interface Props {
  tabs: Tab[];
  open?: boolean;
  experimental?: boolean;
  currentTab?: string;
  onClose?: () => any;
  onTabClick?: (id: string) => any;
}

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

function TabbedPanelLayout({
  currentTab,
  onTabClick,
  tabs,
  experimental,
  open,
  onClose,
}: Props) {
  if (open !== true) {
    return (
      <div className="elyra-verticalTabGroup">
        {tabs.map((t) => (
          <div key={t.id} className="elyra-tabItem">
            <div
              title={t.label}
              className={`elyra-icon elyra-tabItemIcon ${t.id}`}
              onClick={() => {
                onTabClick?.(t.id);
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  let resolvedCurrentTab = currentTab === undefined ? tabs[0].id : currentTab;

  return (
    <div className="elyra-tabPanel">
      <div className="elyra-actionBar">
        <div className="elyra-tabGroup">
          {tabs.map((t) => (
            <div key={t.id} className="elyra-tab">
              <div
                className={
                  resolvedCurrentTab === t.id
                    ? "elyra-tabText activeTab"
                    : "elyra-tabText"
                }
                onClick={() => {
                  onTabClick?.(t.id);
                }}
              >
                {t.label}
              </div>
            </div>
          ))}
        </div>
        {experimental ? (
          <div className="elyra-actionItem">
            <div
              className="elyra-icon elyra-actionItemIcon elyra-panel-close"
              onClick={() => {
                onClose?.();
              }}
            />
          </div>
        ) : null}
      </div>
      <div
        className="elyra-tabContent"
        style={{
          position: "absolute",
          top: "35px",
          bottom: 0,
          overflow: "auto",
          width: "100%",
        }}
      >
        {tabs.find((t) => t.id === resolvedCurrentTab)?.content}
      </div>
    </div>
  );
}

export default TabbedPanelLayout;
