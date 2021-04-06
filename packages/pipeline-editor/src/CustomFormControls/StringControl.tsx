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

import { createControl, useControlState, useHandlers } from "./control";

export interface Props {
  pattern?: string; // for restricting strings to a given regular expression
  patternErrorMessage?: string; // for giving a tailored error message when a pattern does not match
  minLength?: number; // for restricting string length
  maxLength?: number; // for restricting string length
  format?: "date" | "time" | "ipv4" | "email" | "uri" | "file"; // for restricting strings to well-known formats
  required?: boolean;
  placeholder?: string;
}

const Container = styled.div`
  margin-top: 9px;
  display: flex;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
`;

const ErrorMessage = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  padding: 5px;
  box-sizing: border-box;
  margin-top: -1px;
  z-index: 1;
  border-style: solid;
  border-width: 1px;
  border-color: #be1100;
  background-color: #5a1d1d;
`;

function StringControl({
  pattern,
  patternErrorMessage,
  minLength,
  maxLength,
  format,
  required,
  placeholder,
}: Props) {
  const [value, setValue] = useControlState<string>();

  const handleChange = useCallback(
    (e) => {
      setValue(e.target.value);
    },
    [setValue]
  );

  const { actionHandler } = useHandlers();
  const handleChooseFile = useCallback(async () => {
    const values = await actionHandler?.("browse_file", undefined, {
      canSelectMany: false,
      defaultUri: value,
      // TODO: "filters", this should be specified via node definition
    });
    //  Don't set if nothing was chosen.
    if (values !== undefined && values.length > 0) {
      setValue(values[0]);
    }
  }, [actionHandler, value, setValue]);

  const missing =
    required === true && (value === undefined || value.trim() === "");
  const tooShort =
    (value?.trim().length ?? 0) > 0 &&
    minLength !== undefined &&
    (value?.length ?? 0) < minLength;
  const tooLong =
    (value?.trim().length ?? 0) > 0 &&
    maxLength !== undefined &&
    (value?.length ?? 0) > maxLength;
  const patternError =
    (value?.trim().length ?? 0) > 0 &&
    pattern !== undefined &&
    new RegExp(pattern).test(value ?? "") === false;

  const isError = missing || tooShort || tooLong || patternError;

  let message;
  if (tooShort === true) {
    message = "too short";
  }
  if (tooLong === true) {
    message = "too long";
  }
  if (patternError === true) {
    message = patternErrorMessage;
  }

  return (
    <Container className={isError ? "error" : undefined}>
      <InputContainer>
        <input
          type="text"
          value={value ?? ""}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={format === "file"}
        />
        {message !== undefined && <ErrorMessage>{message}</ErrorMessage>}
      </InputContainer>
      {format === "file" && (
        <button
          onClick={() => {
            handleChooseFile();
          }}
        >
          Browse
        </button>
      )}
    </Container>
  );
}

export default createControl(StringControl);
