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

import { BooleanControl } from "./BooleanControl";
import {
  EnumButton,
  EnumContainer,
  EnumIcon,
  EnumLabel,
  EnumMenu,
  EnumMenuItem,
} from "./components";
import { createControl, useControlState } from "./control";
import { DisplayControl } from "./DisplayControl";
import { EnumControl } from "./EnumControl";
import { NestedEnumControl } from "./NestedEnumControl";
import { NumberControl } from "./NumberControl";
import { StringArrayControl } from "./StringArrayControl";
import { StringControl } from "./StringControl";

interface Props {
  controls: {
    [key: string]: {
      [key: string]: any;
    };
  };
  required?: boolean;
}

export const ActiveControl = styled.div`
  margin-top: 9px;
`;

function getControl(name: string, data: any) {
  const controls: Record<string, any> = {
    StringControl,
    DisplayControl,
    StringArrayControl,
    BooleanControl,
    EnumControl,
    NestedEnumControl,
    NumberControl,
  };

  const Control = controls[name];

  if (Control) {
    return <Control {...data} />;
  }
  return null;
}

function OneOfControl({ controls, required }: Props) {
  const controlsKeys = Object.keys(controls);

  const controlState = useControlState<string>(controlsKeys[0]);
  const activeControl = controlState[2];
  const setActiveControl = controlState[3];

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
    items: controlsKeys,
    selectedItem: activeControl || controlsKeys[0],
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
            controlsKeys.map((item, index) => (
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
      <ActiveControl>
        {selectedItem
          ? getControl(selectedItem, { ...controls[selectedItem], required })
          : null}
      </ActiveControl>
    </div>
  );
}

export default createControl("OneOfControl", OneOfControl);
