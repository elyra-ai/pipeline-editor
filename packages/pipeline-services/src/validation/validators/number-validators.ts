/*
 * Copyright 2018-2023 Elyra Authors
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

export interface NumberValidatorOptions {
  type: "number" | "integer";
  multipleOf?: number;
  minimum?: number; // for restricting numeric values
  maximum?: number; // for restricting numeric values
  exclusiveMinimum?: boolean | number;
  exclusiveMaximum?: boolean | number;
  required?: boolean;
}

export function getNumberValidators<T extends string>({
  type,
  multipleOf,
  minimum,
  maximum,
  exclusiveMinimum,
  exclusiveMaximum,
  required,
}: NumberValidatorOptions) {
  // JSON schema allows `exclusive min/max` to be a boolean to indicate min/max
  // are exclusive or a number.
  let exclusiveMax: number | undefined;
  let exclusiveMin: number | undefined;

  if (typeof exclusiveMaximum === "boolean") {
    exclusiveMax = exclusiveMaximum ? maximum : undefined;
  } else {
    exclusiveMax = exclusiveMaximum;
  }

  if (typeof exclusiveMinimum === "boolean") {
    exclusiveMin = exclusiveMinimum ? minimum : undefined;
  } else {
    exclusiveMin = exclusiveMinimum;
  }

  const isNumber = (value: T) => !isNaN(+value) && !isNaN(parseFloat(value));

  const validators: Validator<T>[] = [
    {
      enabled: required === true,
      isValid: (value: T) => value !== "",
    },
    {
      enabled: true,
      isValid: (value: T) => value === "" || isNumber(value),
      message: "Value must be a number.",
    },
    {
      enabled:
        exclusiveMax !== undefined &&
        (maximum === undefined || exclusiveMax <= maximum),
      isValid: (value: T) => +value < exclusiveMax!,
      message: `Value must be strictly less than ${exclusiveMax}.`,
    },
    {
      enabled:
        exclusiveMin !== undefined &&
        (minimum === undefined || exclusiveMin >= minimum),
      isValid: (value: T) => +value > exclusiveMin!,
      message: `Value must be strictly greater than ${exclusiveMin}.`,
    },

    {
      enabled:
        maximum !== undefined &&
        (exclusiveMax === undefined || exclusiveMax > maximum),
      isValid: (value: T) => +value <= maximum!,
      message: `Value must be less than or equal to ${maximum}.`,
    },
    {
      enabled:
        minimum !== undefined &&
        (exclusiveMin === undefined || exclusiveMin < minimum),
      isValid: (value: T) => +value >= minimum!,
      message: `Value must be greater than or equal to ${minimum}.`,
    },
    {
      enabled: multipleOf !== undefined,
      isValid: (value: T) => +value % multipleOf! === 0,
      message: `Value must be a multiple of ${multipleOf}.`,
    },
    {
      enabled: type === "integer",
      // check if the string includes a decimal to prevent something like "10.0"
      isValid: (value: T) => +value % 1 === 0 && !value.includes("."),
      message: "Value must be an integer.",
    },
  ];

  return validators;
}
