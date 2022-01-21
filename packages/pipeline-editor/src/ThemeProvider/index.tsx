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

import React, { useMemo } from "react";

import { DeepPartial } from "redux";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

import { Theme } from "../types";
import { CanvasOverrides } from "./styles";
import useSystemInfo from "./useSystemInfo";
import { deepmerge } from "./utils";

const defaultTheme: Omit<Theme, "mode" | "platform"> = {
  palette: {
    focus: "#528bff",
    border: "#181a1f",
    divider: "rgba(128, 128, 128, 0.35)",
    hover: "#2c313a",
    active: "rgba(255, 255, 255, 0.18)",
    tabBorder: "#e7e7e7",
    inputBorder: "transparent",
    sash: "transparent",
    primary: {
      main: "#4d78cc",
      hover: "#6087cf",
      contrastText: "#fff",
    },
    secondary: {
      main: "#353b45",
      contrastText: "#f0f0f0",
    },
    error: {
      main: "#be1100",
      contrastText: "#fff",
    },
    errorMessage: {
      main: "#be1100",
      contrastText: "#fff",
      errorBorder: "#be1100",
    },
    text: {
      icon: "#c5c5c5",
      primary: "#cccccc",
      secondary: "#abb2bf",
      bold: "#e7e7e7",
      inactive: "rgba(231, 231, 231, 0.6)",
      disabled: "rgba(215, 218, 224, 0.25)",
      link: "#3794ff",
      error: "#f48771",
    },
    background: {
      default: "#282c34",
      secondary: "#21252b",
      input: "#1b1d23",
    },
    highlight: {
      border: "rgba(255, 255, 255, 0.12)",
      hover: "rgba(128, 128, 128, 0.07)",
      focus: "rgba(128, 128, 128, 0.14)",
    },
  },
  shape: {
    borderRadius: "0px",
  },
  typography: {
    fontFamily: "-apple-system, system-ui, sans-serif",
    fontWeight: "normal",
    fontSize: "13px",
  },
};

function mergeThemes(systemInfo: {
  mode: "dark" | "light";
  platform: "mac" | "win" | "other";
}) {
  return (overides: Partial<Theme>): Theme => {
    return deepmerge<Theme>(
      { ...defaultTheme, ...systemInfo },
      overides as DeepPartial<Theme>
    );
  };
}

const ThemeProvider: React.FC<{ theme: DeepPartial<Theme> }> = ({
  theme,
  children,
}) => {
  return (
    <StyledThemeProvider theme={theme as any}>{children}</StyledThemeProvider>
  );
};

export const InternalThemeProvider: React.FC = ({ children }) => {
  const systemInfo = useSystemInfo();
  const theme = useMemo(() => mergeThemes(systemInfo), [systemInfo]);

  return (
    <StyledThemeProvider theme={theme}>
      <CanvasOverrides />
      {children}
    </StyledThemeProvider>
  );
};

export function createTheme(theme: DeepPartial<Theme>) {
  return theme;
}

export default ThemeProvider;
