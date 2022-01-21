/*
 * Copyright 2018-2022 Elyra Authors
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

import styled, { useTheme } from "styled-components";

import IconButton from "../IconButton";

interface Props {
  tabs: {
    id: string;
    label: string;
    title?: string;
    icon?: React.ReactNode;
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
    background-color: ${({ theme }) => theme.palette.hover};
  }
  ${VerticalTabGroup} &:active {
    background-color: ${({ theme }) => theme.palette.active};
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

const StyledIconButton = styled(IconButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  line-height: 35px;
  min-width: 28px;
  margin-right: 4px;
`;

interface LabelProps {
  active: boolean;
}

const Label = styled.div<LabelProps>`
  line-height: 27px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight};
  font-size: 11px;

  color: ${({ active, theme }) =>
    active ? theme.palette.text.bold : theme.palette.text.inactive};

  border-bottom: 1px solid
    ${({ active, theme }) => (active ? theme.palette.tabBorder : "transparent")};

  &:hover {
    color: ${({ theme }) => theme.palette.text.bold};
  }
`;

const TabIcon = styled.div`
  cursor: pointer;
  user-select: none;
  color: ${({ theme }) => theme.palette.text.icon};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  line-height: 35px;
  min-width: 28px;
  margin-right: 4px;
`;

function TabbedPanelLayout({
  currentTab,
  onTabClick,
  tabs,
  showCloseButton,
  collapsed,
  onClose,
}: Props) {
  const theme = useTheme();

  if (collapsed === true) {
    return (
      <VerticalTabGroup>
        {tabs.map((t) => (
          <Tab key={t.id}>
            <TabIcon
              title={t.label}
              className={`elyricon elyricon-${t.id}`}
              onClick={() => {
                onTabClick?.(t.id);
              }}
            >
              {t.icon}
            </TabIcon>
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
                title={t.title}
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
          <StyledIconButton
            title="Close Panel"
            className="elyricon elyricon-close"
            onClick={() => {
              onClose?.();
            }}
          >
            {theme.overrides?.closeIcon}
          </StyledIconButton>
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
