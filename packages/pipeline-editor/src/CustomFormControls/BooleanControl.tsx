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

import styled, { useTheme } from "styled-components";

import { createControl, useControlState } from "./control";

interface Props {
  description: string;
}

const Container = styled.div`
  display: flex;
`;

const Checkbox = styled.div<{ isChecked: boolean }>`
  box-sizing: border-box;
  flex-shrink: 0;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  font-size: 16px;
  height: 18px;
  width: 18px;
  border: 1px solid ${({ theme }) => theme.palette.inputBorder};
  border-radius: 3px;
  margin-right: 9px;
  margin-left: 0;
  padding: 0;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  color: ${({ theme }) => theme.palette.secondary.contrastText};
  border-radius: ${({ theme }) => theme.shape.borderRadius};

  &:hover {
    border: 1px solid ${({ theme }) => theme.palette.highlight.hover};
    border-radius: ${({ theme }) => theme.shape.borderRadius};
  }

  &:focus {
    border: 1px solid ${({ theme }) => theme.palette.focus};
    border-radius: ${({ theme }) => theme.shape.borderRadius};
  }

  &::before,
  & > * {
    opacity: ${({ isChecked }) => (isChecked ? 1 : 0)};
  }
`;

export function BooleanControl({ description }: Props) {
  const theme = useTheme();

  const [isChecked = false, setIsChecked] = useControlState<boolean>();

  const handleToggle = useCallback(() => {
    setIsChecked(!isChecked);
  }, [isChecked, setIsChecked]);

  return (
    <Container onClick={handleToggle}>
      <Checkbox
        isChecked={isChecked}
        className="elyricon elyricon-check"
        tabIndex={0}
        role="checkbox"
        aria-checked={isChecked ? "true" : "false"}
        aria-label=""
      >
        {theme.overrides?.checkIcon}
      </Checkbox>
      <div className="properties-control-description">{description}</div>
    </Container>
  );
}

export default createControl("BooleanControl", BooleanControl);
