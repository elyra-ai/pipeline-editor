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

import { createControl, useControlState, useErrorMessage } from "./control";

interface Props {
  placeholder?: string;
}

const Container = styled.div`
  margin-top: 9px;
  width: 100%;
  max-width: 500px;
  display: flex;
`;

function StringControl({ placeholder }: Props) {
  const [value, setValue] = useControlState<string>();

  const isError = useErrorMessage()?.type === "error";

  const handleChange = useCallback(
    (e) => {
      setValue(e.target.value);
    },
    [setValue]
  );

  return (
    <Container className={isError ? "error" : undefined}>
      <input
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </Container>
  );
}

export default createControl(StringControl);
