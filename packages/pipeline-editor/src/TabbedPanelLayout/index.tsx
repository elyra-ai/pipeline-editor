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
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {tabs.map((t) => (
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "1px solid red",
              marginBottom: "8px",
            }}
            onClick={() => {
              onTabClick?.(t.id);
            }}
          >
            {/* TODO: some kind of icon */}
          </div>
        ))}
      </div>
    );
  }

  let resolvedCurrentTab = currentTab === undefined ? tabs[0].id : currentTab;

  return (
    <React.Fragment>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          {tabs.map((t) => (
            <div
              onClick={() => {
                onTabClick?.(t.id);
              }}
            >
              {t.label}
            </div>
          ))}
        </div>
        {experimental ? (
          <div>
            <div
              onClick={() => {
                onClose?.();
              }}
            >
              X
            </div>
          </div>
        ) : null}
      </div>
      <div
        style={{
          position: "absolute",
          top: "35px",
          bottom: 0,
          overflow: "scroll",
          width: "100%",
        }}
      >
        {tabs.find((t) => t.id === resolvedCurrentTab)?.content}
      </div>
    </React.Fragment>
  );
}

export default TabbedPanelLayout;
