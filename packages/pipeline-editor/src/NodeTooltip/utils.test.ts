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

import { hasValue, toPrettyString } from "./utils";

describe("toPrettyString", () => {
  it("returns the same string for a string", () => {
    const result = toPrettyString("hello world");
    expect(result).toBe("hello world");
  });

  it("returns a string for a number", () => {
    const result = toPrettyString(42);
    expect(result).toBe("42");
  });

  it("returns a string for a simple string array", () => {
    const result = toPrettyString(["one", "two", "three"]);
    expect(result).toBe("one\ntwo\nthree");
  });

  it("returns a string for a simple array with numbers", () => {
    const result = toPrettyString([1, 2, 3]);
    expect(result).toBe("1\n2\n3");
  });

  it("returns a string for a simple array with null holes", () => {
    const result = toPrettyString([null, null, null]);
    expect(result).toBe("null\nnull\nnull");
  });

  it("returns a string for a simple array with undefined holes", () => {
    const result = toPrettyString([undefined, undefined, undefined]);
    expect(result).toBe("undefined\nundefined\nundefined");
  });

  it("returns an empty string for an empty array", () => {
    const result = toPrettyString([]);
    expect(result).toBe("");
  });

  it("returns a string for a sparse array", () => {
    // eslint-disable-next-line no-sparse-arrays
    const result = toPrettyString(["one", , , "two", , "three"]);
    expect(result).toBe("one\n\n\ntwo\n\nthree");
  });

  it("returns 'Yes' for a true boolean", () => {
    const result = toPrettyString(true);
    expect(result).toBe("Yes");
  });

  it("returns 'No' for a false boolean", () => {
    const result = toPrettyString(false);
    expect(result).toBe("No");
  });

  it("returns a string for undefined", () => {
    const result = toPrettyString(undefined);
    expect(result).toBe("undefined");
  });

  it("returns a string for null", () => {
    const result = toPrettyString(null);
    expect(result).toBe("null");
  });

  it("returns a string for NaN", () => {
    const result = toPrettyString(NaN);
    expect(result).toBe("NaN");
  });

  it("returns a string for an object", () => {
    const result = toPrettyString({ one: 1, two: 2, three: 3 });
    expect(result).toBe("one: 1\ntwo: 2\nthree: 3");
  });

  it("returns a string for an error", () => {
    const result = toPrettyString(new Error("this is an error"));
    expect(result).toBe("Error: this is an error");
  });
});

describe("hasValue", () => {
  it("returns true for a true value", () => {
    const result = hasValue(true);
    expect(result).toBe(true);
  });

  it("returns true for a false value", () => {
    const result = hasValue(true);
    expect(result).toBe(true);
  });

  it("returns true for a string", () => {
    const result = hasValue("hello");
    expect(result).toBe(true);
  });

  it("returns true for an array", () => {
    const result = hasValue(["one", "two", "three"]);
    expect(result).toBe(true);
  });

  it("returns true for an object", () => {
    const result = hasValue({ one: 1, two: 2, three: 3 });
    expect(result).toBe(true);
  });

  it("returns true for a number", () => {
    const result = hasValue(42);
    expect(result).toBe(true);
  });

  it("returns true for zero", () => {
    const result = hasValue(0);
    expect(result).toBe(true);
  });

  it("returns true for NaN", () => {
    const result = hasValue(NaN);
    expect(result).toBe(true);
  });

  it("returns false for an empty string", () => {
    const result = hasValue("");
    expect(result).toBe(false);
  });

  it("returns false for an empty array", () => {
    const result = hasValue([]);
    expect(result).toBe(false);
  });

  it("returns false for a null value", () => {
    const result = hasValue(null);
    expect(result).toBe(false);
  });

  it("returns false for an undefined value", () => {
    const result = hasValue(undefined);
    expect(result).toBe(false);
  });
});
