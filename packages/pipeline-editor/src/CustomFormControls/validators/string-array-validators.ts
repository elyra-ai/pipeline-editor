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

export interface StringArrayValidatorOptions {
  uniqueItems?: boolean;
  minItems?: number; // for restricting array length
  maxItems?: number; // for restricting array length
}

export function getStringArrayValidators<T extends string[]>({
  uniqueItems,
  minItems,
  maxItems,
}: StringArrayValidatorOptions) {
  const validators: Validator<T>[] = [
    {
      enabled: uniqueItems === true,
      isValid: (value: T) => new Set(value).size === value.length,
      message: "Array has duplicate items.",
    },
    {
      enabled: minItems !== undefined,
      isValid: (value: T) => value.length < minItems!,
      message: `Array must have at least ${minItems} items.`,
    },
    {
      enabled: maxItems !== undefined,
      isValid: (value: T) => value.length < maxItems!,
      message: `Array must have at most ${maxItems} items.`,
    },
  ];

  return validators;
}
