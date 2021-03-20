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

// alias `createGlobalStyle` to `css` for prettier formatting support.
import { createGlobalStyle as css } from "styled-components";

// NOTE: This makes the build easier in dev mode for extensions using
// pipeline-editor. This is normally frowned upon, because it couples our code
// to webpack. This should be the only time we ever do this.
// eslint-disable-next-line import/no-webpack-loader-syntax
import canvasStyles from "!!raw-loader!@elyra/canvas/dist/styles/common-canvas.min.css";

// TODO: Canvas has options to override some styles in js, try to migrate to use
// those hooks as much as possible.
// TODO: styles - try to remove any unnecessary !important
export const CanvasOverrides = css`
  ${canvasStyles}

  .properties-control-description {
    margin-top: -1px;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: ${({ theme }) => theme.typography.fontWeight};
    font-size: ${({ theme }) => theme.typography.fontSize};
    color: ${({ theme }) => theme.palette.text.primary};
    line-height: 1.4em;
    letter-spacing: normal;
    padding: 0;
    opacity: 0.9;
    user-select: none;
  }

  .properties-control-label.properties-control-label {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: 600;
    font-size: ${({ theme }) => theme.typography.fontSize};
    color: ${({ theme }) => theme.palette.text.evenMorePrimary};
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
    background-color: ${({ theme }) =>
      theme.palette.background.ughAndInputsHaveAnotherColor};
    color: ${({ theme }) => theme.palette.text.primary};
    border: 1px solid ${({ theme }) => theme.palette.border};
    width: 100%;
    max-width: 500px;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: ${({ theme }) => theme.typography.fontWeight};
    font-size: ${({ theme }) => theme.typography.fontSize};
  }

  .properties-wrapper input[type="text" i]:focus {
    outline: 1px solid ${({ theme }) => theme.palette.focus};
    outline-offset: -1px;
  }

  .properties-wrapper input[type="text" i]:disabled {
    color: ${({ theme }) => theme.palette.text.disabled};
  }

  .d3-node-super-expand-icon-background {
    cursor: pointer !important;
    fill: transparent !important;
  }

  .d3-node-super-expand-icon {
    cursor: pointer !important;
    fill: ${({ theme }) => theme.palette.text.icon} !important;
  }

  .d3-back-to-previous-flow-box {
    transform: translate(13px, 9px);
    height: 38px;
    width: 148px;
    fill: ${({ theme }) => theme.palette.primary.main};
    stroke: none;
  }

  .d3-back-to-previous-flow-box[data-pointer-hover="yes"] {
    fill: ${({ theme }) => theme.palette.primary.hover};
    stroke: none;
  }

  .d3-back-to-previous-flow-text svg {
    display: none;
  }

  .d3-back-to-previous-flow-text {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: ${({ theme }) => theme.typography.fontWeight};
    font-size: ${({ theme }) => theme.typography.fontSize};
    fill: ${({ theme }) => theme.palette.primary.contrastText};
    transform: translate(-17px, 9px);
    text-rendering: geometricPrecision;
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

  .properties-wrapper {
    margin-top: 14px;
  }

  .properties-control-panel[data-id="properties-nodeGroupInfo"]
    > .properties-control-panel {
    padding-left: 33px;
    padding-right: 24px;
    /* 765 + 33 + 24 */
    max-width: 822px;
  }

  .properties-control-panel[data-id="properties-nodeGroupInfo"]
    > .properties-control-panel
    > .properties-control-item {
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

  .properties-dropdown {
    margin-top: 9px;
    padding: 0;
  }

  .properties-wrapper .bx--list-box {
    position: relative;
    max-width: 320px;
  }

  .properties-wrapper .bx--list-box__field {
    background-color: ${({ theme }) =>
      theme.palette.background.okayThereWasActualAThirdBackgroundColor};
    color: ${({ theme }) =>
      theme.palette.text.whySoManyTextColorsThebrightestBesidesWhite};
    border: 1px solid ${({ theme }) => theme.palette.border};
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
    /* override button style */
    background-color: ${({ theme }) =>
      theme.palette.background.okayThereWasActualAThirdBackgroundColor};
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
    color: ${({ theme }) =>
      theme.palette.text.whySoManyTextColorsThebrightestBesidesWhite};
    background-color: ${({ theme }) =>
      theme.palette.background.okayThereWasActualAThirdBackgroundColor};
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
    background-color: ${({ theme }) => theme.palette.randomTabsStuff.hover};
  }

  .properties-wrapper .bx--list-box__menu-item__selected-icon {
    display: none;
  }

  .bx--list-box--expanded .bx--list-box__field,
  .bx--list-box--expanded .bx--list-box__menu {
    outline: 1px solid ${({ theme }) => theme.palette.focus};
    outline-offset: -1px;
  }

  .bx--list-box__field:focus {
    outline: 1px solid ${({ theme }) => theme.palette.focus};
    outline-offset: -1px;
  }

  /* checkbox */
  .properties-wrapper .properties-checkbox {
    box-sizing: border-box;
    flex-shrink: 0;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    font-size: 16px;
    height: 18px;
    width: 18px;
    border: 1px solid transparent;
    border-radius: 3px;
    margin-right: 9px;
    margin-left: 0;
    padding: 0;
    background-color: ${({ theme }) =>
      theme.palette.background
        .okayThereWasActualAThirdBackgroundColor} !important;
    color: ${({ theme }) =>
      theme.palette.text
        .whySoManyTextColorsThebrightestBesidesWhite} !important;
    border-color: ${({ theme }) => theme.palette.border} !important;
  }

  .properties-wrapper .properties-checkbox:focus {
    outline: 1px solid ${({ theme }) => theme.palette.focus};
    outline-offset: -1px;
  }

  .properties-wrapper .properties-checkbox::before {
    opacity: 0;
  }

  .properties-wrapper .properties-checkbox.checked::before {
    opacity: 1;
  }

  /* button */
  .properties-wrapper button {
    color: ${({ theme }) => theme.palette.primary.contrastText};
    background-color: ${({ theme }) => theme.palette.primary.main};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: ${({ theme }) => theme.typography.fontWeight};
    font-size: ${({ theme }) => theme.typography.fontSize};
    padding: 2px 14px;
    cursor: pointer;
    line-height: 1.4em;
    border: none;
  }

  .properties-wrapper button:hover {
    background-color: ${({ theme }) => theme.palette.primary.hover};
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
    cursor: default !important;
  }

  .d3-link-group {
    cursor: pointer;
  }

  .d3-node-body-outline {
    stroke: transparent;
    stroke-width: 1;
    fill: ${({ theme }) => theme.palette.background.secondary};
    filter: none !important;
  }

  .d3-node-body-outline[hover="yes"] {
    stroke: transparent;
    stroke-width: 1;
    fill: ${({ theme }) => theme.palette.background.secondary};
  }

  .d3-data-link {
    stroke: ${({ theme }) => theme.palette.text.link} !important;
    stroke-width: 2;
  }

  .d3-data-link-error {
    stroke: ${({ theme }) => theme.palette.error.main} !important;
    stroke-width: 2;
    stroke-dasharray: 13;
  }

  .d3-comment-link {
    stroke: ${({ theme }) => theme.palette.divider} !important;
    stroke-width: 2 !important;
    stroke-dasharray: 7.3 !important;
  }

  .d3-comment-rect {
    fill: ${({ theme }) => theme.palette.background.default};
    stroke: ${({ theme }) => theme.palette.divider} !important;
    stroke-width: 1;
    rx: 0;
  }

  .d3-node-label,
  .d3-supernode-label {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: ${({ theme }) => theme.typography.fontWeight};
    font-size: ${({ theme }) => theme.typography.fontSize};
    fill: ${({ theme }) => theme.palette.text.primary};
    font-weight: 500;
    text-rendering: geometricPrecision;
  }

  .d3-comment-text-tspan {
    font-family: ${({ theme }) => theme.typography.fontFamily} !important;
    font-weight: ${({ theme }) => theme.typography.fontWeight} !important;
    font-size: ${({ theme }) => theme.typography.fontSize} !important;
    fill: ${({ theme }) => theme.palette.text.secondary} !important;
    text-rendering: geometricPrecision;
  }

  .d3-comment-entry {
    background-color: ${({ theme }) => theme.palette.background.default};
    font-family: ${({ theme }) => theme.typography.fontFamily} !important;
    font-weight: ${({ theme }) => theme.typography.fontWeight} !important;
    font-size: ${({ theme }) => theme.typography.fontSize} !important;
    color: ${({ theme }) => theme.palette.text.secondary} !important;
    box-sizing: border-box; /* very important! */
  }

  .d3-node-selection-highlight[data-selected="yes"] {
    stroke: ${({ theme }) => theme.palette.text.link};
  }

  .d3-comment-selection-highlight[data-selected="yes"] {
    stroke: ${({ theme }) => theme.palette.text.link};
    rx: 0;
  }

  .d3-node-ellipsis-group .d3-node-ellipsis {
    fill: ${({ theme }) => theme.palette.text.icon};
  }

  .d3-node-ellipsis-group:hover .d3-node-ellipsis-background {
    fill: transparent;
  }

  .d3-new-connection-line,
  .d3-new-connection-start,
  .d3-new-connection-guide {
    stroke: ${({ theme }) => theme.palette.text.link} !important;
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

  .properties-control-panel[data-id="properties-nodeGroupInfo"]
    > .properties-control-panel
    > .properties-control-item {
    position: relative;
  }

  .properties-control-panel[data-id="properties-nodeGroupInfo"]
    > .properties-control-panel
    > .properties-control-item
    .error::before {
    display: block;
    content: " ";
    position: absolute;
    width: 6px;
    border-left-width: 2px;
    border-left-style: solid;
    left: 5px;
    top: 15px;
    bottom: 18px;
    border-color: ${({ theme }) => theme.palette.error.main};
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

  .properties-control-panel[data-id="properties-nodeGroupInfo"]
    > .properties-control-panel
    > .properties-control-item {
    position: relative;
  }

  .properties-control-panel[data-id="properties-nodeGroupInfo"]
    > .properties-control-panel
    > .properties-control-item:hover {
    background-color: ${({ theme }) =>
      theme.palette.extraOptionalFormStuff.hover};
  }

  .properties-control-panel[data-id="properties-nodeGroupInfo"]
    > .properties-control-panel
    > .properties-control-item.selected {
    background-color: ${({ theme }) =>
      theme.palette.extraOptionalFormStuff.focus};
  }

  .properties-control-panel[data-id="properties-nodeGroupInfo"]
    > .properties-control-panel
    > .properties-control-item.selected::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border-top: 1px solid
      ${({ theme }) => theme.palette.extraOptionalFormStuff.border};
  }

  .properties-control-panel[data-id="properties-nodeGroupInfo"]
    > .properties-control-panel
    > .properties-control-item.selected::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid
      ${({ theme }) => theme.palette.extraOptionalFormStuff.border};
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
    /* box-shadow: 0px 4px 17.64px 3.36px rgba(0, 0, 0, 0.2); */
    user-select: none;
    cursor: default;
    /* box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05),
    0px 8px 15px 2px rgba(0, 0, 0, 0.18); */
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

    /* rgba(10, 130, 255, 0.75); */
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
    background: transparent !important;
  }

  .react-contextmenu-item.react-contextmenu-item--disabled::before,
  .react-contextmenu-item.react-contextmenu-item--disabled::after {
    display: none !important;
  }

  /* ========================================================================== */
  /* LIGHT THEME */
  /* ========================================================================== */
  .context-menu-popover {
    background: rgba(231, 231, 231, 0.76);
  }

  .context-menu-popover::before {
    /* box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.22),
    inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1); */
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.22),
      inset 0px 0px 0px 1px rgba(255, 255, 255, 0.1);
  }

  .react-contextmenu-item {
    color: rgba(0, 0, 0, 0.85);
  }

  .react-contextmenu-item:hover {
    color: rgba(255, 255, 255, 1);
  }

  .react-contextmenu-item.react-contextmenu-item--disabled {
    color: rgba(0, 0, 0, 0.315); /* 0.27, 0.36 */
  }

  .react-contextmenu-item.contextmenu-divider {
    background-color: #000000;
    opacity: 0.13; /* 0.11, 0.15 */
  }

  /* ========================================================================== */
  /* DARK THEME */
  /* ========================================================================== */

  body.elyra-dark .context-menu-popover {
    background: rgba(46, 46, 46, 0.72);
  }

  body.elyra-dark .context-menu-popover::before {
    box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.86),
      inset 0px 0px 0px 3px rgba(255, 255, 255, 0.2);
  }

  body.elyra-dark .react-contextmenu-item {
    color: rgba(255, 255, 255, 0.9);
  }

  body.elyra-dark .react-contextmenu-item:hover {
    color: rgba(255, 255, 255, 0.9);
  }

  body.elyra-dark .react-contextmenu-item.react-contextmenu-item--disabled {
    color: rgba(255, 255, 255, 0.355); /* 0.29, 0.42 */
  }

  body.elyra-dark .react-contextmenu-item.contextmenu-divider {
    background-color: #ffffff;
    opacity: 0.205; /* 0.17, 0.24 */
  }
`;
