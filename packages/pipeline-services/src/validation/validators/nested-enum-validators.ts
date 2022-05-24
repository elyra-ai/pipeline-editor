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

import { Validator } from ".";
import {
  NestedEnumData as Data,
  NestedEnumFlatData as FlatData,
} from "../types";

export interface NestedEnumValidatorOptions {
  data: Data[];
  allownooptions?: boolean;
  required?: boolean;
}

export function getNestedEnumValidators<T extends FlatData | undefined>({
  data,
  allownooptions,
  required,
}: NestedEnumValidatorOptions) {
  const validators: Validator<T>[] = [
    {
      enabled: required === true,
      isValid: (value: T) => value !== undefined,
    },
    {
      enabled: data !== undefined,
      isValid: (value: T) => {
        const selected = data.find((item: Data) => item.value === value?.value);
        const option = selected?.options?.find(
          (item: Data) => item.value === value?.option
        );
        return !!selected && (allownooptions || !!option);
      },
      message: `Value must be a valid option`,
    },
  ];

  return validators;
}
