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

import { createGlobalStyle as css } from "styled-components";

export const CanvasOverrides = css`
  .properties-control-description {
    margin-top: -1px;
    font-family: ${(props) => props.theme.typography.fontFamily};
    font-weight: ${(props) => props.theme.typography.fontWeight};
    font-size: ${(props) => props.theme.typography.fontSize};
    color: ${(props) => props.theme.palette.text.primary};
    line-height: 1.4em;
    letter-spacing: normal;
    padding: 0;
    opacity: 0.9;
    user-select: none;
  }

  // Double up to ensure specificity.
  .properties-control-label.properties-control-label {
    font-family: ${(props) => props.theme.typography.fontFamily};
    font-weight: 600;
    font-size: ${(props) => props.theme.typography.fontSize};
    color: ${(props) => props.theme.palette.text.evenMorePrimary};
    line-height: 1.4em;
    letter-spacing: normal;
  }

  /* text input */
  .properties-textfield {
    margin-top: 9px;
  }

  .properties-wrapper input[type="text" i] {
    box-sizing: border-box;
    padding: 4px;
    background-color: var(--elyra-color-textInput-bg);
    color: var(--elyra-color-textInput-text);
    border: 1px solid var(--elyra-color-textInput-border);
    width: 100%;
    max-width: 500px;
    font-size: var(--elyra-font-size-sans);
    font-weight: var(--elyra-font-weight-sans);
    font-family: var(--elyra-font-family-sans);
  }

  .properties-wrapper input[type="text" i]:focus {
    outline: 1px solid var(--elyra-color-focus) !important;
    outline-offset: -1px;
  }

  .properties-wrapper input[type="text" i]:disabled {
    color: var(--elyra-color-textInput-disabled-text);
  }
`;
