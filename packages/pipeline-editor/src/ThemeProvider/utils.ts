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

import { DeepPartial } from "redux";

function isPlainObject(item: any) {
  return item && typeof item === "object" && item.constructor === Object;
}

export function deepmerge<T>(target: T, source: DeepPartial<T>) {
  const output = { ...target };

  if (isPlainObject(target) && isPlainObject(source)) {
    for (let _key of Object.keys(source)) {
      const key = _key as keyof DeepPartial<T>;

      const tVal = target[key];
      const sVal = source[key] as DeepPartial<typeof tVal>;

      if (sVal !== undefined) {
        if (isPlainObject(sVal) && tVal !== undefined) {
          output[key] = deepmerge<typeof tVal>(tVal, sVal);
        } else {
          output[key] = sVal as T[keyof T];
        }
      }
    }
  }

  return output;
}
