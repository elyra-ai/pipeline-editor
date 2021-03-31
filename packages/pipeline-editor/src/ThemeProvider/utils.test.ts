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

import { deepmerge } from "./utils";

describe("deepmerge", () => {
  it("returns target when source is empty", () => {
    const target = {
      one: {
        two: {
          three: "x",
        },
      },
    };

    const source = {};

    const actual = deepmerge(target, source);

    expect(actual).toEqual(target);
  });

  it("adds missing objects", () => {
    interface Target {
      one: {
        two: {
          three: string;
        };
      };
      four?: {
        five?: string;
        six?: string;
      };
    }

    const target: Target = {
      one: {
        two: {
          three: "x",
        },
      },
    };

    const source = {
      four: {
        five: "y",
        six: "z",
      },
    };

    const expected = {
      one: {
        two: {
          three: "x",
        },
      },
      four: {
        five: "y",
        six: "z",
      },
    };

    const actual = deepmerge(target, source);

    expect(actual).toEqual(expected);
  });

  it("updates values", () => {
    const target = {
      one: {
        two: {
          three: "x",
        },
      },
    };

    const source = {
      one: {
        two: {
          three: "y",
        },
      },
    };

    const expected = {
      one: {
        two: {
          three: "y",
        },
      },
    };

    const actual = deepmerge(target, source);

    expect(actual).toEqual(expected);
  });

  it("doesn't update if undefined", () => {
    const target = {
      one: {
        two: {
          three: "x",
        },
      },
    };

    const source = {
      one: {
        two: {
          three: undefined,
        },
      },
    };

    const expected = {
      one: {
        two: {
          three: "x",
        },
      },
    };

    const actual = deepmerge(target, source);

    expect(actual).toEqual(expected);
  });
});
