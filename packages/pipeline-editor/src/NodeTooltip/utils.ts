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

export function toPrettyString(o: any) {
  function toString(o: any) {
    if (typeof o === "boolean") {
      return o ? "Yes" : "No";
    }

    if (o === undefined) {
      return "undefined";
    }

    if (o === null) {
      return "null";
    }

    return o.toString();
  }

  if (Array.isArray(o)) {
    return o.map((v) => toString(v?.value ?? v)).join("\n");
  }

  if (!!o && o.constructor === Object) {
    return Object.entries(o)
      .map(([key, value]) => `${key}: ${toString(value)}`)
      .join("\n");
  }

  return toString(o);
}

export function hasValue(o: any) {
  if (o === undefined || o === null) {
    return false;
  }

  if (Array.isArray(o)) {
    return o.length > 0;
  }

  if (typeof o === "boolean") {
    return true;
  }

  return o !== "";
}
