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

const Container = styled.div`
  cursor: pointer;
  user-select: none;
  display: inline-block;
  transition: transform 50ms ease;
  position: relative;

  &:active {
    transform: scale(1.272019649);
  }
`;

const Icon = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
`;

function IconButton(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Container>
      <Icon {...props} />
    </Container>
  );
}

export default IconButton;
