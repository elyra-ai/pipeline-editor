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

import { useCallback } from "react";

import { useSelect } from "downshift";
import styled, { useTheme } from "styled-components";

import {
  EnumButton,
  EnumContainer,
  EnumIcon,
  EnumLabel,
  EnumMenu,
  EnumMenuItem,
} from "./components";
import { createControl, useControlState } from "./control";
import {
  getErrorMessages,
  getEnumValidators,
  EnumValidatorOptions,
  ErrorMessage,
} from "./validators";

const PLACEHOLDER = "Select a value...";

const Container = styled.div`
  margin-top: 9px;
  display: flex;
`;

interface Props extends EnumValidatorOptions {
  items: string[];
  placeholder?: string;
  labels?: { [key: string]: string };
}

function getLabel(
  item: string | undefined,
  placeholder: string,
  labels?: { [key: string]: string }
): string {
  if (!item) {
    return placeholder;
  }
  return labels?.[item] ?? item;
}

export function EnumControl({
  items,
  placeholder = PLACEHOLDER,
  labels,
  required,
  global,
}: Props) {
  const [value, setValue] = useControlState<string>();

  const theme = useTheme();

  const handleSelectedItemChange = useCallback(
    ({ selectedItem }) => {
      if (selectedItem === placeholder) {
        setValue(undefined);
      } else {
        setValue(selectedItem);
      }
    },
    [placeholder, setValue]
  );

  const validators = getEnumValidators({ required, global });

  let errorMessages = getErrorMessages(value, validators);

  const selectItems = [placeholder, ...items];

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  } = useSelect({
    items: selectItems,
    selectedItem: value ?? placeholder,
    onSelectedItemChange: handleSelectedItemChange,
  });

  return (
    <Container className={errorMessages.length > 0 ? "error" : undefined}>
      <EnumContainer isOpen={isOpen}>
        <EnumButton {...getToggleButtonProps()}>
          <EnumLabel>{getLabel(value, placeholder, labels)}</EnumLabel>
          <EnumIcon className="elyricon elyricon-chevron-down">
            {theme.overrides?.chevronDownIcon}
          </EnumIcon>
        </EnumButton>
        <EnumMenu {...getMenuProps()}>
          {isOpen &&
            selectItems.map((item, index) => {
              const label = getLabel(item, placeholder, labels);
              return (
                <EnumMenuItem
                  key={`${item}${index}`}
                  {...getItemProps({ item, index })}
                >
                  <EnumLabel title={label}>{label}</EnumLabel>
                </EnumMenuItem>
              );
            })}
        </EnumMenu>
        {errorMessages[0] !== undefined && (
          <ErrorMessage>{errorMessages[0]}</ErrorMessage>
        )}
      </EnumContainer>
    </Container>
  );
}

export default createControl("EnumControl", EnumControl);
