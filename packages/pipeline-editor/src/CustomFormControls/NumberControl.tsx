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

import { useCallback, useState } from "react";

import styled from "styled-components";

import { createControl, useControlState } from "./control";
import {
  getErrorMessages,
  getNumberValidators,
  NumberValidatorOptions,
  ErrorMessage,
} from "./validators";

interface Props extends NumberValidatorOptions {}

const Container = styled.div`
  margin-top: 9px;
  display: flex;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 200px;
`;

function serialize(value: string) {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    return undefined;
  }
  return parsed;
}

function deserialize(value: number | undefined) {
  return value?.toString();
}

export function NumberControlRaw({
  type,
  multipleOf,
  minimum,
  maximum,
  exclusiveMinimum,
  exclusiveMaximum,
  required,
}: Props) {
  const [value, setValue] = useControlState<number>();

  const [localValue, setLocalValue] = useState<string>();

  const handleChange = useCallback(
    (e) => {
      setLocalValue(e.target.value);
      setValue(serialize(e.target.value));
    },
    [setValue]
  );

  const handleBlur = useCallback(() => {
    setLocalValue(undefined);
  }, []);

  const validators = getNumberValidators({
    type,
    multipleOf,
    minimum,
    maximum,
    exclusiveMinimum,
    exclusiveMaximum,
    required,
  });

  const renderedValue = localValue ?? deserialize(value) ?? "";

  const trimmedValue = renderedValue.trim();

  let errorMessages = getErrorMessages(trimmedValue, validators);
  if (!required && trimmedValue === "") {
    errorMessages = [];
  }

  return (
    <Container className={errorMessages.length > 0 ? "error" : undefined}>
      <InputContainer>
        <input
          // Don't use type="number" see: https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/
          type="text"
          inputMode="numeric"
          value={renderedValue}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errorMessages[0] !== undefined && (
          <ErrorMessage>{errorMessages[0]}</ErrorMessage>
        )}
      </InputContainer>
    </Container>
  );
}

export default createControl("NumberControl", NumberControlRaw);
