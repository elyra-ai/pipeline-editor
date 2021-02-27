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

import { hasValue, toPrettyString } from "./utils";

describe("toPrettyString", () => {
  it("returns the same string for a string", () => {
    const result = toPrettyString("hello world");
    expect(result).toEqual("hello world");
  });

  it("returns a string for a number", () => {
    const result = toPrettyString(42);
    expect(result).toEqual("42");
  });

  it("returns a string for a simple string array", () => {
    const result = toPrettyString(["one", "two", "three"]);
    expect(result).toEqual("one\ntwo\nthree");
  });

  it("returns a string for a values array", () => {
    const result = toPrettyString([
      { value: "one", id: "xxx" },
      { value: "two", id: "xxx" },
      { value: "three", id: "xxx" },
    ]);
    expect(result).toEqual("one\ntwo\nthree");
  });

  it("returns a string for a simple array with numbers", () => {
    const result = toPrettyString([1, 2, 3]);
    expect(result).toEqual("1\n2\n3");
  });

  it("returns a string for a simple array with null holes", () => {
    const result = toPrettyString([null, null, null]);
    expect(result).toEqual("null\nnull\nnull");
  });

  it("returns a string for a simple array with undefined holes", () => {
    const result = toPrettyString([undefined, undefined, undefined]);
    expect(result).toEqual("undefined\nundefined\nundefined");
  });

  it("returns an empty string for an empty array", () => {
    const result = toPrettyString([]);
    expect(result).toEqual("");
  });

  it("returns a string for a sparse array", () => {
    // eslint-disable-next-line no-sparse-arrays
    const result = toPrettyString(["one", , , "two", , "three"]);
    expect(result).toEqual("one\n\n\ntwo\n\nthree");
  });

  it("returns 'Yes' for a true boolean", () => {
    const result = toPrettyString(true);
    expect(result).toEqual("Yes");
  });

  it("returns 'No' for a false boolean", () => {
    const result = toPrettyString(false);
    expect(result).toEqual("No");
  });

  it("returns a string for undefined", () => {
    const result = toPrettyString(undefined);
    expect(result).toEqual("undefined");
  });

  it("returns a string for null", () => {
    const result = toPrettyString(null);
    expect(result).toEqual("null");
  });

  it("returns a string for NaN", () => {
    const result = toPrettyString(NaN);
    expect(result).toEqual("NaN");
  });

  it("returns a string for an object", () => {
    const result = toPrettyString({ one: 1, two: 2, three: 3 });
    expect(result).toEqual("one: 1\ntwo: 2\nthree: 3");
  });

  it("returns a string for an error", () => {
    const result = toPrettyString(new Error("this is an error"));
    expect(result).toEqual("Error: this is an error");
  });
});

describe("hasValue", () => {
  it("returns true for a true value", () => {
    const result = hasValue(true);
    expect(result).toEqual(true);
  });

  it("returns true for a false value", () => {
    const result = hasValue(true);
    expect(result).toEqual(true);
  });

  it("returns true for a string", () => {
    const result = hasValue("hello");
    expect(result).toEqual(true);
  });

  it("returns true for an array", () => {
    const result = hasValue(["one", "two", "three"]);
    expect(result).toEqual(true);
  });

  it("returns true for an object", () => {
    const result = hasValue({ one: 1, two: 2, three: 3 });
    expect(result).toEqual(true);
  });

  it("returns true for a number", () => {
    const result = hasValue(42);
    expect(result).toEqual(true);
  });

  it("returns true for zero", () => {
    const result = hasValue(0);
    expect(result).toEqual(true);
  });

  it("returns true for NaN", () => {
    const result = hasValue(NaN);
    expect(result).toEqual(true);
  });

  it("returns false for an empty string", () => {
    const result = hasValue("");
    expect(result).toEqual(false);
  });

  it("returns false for an empty array", () => {
    const result = hasValue([]);
    expect(result).toEqual(false);
  });

  it("returns false for a null value", () => {
    const result = hasValue(null);
    expect(result).toEqual(false);
  });

  it("returns false for an undefined value", () => {
    const result = hasValue(undefined);
    expect(result).toEqual(false);
  });
});
