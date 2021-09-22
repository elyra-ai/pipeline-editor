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

import { useCallback } from "react";

import { useSelect } from "downshift";
import styled, { useTheme } from "styled-components";

import { createControl, useControlState } from "./control";

interface Data {
  value: string;
  label: string;
  options?: {
    value: string;
    label: string;
  }[];
}

interface Props {
  data: Data[];
}

const Button = styled.button.attrs({ type: "button" })`
  /* higher specificity to override button styles */
  && {
    background-color: ${({ theme }) => theme.palette.secondary.main};
    color: ${({ theme }) => theme.palette.secondary.contrastText};
    border: 1px solid ${({ theme }) => theme.palette.inputBorder};
    display: flex;
    width: 100%;
    height: 26px;
    align-items: center;
    justify-content: space-between;
    padding: 2px 8px;
  }

  &&:hover {
    background-color: ${({ theme }) => theme.palette.secondary.main};
  }

  &&:focus {
    outline: 1px solid ${({ theme }) => theme.palette.focus};
    outline-offset: -1px;
  }
`;

const Label = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Menu = styled.ul`
  z-index: 10;
  position: absolute;
  top: 26px;
  left: 0;
  right: 0;
  color: ${({ theme }) => theme.palette.secondary.contrastText};
  background-color: ${({ theme }) => theme.palette.secondary.main};
  padding: 2px;
  padding-bottom: 4px;
  margin: 0;
  list-style-type: none;
`;

const MenuItem = styled.li`
  cursor: pointer;
  height: 18px;
  line-height: 18px;
  padding-left: 3.5px;
  color: ${({ theme }) => theme.palette.text.primary};

  &:hover {
    background-color: ${({ theme }) => theme.palette.hover};
  }
`;

const Container = styled.div<{ isOpen: boolean }>`
  position: relative;
  margin-top: 9px;
  width: 100%;
  max-width: 320px;

  & ${Button}, & ${Menu} {
    outline: 1px solid
      ${({ theme, isOpen }) => (isOpen ? theme.palette.focus : "transparent")};
    outline-offset: -1px;
  }

  & ${Menu} {
    display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  }
`;

function flatten(data: Data[]): any[] {
  let flattenedData: any[] = [];
  data.forEach((item: Data) => {
    item.options?.forEach((option: Data) => {
      flattenedData.push({
        node_id: item.value,
        output_key: option.value,
        label: item.label + ": " + option.label,
      });
    });
  });
  return flattenedData;
}

function NestedEnumControl({ data = [] }: Props) {
  const [value, setValue] = useControlState<any>();

  const theme = useTheme();

  const flattenedData = flatten(data);

  const handleSelectedItemChange = useCallback(
    ({ selectedItem }) => {
      setValue(selectedItem);
    },
    [setValue]
  );

  const {
    selectedItem,
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  } = useSelect({
    items: flattenedData,
    selectedItem: value,
    onSelectedItemChange: handleSelectedItemChange,
  });

  return (
    <Container isOpen={isOpen}>
      <Button {...getToggleButtonProps()}>
        <Label>{selectedItem.label}</Label>
        <Icon className="elyricon elyricon-chevron-down">
          {theme.overrides?.chevronDownIcon}
        </Icon>
      </Button>
      <Menu {...getMenuProps()}>
        {isOpen &&
          flattenedData.map((item: any, index: number) => (
            <MenuItem
              key={`${item.node_id}${index}`}
              {...getItemProps({ item, index })}
            >
              <Label>{item.label}</Label>
            </MenuItem>
          ))}
      </Menu>
    </Container>
  );
}

export default createControl("NestedEnumControl", NestedEnumControl);
