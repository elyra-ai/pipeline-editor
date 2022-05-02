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

import { useCallback, useState } from "react";

import {
  getErrorMessages,
  getStringValidators,
  StringValidatorOptions,
} from "@elyra/pipeline-services";
import styled from "styled-components";

import {
  createControl,
  useControlState,
  useHandlers,
  usePropertyID,
} from "./control";
import { ErrorMessage } from "./ErrorMessage";

export interface Props extends StringValidatorOptions {
  placeholder?: string;
  extensions?: string[];
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

function serialize(value: string) {
  if (value.trim() === "") {
    return undefined;
  }
  return value;
}

// TODO: Make the file clearable
export function StringControl({
  pattern,
  patternErrorMessage,
  minLength,
  maxLength,
  format,
  required,
  placeholder,
  extensions,
}: Props) {
  const propertyID = usePropertyID();
  const [value, setValue] = useControlState<string>();

  const [localValue, setLocalValue] = useState<string>();

  const update = useCallback(
    (value) => {
      setLocalValue(value);
      setValue(serialize(value));
    },
    [setValue]
  );

  const handleChange = useCallback(
    (e) => {
      update(e.target.value);
    },
    [update]
  );

  const handleBlur = useCallback(() => {
    setLocalValue(undefined);
  }, []);

  const { actionHandler } = useHandlers();
  const handleChooseFile = useCallback(async () => {
    const values = await actionHandler?.("browse_file", undefined, {
      canSelectMany: false,
      defaultUri: value,
      filters: { File: extensions },
      propertyID,
    });
    //  Don't set if nothing was chosen.
    if (values !== undefined && values.length > 0) {
      update(values[0]);
    }
  }, [actionHandler, value, extensions, propertyID, update]);

  const validators = getStringValidators({
    pattern,
    patternErrorMessage,
    minLength,
    maxLength,
    format,
    required,
  });

  const renderedValue = localValue ?? value ?? "";

  const trimmedValue = renderedValue.trim();

  let errorMessages = getErrorMessages(trimmedValue, validators);
  if (!required && trimmedValue === "") {
    errorMessages = [];
  }

  return (
    <Container className={errorMessages.length > 0 ? "error" : undefined}>
      <InputContainer>
        {format === "multiline" ? (
          <textarea
            value={renderedValue}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ) : (
          <input
            type="text"
            value={renderedValue}
            placeholder={placeholder}
            onChange={handleChange}
            disabled={format === "file"}
            onBlur={handleBlur}
          />
        )}
        {errorMessages[0] !== undefined && (
          <ErrorMessage>{errorMessages[0]}</ErrorMessage>
        )}
      </InputContainer>
      {format === "file" && <button onClick={handleChooseFile}>Browse</button>}
    </Container>
  );
}

export default createControl("StringControl", StringControl);
