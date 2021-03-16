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

import styled from "styled-components";

interface Props {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  collapsed?: boolean;
  showCloseButton?: boolean;
  currentTab?: string;
  onClose?: () => any;
  onTabClick?: (id: string) => any;
}

const VerticalTabGroup = styled.div`
  padding: 7px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HorizontalTabGroup = styled.div`
  display: flex;
`;

const Tab = styled.div`
  ${VerticalTabGroup} & {
    margin: 3px 0;
  }
  ${VerticalTabGroup} &:hover {
    /* TODO: styles */
    background-color: var(--vscode-statusBarItem-hoverBackground);
  }
  ${VerticalTabGroup} &:active {
    /* TODO: styles */
    background-color: rgba(255, 255, 255, 0.18);
  }
  ${HorizontalTabGroup} & {
    cursor: pointer;
    user-select: none;
    text-transform: uppercase;
    padding: 4px 10px 3px;
  }
`;

const ActionBar = styled.div`
  padding: 0 8px;
  display: flex;
  justify-content: space-between;
`;

const Content = styled.div`
  position: absolute;
  top: 35px;
  bottom: 0;
  overflow: auto;
  width: 100%;
`;

interface LabelProps {
  active: boolean;
}

const Label = styled.div<LabelProps>`
  /* TODO: styles */
  line-height: 27px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight};
  font-size: 11px;

  color: ${({ active }) =>
    active
      ? "var(--vscode-panelTitle-activeForeground)"
      : "var(--vscode-panelTitle-inactiveForeground)"};

  border-bottom: 1px solid
    ${({ active }) =>
      active ? "var(--vscode-panelTitle-activeBorder)" : "transparent"};

  &:hover {
    color: var(--vscode-panelTitle-activeForeground);
  }
`;

function TabbedPanelLayout({
  currentTab,
  onTabClick,
  tabs,
  showCloseButton,
  collapsed,
  onClose,
}: Props) {
  if (collapsed === true) {
    return (
      <VerticalTabGroup>
        {tabs.map((t) => (
          <Tab key={t.id}>
            <div
              title={t.label}
              // TODO: styles
              className={`elyra-icon elyra-tabItemIcon ${t.id}`}
              onClick={() => {
                onTabClick?.(t.id);
              }}
            />
          </Tab>
        ))}
      </VerticalTabGroup>
    );
  }

  const resolvedCurrentTab = currentTab === undefined ? tabs[0].id : currentTab;

  return (
    <React.Fragment>
      <ActionBar>
        <HorizontalTabGroup>
          {tabs.map((t) => (
            <Tab key={t.id}>
              <Label
                active={resolvedCurrentTab === t.id}
                onClick={() => {
                  onTabClick?.(t.id);
                }}
              >
                {t.label}
              </Label>
            </Tab>
          ))}
        </HorizontalTabGroup>
        {showCloseButton === true && (
          <div className="elyra-actionItem">
            <div
              title="Close Panel"
              className="elyra-icon elyra-actionItemIcon elyra-panel-close"
              onClick={() => {
                onClose?.();
              }}
            />
          </div>
        )}
      </ActionBar>
      <Content>
        {tabs.find((t) => t.id === resolvedCurrentTab)?.content ??
          "Invalid tab id."}
      </Content>
    </React.Fragment>
  );
}

export default TabbedPanelLayout;
