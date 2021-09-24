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

import {
  EnumButton,
  EnumContainer,
  EnumIcon,
  EnumLabel,
  EnumMenu,
  EnumMenuItem,
} from "./components";
import { createControl, useControlState } from "./control";

interface Props {
  items: string[];
}

function EnumControl({ items }: Props) {
  const [value, setValue] = useControlState<string>();

  const theme = useTheme();

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
    items,
    selectedItem: value ?? items[0],
    onSelectedItemChange: handleSelectedItemChange,
  });

  return (
    <EnumContainer isOpen={isOpen}>
      <EnumButton {...getToggleButtonProps()}>
        <EnumLabel>{selectedItem}</EnumLabel>
        <EnumIcon className="elyricon elyricon-chevron-down">
          {theme.overrides?.chevronDownIcon}
        </EnumIcon>
      </EnumButton>
      <EnumMenu {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <EnumMenuItem
              key={`${item}${index}`}
              {...getItemProps({ item, index })}
            >
              <EnumLabel>{item}</EnumLabel>
            </EnumMenuItem>
          ))}
      </EnumMenu>
    </EnumContainer>
  );
}

export default createControl("EnumControl", EnumControl);
