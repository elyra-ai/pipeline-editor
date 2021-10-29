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

import { BooleanControlRaw } from "./BooleanControl";
import {
  EnumButton,
  EnumContainer,
  EnumIcon,
  EnumLabel,
  EnumMenu,
  EnumMenuItem,
} from "./components";
import { createControl, useControlState } from "./control";
import { DisplayControlRaw } from "./DisplayControl";
import { EnumControlRaw } from "./EnumControl";
import { NestedEnumControlRaw } from "./NestedEnumControl";
import { NumberControlRaw } from "./NumberControl";
import { StringArrayControlRaw } from "./StringArrayControl";
import { StringControlRaw } from "./StringControl";

interface Props {
  controls: {
    [k: string]: {
      [j: string]: any;
    };
  };
  required?: boolean;
}

function getControl(name: string, data: any) {
  switch (name) {
    case "StringControl":
      return <StringControlRaw {...data} />;
    case "DisplayControl":
      return <DisplayControlRaw {...data} />;
    case "StringArrayControl":
      return <StringArrayControlRaw {...data} />;
    case "BooleanControl":
      return <BooleanControlRaw {...data} />;
    case "EnumControl":
      return <EnumControlRaw {...data} />;
    case "NestedEnumControl":
      return <NestedEnumControlRaw {...data} />;
    case "NumberControl":
      return <NumberControlRaw {...data} />;
    default:
      return null;
  }
}

function OneOfControlRaw({ controls, required }: Props) {
  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    value,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setValue,
    activeControl,
    setActiveControl,
  ] = useControlState<string>(Object.keys(controls)[0]);

  const theme = useTheme();

  const handleSelectedItemChange = useCallback(
    ({ selectedItem }) => {
      setActiveControl(selectedItem);
    },
    [setActiveControl]
  );

  const {
    selectedItem,
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  } = useSelect({
    items: Object.keys(controls),
    selectedItem: activeControl || Object.keys(controls)[0],
    onSelectedItemChange: handleSelectedItemChange,
  });

  return (
    <div>
      <EnumContainer isOpen={isOpen}>
        <EnumButton {...getToggleButtonProps()}>
          <EnumLabel>{selectedItem}</EnumLabel>
          <EnumIcon className="elyricon elyricon-chevron-down">
            {theme.overrides?.chevronDownIcon}
          </EnumIcon>
        </EnumButton>
        <EnumMenu {...getMenuProps()}>
          {isOpen &&
            Object.keys(controls).map((item, index) => (
              <EnumMenuItem
                key={`${item}${index}`}
                {...getItemProps({ item, index })}
              >
                <EnumLabel title={controls[item].label ?? item}>
                  {controls[item].label ?? item}
                </EnumLabel>
              </EnumMenuItem>
            ))}
        </EnumMenu>
      </EnumContainer>
      {selectedItem
        ? getControl(selectedItem, { ...controls[selectedItem], required })
        : null}
    </div>
  );
}

export default createControl("OneOfControl", OneOfControlRaw);
