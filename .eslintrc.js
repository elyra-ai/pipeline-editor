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

const allExtensions = [".ts", ".tsx", ".d.ts", ".js", ".jsx"];

module.exports = {
  root: true,
  extends: [
    "react-app",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:testing-library/react",
    "plugin:jest-dom/recommended",
  ],
  plugins: ["import", "header"],
  rules: {
    "testing-library/prefer-screen-queries": ["warn"],
    "jest/no-large-snapshots": ["warn", { maxSize: 20 }],
    "jest/expect-expect": ["off"],
    "jest/valid-title": ["off"],
    "header/header": [
      "warn",
      "block",
      [
        "",
        " * Copyright 2018-2021 Elyra Authors",
        " *",
        ' * Licensed under the Apache License, Version 2.0 (the "License");',
        " * you may not use this file except in compliance with the License.",
        " * You may obtain a copy of the License at",
        " *",
        " * http://www.apache.org/licenses/LICENSE-2.0",
        " *",
        " * Unless required by applicable law or agreed to in writing, software",
        ' * distributed under the License is distributed on an "AS IS" BASIS,',
        " * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.",
        " * See the License for the specific language governing permissions and",
        " * limitations under the License.",
        " ",
      ],
      2,
    ],
    "import/newline-after-import": ["warn", { count: 1 }],
    "import/no-extraneous-dependencies": [
      "warn",
      {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false,
        bundledDependencies: true,
      },
    ],
    "import/order": [
      "warn",
      {
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        "newlines-between": "always",
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling", "index"],
          "object",
        ],
        pathGroups: [
          {
            pattern: "react?(-dom)",
            group: "external",
            position: "before",
          },
          {
            pattern: "@iris/**",
            group: "external",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
      },
    ],
  },
  overrides: [
    {
      files: ["cypress/**"],
      rules: {
        "testing-library/prefer-screen-queries": "off",
      },
    },
    {
      files: ["stories/**"],
      rules: { "import/no-anonymous-default-export": ["off"] },
    },
    {
      files: ["webpack.*.js", "*.test.tsx", "*.test.ts", "cypress/**"],
      rules: {
        "import/no-extraneous-dependencies": [
          "warn",
          {
            devDependencies: true,
            optionalDependencies: false,
            peerDependencies: false,
            bundledDependencies: true,
          },
        ],
      },
    },
  ],
  settings: {
    "import/extensions": allExtensions,
    "import/external-module-folders": ["node_modules", "node_modules/@types"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx", ".d.ts"],
    },
    "import/resolver": {
      node: {
        extensions: allExtensions,
      },
    },
  },
};
