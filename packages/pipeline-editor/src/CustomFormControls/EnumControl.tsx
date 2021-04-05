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
import styled from "styled-components";

import { createControl, useControlState } from "./control";

interface Props {
  items: string[];
}

const Container = styled.div`
  margin-top: 9px;
  width: 100%;
  max-width: 320px;
  display: flex;
`;

function EnumControl({ items }: Props) {
  const [value, setValue] = useControlState<string>();

  const handleSelectedItemChange = useCallback(
    ({ selectedItem }) => {
      setValue(selectedItem);
    },
    [setValue]
  );

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items,
    selectedItem: value,
    onSelectedItemChange: handleSelectedItemChange,
  });

  return (
    <Container>
      <label {...getLabelProps()}>Choose an element:</label>
      <button type="button" {...getToggleButtonProps()}>
        {value || "Elements"}
      </button>
      <ul {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <li
              style={
                highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}
              }
              key={`${item}${index}`}
              {...getItemProps({ item, index })}
            >
              {item}
            </li>
          ))}
      </ul>
    </Container>
  );
}

export default createControl(EnumControl);
