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

import canvasStyles from "@elyra/canvas/dist/styles/common-canvas.min.css";
// alias `createGlobalStyle` to `css` for prettier formatting support.
import { createGlobalStyle as css } from "styled-components";

export const CanvasOverrides = css`
  ${canvasStyles}

  .toolbar-popover-list {
    border: 1px solid ${({ theme }) => theme.palette.border};
    background-color: ${({ theme }) => theme.palette.background.secondary};
  }

  .toolbar-divider {
    border-right: 1px solid ${({ theme }) => theme.palette.border};
    background-color: transparent;
  }

  .toolbar-divider:focus {
    outline: none;
  }

  .toolbar-div,
  .toolbar-item,
  .toolbar-overflow-item,
  .toolbar-item.default button,
  .toolbar-item.ghost button,
  .toolbar-overflow-item button,
  .toolbar-overflow-menu-item button {
    background-color: ${({ theme }) => theme.palette.background.secondary};
    border: none;
  }

  .toolbar-item.default button:focus,
  .toolbar-item.ghost button:focus,
  .toolbar-overflow-item button:focus,
  .toolbar-overflow-menu-item button:focus {
    outline: none;
  }

  .toolbar-item.default button:hover,
  .toolbar-item.ghost button:hover,
  .toolbar-overflow-item button:hover,
  .toolbar-overflow-menu-item button:hover {
    background-color: ${({ theme }) => theme.palette.hover};
  }

  .toolbar-item.default button:disabled:hover,
  .toolbar-item.ghost button:disabled:hover,
  .toolbar-overflow-menu-item button:disabled:hover {
    background-color: ${({ theme }) => theme.palette.background.secondary};
  }

  .toolbar-item.default button:hover,
  .toolbar-item.ghost button:hover,
  .toolbar-overflow-item button:hover,
  .toolbar-overflow-menu-item button:hover {
    background-color: var(--vscode-statusBarItem-hoverBackground);
  }

  .toolbar-item.default button:active,
  .toolbar-item.ghost button:active,
  .toolbar-overflow-item button:active,
  .toolbar-overflow-menu-item button:active {
    background-color: ${({ theme }) => theme.palette.active};
  }

  .toolbar-item-content.default {
    color: ${({ theme }) => theme.palette.text.icon};
  }

  .toolbar-item-content.disabled.default {
    color: ${({ theme }) => theme.palette.text.disabled};
  }

  .properties-control-description {
    margin-top: -1px;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: ${({ theme }) => theme.typography.fontWeight};
    font-size: ${({ theme }) => theme.typography.fontSize};
    color: ${({ theme }) => theme.palette.text.secondary};
    line-height: 1.4em;
    letter-spacing: normal;
    padding: 0;
    opacity: 0.9;
  }

  /* elevate specificity */
  .properties-control-label.properties-control-label {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: 600;
    font-size: ${({ theme }) => theme.typography.fontSize};
    color: ${({ theme }) => theme.palette.text.secondary};
    line-height: 1.4em;
    letter-spacing: normal;
  }

  /* text input */
  .bx--text-input__field-outer-wrapper {
    margin-top: 9px;
  }

  .properties-wrapper {
    background: none;
  }

  .properties-wrapper input[type="text" i],
  .properties-wrapper input[type="number" i],
  .properties-wrapper textarea {
    box-sizing: border-box;
    padding: 4px;
    background-color: ${({ theme }) => theme.palette.background.input};
    color: ${({ theme }) => theme.palette.text.primary};
    border: 1px solid ${({ theme }) => theme.palette.inputBorder};
    width: 100%;
    max-width: 500px;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: ${({ theme }) => theme.typography.fontWeight};
    font-size: ${({ theme }) => theme.typography.fontSize};
    border-radius: ${({ theme }) => theme.shape.borderRadius};
  }

  .properties-wrapper p {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: ${({ theme }) => theme.typography.fontWeight};
    font-size: ${({ theme }) => theme.typography.fontSize};
  }

  .properties-wrapper textarea {
    resize: vertical;
  }

  .properties-wrapper input[type="text" i]:hover,
  .properties-wrapper input[type="number" i]:hover {
    border: 1px solid ${({ theme }) => theme.palette.highlight.hover};
    border-radius: ${({ theme }) => theme.shape.borderRadius}};
  }

  .properties-wrapper input[type="text" i]:focus,
  .properties-wrapper input[type="number" i]:focus {
    border: 1px solid ${({ theme }) => theme.palette.focus};
    border-radius: ${({ theme }) => theme.shape.borderRadius};
  }

  .properties-wrapper input[type="text" i]:disabled,
  .properties-wrapper input[type="number" i]:disabled {
    color: ${({ theme }) => theme.palette.text.disabled};
  }

  /* ========================================================================== */
  /* CANVAS TOOLTIP */
  /* ========================================================================== */

  .common-canvas-tooltip {
    max-width: unset;
    background-color: ${({ theme }) => theme.palette.background.secondary};
    border: 1px solid ${({ theme }) => theme.palette.border};
    opacity: 100%;
    color: ${({ theme }) => theme.palette.text.secondary};
    border-radius: 0;
    transition: opacity 0.1s ease-in-out, visibility 0.1s ease-in-out;

    padding: 4px 7px;
    line-height: 1.5;

    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: ${({ theme }) => theme.typography.fontWeight};
    font-size: ${({ theme }) => theme.typography.fontSize};
  }

  .common-canvas-tooltip #tipArrow polyline {
    fill: ${({ theme }) => theme.palette.background.secondary};
    stroke-width: 0;
  }

  .common-canvas-tooltip #tipArrow polygon {
    fill: ${({ theme }) => theme.palette.border};
  }

  /* ========================================================================== */
  /* COMMON PROPERTIES */
  /* ========================================================================== */
  .properties-wrapper,
  .properties-wrapper * {
    outline: none;
  }

  .properties-category {
    padding: 0;
  }

  .properties-editor-form
    .properties-control-panel
    > .properties-control-panel {
    padding-left: 33px;
    padding-right: 24px;
    /* 765 + 33 + 24 */
    max-width: 822px;
  }

  .properties-editor-form
    .properties-control-panel
    > .properties-control-panel
    > .properties-ctrl-wrapper {
    padding-left: 14px;
    padding-right: 14px;
    padding-top: 12px;
    padding-bottom: 18px;
  }

  .properties-label-container {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    padding-bottom: 0;
  }

  .properties-wrapper .bx--visually-hidden,
  .properties-wrapper .properties-validation-message {
    display: none;
  }

  /* select */

  .bx--dropdown {
    margin-top: 9px;
  }

  .properties-wrapper .bx--list-box {
    position: relative;
    max-width: 320px;
  }

  .properties-wrapper .bx--list-box__field {
    background-color: ${({ theme }) => theme.palette.secondary.main};
    color: ${({ theme }) => theme.palette.secondary.contrastText};
    border: 1px solid ${({ theme }) => theme.palette.inputBorder};
    display: flex;
    width: 100%;
    height: 26px;
    align-items: center;
    justify-content: space-between;
    padding: 2px 8px;
  }

  .bx--list-box__label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bx--list-box__menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .properties-wrapper .bx--list-box__field:hover {
    background-color: ${({ theme }) => theme.palette.secondary.main};
  }

  .properties-wrapper .bx--list-box__menu {
    display: none;
  }

  .properties-wrapper .bx--list-box--expanded .bx--list-box__menu {
    display: block;
  }

  .properties-wrapper .bx--list-box__menu {
    z-index: 10;
    position: absolute;
    top: 26px;
    left: 0;
    right: 0;
    color: ${({ theme }) => theme.palette.secondary.contrastText};
    background-color: ${({ theme }) => theme.palette.secondary.main};
    padding: 2px;
    padding-bottom: 4px;
  }

  .properties-wrapper .bx--list-box__menu-item {
    height: 18px;
    line-height: 18px;
    padding-left: 3.5px;
    color: ${({ theme }) => theme.palette.text.primary};
  }

  .bx--list-box__menu-item__option {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .properties-wrapper .bx--list-box__menu-item:hover {
    background-color: ${({ theme }) => theme.palette.primary.hover};
  }

  .properties-wrapper .bx--list-box__menu-item__selected-icon {
    display: none;
  }

  .bx--list-box--expanded .bx--list-box__field,
  .bx--list-box--expanded .bx--list-box__menu {
    border: 1px solid ${({ theme }) => theme.palette.highlight.hover};
    border-radius: ${({ theme }) => theme.shape.borderRadius};
    background-color: ${({ theme }) => theme.palette.background.input};
  }

  .bx--list-box__field:focus {
    border: 1px solid ${({ theme }) => theme.palette.focus};
    border-radius: ${({ theme }) => theme.shape.borderRadius};
  }

  /* button */
  .properties-wrapper button {
    color: ${({ theme }) => theme.palette.text.primary};
    background-color: ${({ theme }) => theme.palette.secondary.main};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: ${({ theme }) => theme.typography.fontWeight};
    font-size: ${({ theme }) => theme.typography.fontSize};
    padding: 2px 14px;
    cursor: pointer;
    line-height: 1.4em;
    border: 1px solid ${({ theme }) => theme.palette.inputBorder};
    border-radius: ${({ theme }) => theme.shape.borderRadius};
  }

  .properties-wrapper button:hover {
    background-color: ${({ theme }) => theme.palette.primary.hover};
    border: 1px solid ${({ theme }) => theme.palette.highlight.hover};
  }

  /* ========================================================================== */
  /* CANVAS */
  /* ========================================================================== */
  .common-canvas {
    overflow: hidden;
  }

  .d3-svg-canvas-div {
    background-color: transparent;
  }

  .d3-svg-background {
    fill: ${({ theme }) => theme.palette.background.default};
    cursor: default !important; /* set via element.style (must override with important) */
  }

  .d3-node-super-expand-icon-group .d3-node-super-expand-icon-background {
    cursor: pointer;
    fill: transparent;
  }

  .d3-node-super-expand-icon-group .d3-node-super-expand-icon {
    cursor: pointer;
    fill: ${({ theme }) => theme.palette.text.icon};
  }

  .d3-node-super-expand-icon-group:hover .d3-node-super-expand-icon-background {
    fill: transparent;
  }

  .d3-back-to-previous-flow-box {
    display: none;
  }

  .d3-back-to-previous-flow-text {
    display: none;
  }

  .d3-node-body-outline {
    stroke: transparent;
    fill: ${({ theme }) => theme.palette.background.secondary};
  }

  .d3-node-group:hover .d3-node-body-outline {
    stroke: transparent;
    fill: ${({ theme }) => theme.palette.background.secondary};
  }

  .d3-link-group {
    cursor: pointer;
  }

  .d3-link-group.d3-data-link:hover .d3-link-line,
  .d3-link-group.d3-data-link .d3-link-line {
    stroke: ${({ theme }) => theme.palette.text.link};
    stroke-width: 2;
  }

  .d3-link-group.d3-comment-link:hover .d3-link-line,
  .d3-link-group.d3-comment-link .d3-link-line {
    stroke: ${({ theme }) => theme.palette.text.inactive};
    stroke-width: 1;
    stroke-dasharray: none;
    opacity: 0.4;
  }

  .d3-comment-rect {
    fill: ${({ theme }) => theme.palette.background.default};
    stroke: transparent;
    stroke-width: 0;
  }

  .d3-node-label,
  .d3-supernode-label {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: ${({ theme }) => theme.typography.fontWeight};
    font-size: ${({ theme }) => theme.typography.fontSize};
    color: ${({ theme }) => theme.palette.text.primary};
  }

  .d3-comment-text {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: ${({ theme }) => theme.typography.fontWeight};
    font-size: ${({ theme }) => theme.typography.fontSize};
    color: ${({ theme }) => theme.palette.text.inactive};
  }

  .d3-comment-entry {
    background-color: ${({ theme }) => theme.palette.background.default};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: ${({ theme }) => theme.typography.fontWeight};
    font-size: ${({ theme }) => theme.typography.fontSize};
    color: ${({ theme }) => theme.palette.text.inactive};
    box-sizing: border-box; /* very important! */
  }

  .d3-comment-entry:focus {
    outline: none;
    box-shadow: none;
  }

  .d3-node-selection-highlight[data-selected="yes"] {
    stroke: ${({ theme }) => theme.palette.text.link};
  }

  .d3-comment-selection-highlight {
    stroke: ${({ theme }) => theme.palette.text.inactive};
    stroke-width: 1;
  }

  .d3-comment-selection-highlight[data-selected="yes"] {
    stroke: ${({ theme }) => theme.palette.text.inactive};
    stroke-width: 3;
  }

  .d3-node-ellipsis-group .d3-node-ellipsis {
    fill: ${({ theme }) => theme.palette.text.icon};
  }

  .d3-node-ellipsis-group:hover .d3-node-ellipsis-background {
    fill: transparent;
  }

  .d3-new-connection-line[linkType="nodeLink"] {
    stroke: ${({ theme }) => theme.palette.text.link};
    stroke-width: 2;
    stroke-dasharray: 10 10;
    stroke-linecap: round;
  }

  .d3-new-connection-start[linkType="nodeLink"],
  .d3-new-connection-guide[linkType="nodeLink"] {
    stroke: ${({ theme }) => theme.palette.text.link};
    fill: ${({ theme }) => theme.palette.text.link};
  }

  .d3-new-connection-line[linkType="commentLink"] {
    stroke: ${({ theme }) => theme.palette.text.inactive};
    stroke-width: 2;
    stroke-dasharray: 10 10;
    stroke-linecap: round;
  }

  .d3-new-connection-start[linkType="commentLink"],
  .d3-new-connection-guide[linkType="commentLink"] {
    stroke: ${({ theme }) => theme.palette.text.primary};
    fill: ${({ theme }) => theme.palette.text.primary};
  }

  .pipeline-read-only .d3-comment-sizing,
  .pipeline-read-only .d3-comment-port-circle,
  .pipeline-read-only .d3-node-selection-highlight,
  .pipeline-read-only .d3-comment-selection-highlight,
  .pipeline-read-only .d3-node-port-input,
  .pipeline-read-only .d3-node-port-output,
  .pipeline-read-only .d3-node-port-input-arrow,
  .pipeline-read-only .d3-node-ellipsis-group,
  .pipeline-read-only .d3-new-connection-line,
  .pipeline-read-only .d3-new-connection-start,
  .pipeline-read-only .d3-new-connection-guide,
  .pipeline-read-only .d3-comment-entry {
    display: none;
  }

  .properties-editor-form
    .properties-control-panel
    > .properties-control-panel
    > .properties-ctrl-wrapper {
    position: relative;
  }

  .properties-editor-form
    .properties-control-panel
    > .properties-control-panel
    > .properties-ctrl-wrapper
    .error::before {
    display: block;
    content: "";
    width: 6px;
    border-left-width: 2px;
    border-left-style: solid;
    left: 5px;
    top: 15px;
    bottom: 18px;
    border-color: ${({ theme }) => theme.palette.error.main};
  }

  .properties-editor-form
  .properties-control-panel
  > .properties-control-panel
  > .properties-ctrl-wrapper:only-child
  .error::before {
    position: absolute;
  }

  .properties-editor-form
  .properties-control-panel
  > .properties-control-panel
  > .properties-ctrl-wrapper:only-child
  .elyra-errorMessage {
    position: unset;
  }

  .properties-input-control.error input:not([disabled]) {
    box-shadow: none;
  }

  .properties-dropdown.error .bx--list-box__field:not([disabled]) {
    box-shadow: none;
  }

  .properties-required-indicator {
    display: none;
  }
  .properties-editor-form
    .properties-control-panel
    > .properties-control-panel
    > .properties-ctrl-wrapper {
    position: relative;
    border: 1px solid transparent;
  }

  .properties-editor-form
    .properties-control-panel
    > .properties-control-panel
    > .properties-ctrl-wrapper:hover {
    background-color: ${({ theme }) => theme.palette.primary.hover};
  }

  .properties-editor-form
    .properties-control-panel
    > .properties-control-panel
    > .properties-ctrl-wrapper.selected {
    background-color: ${({ theme }) => theme.palette.highlight.focus};
    border: 1px solid ${({ theme }) => theme.palette.highlight.border};
  }

  .d3-node-port-input,
  .d3-node-port-output,
  .d3-node-port-input[connected="yes"],
  .d3-node-port-output[connected="yes"] {
    stroke: ${({ theme }) => theme.palette.text.secondary};
    fill: ${({ theme }) => theme.palette.text.secondary};
    stroke-width: 4;
  }

  .d3-node-port-input:hover,
  .d3-node-port-output:hover,
  .d3-node-port-input[connected="yes"]:hover,
  .d3-node-port-output[connected="yes"]:hover {
    stroke: ${({ theme }) => theme.palette.text.primary};
    fill: ${({ theme }) => theme.palette.text.primary};
    stroke-width: 4;
  }

  .d3-comment-port-circle {
    stroke: ${({ theme }) => theme.palette.text.secondary};
    fill: ${({ theme }) => theme.palette.text.secondary};
  }

  .d3-comment-port-circle:hover {
    stroke: ${({ theme }) => theme.palette.text.primary};
    fill: ${({ theme }) => theme.palette.text.primary};
  }

  .d3-node-port-input-arrow {
    display: none;
  }

  /* context menu */

  .d3-node-ellipsis-group {
    display: none;
  }

  .context-menu-popover {
    margin-top: -6px;
    margin-left: 2px;
    padding: 6px 0;
    backdrop-filter: saturate(180%) blur(20px);
    border-radius: 6px;
    user-select: none;
    cursor: default;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05),
      0px 4px 15px 2px rgba(0, 0, 0, 0.18);
  }

  .context-menu-popover::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    border-radius: 13px;
    content: "";
    transform: scale(0.5);
    -webkit-transform: scale(0.5);
    transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
  }

  .react-contextmenu-item {
    position: relative;
    margin: 0 6px;
    width: auto;
    height: 22px;
    border-radius: 4px;
    font-size: 13px;
    padding: 3px 9px;
    box-sizing: border-box;
    cursor: default;
    z-index: 0;
  }

  .react-contextmenu-item:hover::before {
    content: "";
    background-color: rgba(54, 131, 247, 0.75);
    backdrop-filter: saturate(0%);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 4px;
    z-index: -1;
  }

  .react-contextmenu-item:hover::after {
    content: "";
    background: ${({ theme }) => theme.palette.background.default};
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 4px;
    z-index: -2;
  }

  .react-contextmenu-item.contextmenu-divider {
    margin: 5px 15px;
  }

  .react-contextmenu-item.react-contextmenu-item--disabled {
    cursor: default;
    opacity: 1;
  }

  .react-contextmenu-item:active,
  .react-contextmenu-item:focus,
  .react-contextmenu-item.react-contextmenu-item--disabled {
    background: transparent;
  }

  .react-contextmenu-item.react-contextmenu-item--disabled::before,
  .react-contextmenu-item.react-contextmenu-item--disabled::after {
    display: none;
  }

  .context-menu-popover {
    background: ${({ theme }) =>
      theme.mode === "dark"
        ? "rgba(46, 46, 46, 0.72)"
        : "rgba(231, 231, 231, 0.76)"};
  }

  .context-menu-popover::before {
    box-shadow: ${({ theme }) =>
      theme.mode === "dark"
        ? "inset 0px 0px 0px 1px rgba(0, 0, 0, 0.86), inset 0px 0px 0px 3px rgba(255, 255, 255, 0.2)"
        : "0px 0px 0px 1px rgba(0, 0, 0, 0.22), inset 0px 0px 0px 1px rgba(255, 255, 255, 0.1)"};
  }

  .react-contextmenu-item {
    color: ${({ theme }) =>
      theme.mode === "dark"
        ? "rgba(255, 255, 255, 0.9)"
        : "rgba(0, 0, 0, 0.85)"};
  }

  .react-contextmenu-item:hover {
    color: ${({ theme }) =>
      theme.mode === "dark"
        ? "rgba(255, 255, 255, 0.9)"
        : "rgba(255, 255, 255, 1)"};
  }

  .react-contextmenu-item.react-contextmenu-item--disabled {
    color: ${({ theme }) =>
      theme.mode === "dark"
        ? "rgba(255, 255, 255, 0.355)"
        : "rgba(0, 0, 0, 0.315)"};
  }

  .react-contextmenu-item.contextmenu-divider {
    background-color: ${({ theme }) =>
      theme.mode === "dark" ? "#ffffff" : "#000000"};
    opacity: ${({ theme }) => (theme.mode === "dark" ? 0.205 : 0.13)};
  }
`;
