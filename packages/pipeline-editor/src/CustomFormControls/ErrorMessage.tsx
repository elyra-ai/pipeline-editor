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

import styled from "styled-components";

export const ErrorMessage = styled.div.attrs({
  className: "elyra-errorMessage",
})`
  position: absolute;
  left: 0;
  right: 0;
  padding: 5px;
  box-sizing: border-box;
  z-index: 1;
  border-style: solid;
  border-width: 1px;
  border-color: ${({ theme }) => theme.palette.errorMessage.errorBorder};
  background-color: ${({ theme }) => theme.palette.errorMessage.main};
  color: ${({ theme }) => theme.palette.errorMessage.contrastText};
`;
