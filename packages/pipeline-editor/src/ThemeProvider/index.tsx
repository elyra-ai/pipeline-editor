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

import {
  DefaultTheme,
  ThemeProvider as InternalThemeProvider,
} from "styled-components";

import { CanvasOverrides } from "./styles";

const defaultTheme: DefaultTheme = {
  palette: {
    primary: {
      main: "#4d78cc",
      hover: "#6087cf",
      contrastText: "#fff",
    },
    error: {
      main: "#be1100",
      contrastText: "#fff",
    },
    text: {
      icon: "#c5c5c5",
      whySoManyTextColorsThebrightestBesidesWhite: "#f0f0f0",
      evenMorePrimary: "#e7e7e7", // form labels?
      primary: "#cccccc",
      secondary: "#abb2bf",
      disabled: "rgba(215, 218, 224, 0.25)",
      link: "#3794ff",
      error: "#f48771",
    },
    focus: "#528bff",
    border: "#181a1f",
    divider: "rgba(128, 128, 128, 0.35)",
    background: {
      default: "#282c34",
      secondary: "#21252b",
      okayThereWasActualAThirdBackgroundColor: "#353b45",
      ughAndInputsHaveAnotherColor: "#1b1d23",
    },
  },
  typography: {
    fontFamily: "-apple-system, system-ui, sans-serif",
    fontWeight: "normal",
    fontSize: "13px",
  },
};

function createTheme(overides: Partial<DefaultTheme>) {
  return { ...defaultTheme, ...overides };
}

const ThemeProvider: React.FC<{ theme: Partial<DefaultTheme> }> = ({
  theme,
  children,
}) => {
  return (
    <InternalThemeProvider theme={theme as any}>
      <InternalThemeProvider theme={createTheme}>
        <CanvasOverrides />
        {children}
      </InternalThemeProvider>
    </InternalThemeProvider>
  );
};

export default ThemeProvider;
