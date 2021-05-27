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

import { Validator } from ".";

export interface StringValidatorOptions {
  required?: boolean;
  pattern?: string; // for restricting strings to a given regular expression
  patternErrorMessage?: string; // for giving a tailored error message when a pattern does not match
  minLength?: number; // for restricting string length
  maxLength?: number; // for restricting string length
  format?: "file"; // for restricting strings to well-known formats. Potential future formats: "date" | "time" | "ipv4" | "email" | "uri"
  textarea?: boolean; // Whether to use a text area
}

export function getStringValidators<T extends string>({
  required,
  pattern,
  patternErrorMessage,
  maxLength,
  minLength,
  format,
}: StringValidatorOptions) {
  const validators: Validator<T>[] = [
    {
      enabled: required === true,
      isValid: (value: T) => value !== "",
    },
    {
      enabled: maxLength !== undefined,
      isValid: (value: T) => value.length <= maxLength!,
      message: `Value must be ${maxLength} or fewer characters long.`,
    },
    {
      enabled: minLength !== undefined,
      isValid: (value: T) => value.length >= minLength!,
      message: `Value must be ${minLength} or more characters long.`,
    },
    {
      enabled: pattern !== undefined,
      isValid: (value: T) => new RegExp(pattern!).test(value),
      message: patternErrorMessage ?? `Value must match regex \`${pattern}\`.`,
    },
    // We don't have any format validation yet, but when we do they will go here
    {
      enabled: format === "file",
      isValid: () => true,
    },
  ];

  return validators;
}
