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

import styled from "styled-components";

import { createControl, useControlState } from "./control";

interface Props {
  type: "number" | "integer";
  multipleOf?: number;
  minimum?: number; // for restricting numeric values
  maximum?: number; // for restricting numeric values
  exclusiveMinimum?: boolean | number;
  exclusiveMaximum?: boolean | number;
  required?: boolean;
}

const Container = styled.div`
  margin-top: 9px;
  width: 100%;
  max-width: 200px;
  display: flex;
`;

const Input = styled.input`
  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
  &[type="number"] {
    -moz-appearance: textfield !important;
  }
`;

function NumberControl({}: Props) {
  const [value, setValue] = useControlState<number>();

  const handleChange = useCallback(
    (e) => {
      setValue(e.target.value);
    },
    [setValue]
  );

  const isError = value === undefined;

  return (
    <Container className={isError ? "error" : undefined}>
      <Input type="number" value={value ?? ""} onChange={handleChange} />
    </Container>
  );
}

export default createControl(NumberControl);
