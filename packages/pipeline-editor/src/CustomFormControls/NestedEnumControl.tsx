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
import { useTheme } from "styled-components";

import { createControl, useControlState } from "./control";
import {
  EnumButton,
  EnumContainer,
  EnumIcon,
  EnumLabel,
  EnumMenu,
  EnumMenuItem,
} from "./utils";

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

function flatten(data: Data[]): any[] {
  let flattenedData: any[] = [];
  data.forEach((item: Data) => {
    item.options?.forEach((option: Data) => {
      flattenedData.push({
        value: item.value,
        option: option.value,
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
    <EnumContainer isOpen={isOpen}>
      <EnumButton {...getToggleButtonProps()}>
        <EnumLabel>{selectedItem.label}</EnumLabel>
        <EnumIcon className="elyricon elyricon-chevron-down">
          {theme.overrides?.chevronDownIcon}
        </EnumIcon>
      </EnumButton>
      <EnumMenu {...getMenuProps()}>
        {isOpen &&
          flattenedData.map((item: any, index: number) => (
            <EnumMenuItem
              key={`${item.node_id}${index}`}
              {...getItemProps({ item, index })}
            >
              <EnumLabel>{item.label}</EnumLabel>
            </EnumMenuItem>
          ))}
      </EnumMenu>
    </EnumContainer>
  );
}

export default createControl("NestedEnumControl", NestedEnumControl);
