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

import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    palette: {
      primary: {
        main: string;
        hover: string;
        contrastText: string;
      };
      error: {
        main: string;
        contrastText: string;
      };
      text: {
        icon: string;
        whySoManyTextColorsThebrightestBesidesWhite: string;
        evenMorePrimary: string;
        primary: string;
        secondary: string;
        disabled: string;
        link: string;
        error: string;
      };
      focus: string;
      border: string;
      divider: string;
      background: {
        default: string;
        secondary: string;
        okayThereWasActualAThirdBackgroundColor: string;
        ughAndInputsHaveAnotherColor: string;
      };
    };
    typography: {
      fontFamily: string;
      fontWeight: string;
      fontSize: number;
    };
  }
}
