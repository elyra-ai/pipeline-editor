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

import { createControl, useControlState, BaseProps } from "./utils";

interface Props extends BaseProps {
  items: string[];
}

function EnumComponent({ name, controller, items }: Props) {
  const [value, setValue] = useControlState<string>(name, controller);

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
    <div>
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
    </div>
  );
}

export default createControl("pipeline-editor-enum-control", EnumComponent);
