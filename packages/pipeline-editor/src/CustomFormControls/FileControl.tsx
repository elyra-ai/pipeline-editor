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

import { useCallback, useRef } from "react";

import { useSelector } from "react-redux";
import styled from "styled-components";

import { createControl, useControlState, BaseProps } from "./utils";

interface Props extends BaseProps {
  placeholder?: string;
}

const Container = styled.div`
  margin-top: 9px;
  width: 100%;
  max-width: 500px;
  display: flex;
`;

function FileComponent({ name, controller, placeholder }: Props) {
  const [path, setPath] = useControlState<string>(name, controller);

  const isError: boolean = useSelector(
    (state: any) => state.errorMessagesReducer[name]?.type === "error"
  );

  const controllerRef = useRef(controller);
  const handleChooseFile = useCallback(async () => {
    const { actionHandler } = controllerRef.current.getHandlers();
    const values = await actionHandler?.("browse_file", undefined, {
      canSelectMany: false,
      defaultUri: path,
      filters: { Notebook: ["ipynb"] }, // TODO: this should be specified via node definition
    });
    //  Don't set if nothing was chosen.
    if (values !== undefined && values.length > 0) {
      setPath(values[0]);
    }
  }, [path, setPath]);

  return (
    <Container className={isError ? "error" : undefined}>
      <input
        type="text"
        value={path ?? ""}
        placeholder={placeholder}
        disabled
      />
      <button
        onClick={() => {
          handleChooseFile();
        }}
      >
        Browse
      </button>
    </Container>
  );
}

export default createControl("pipeline-editor-file-control", FileComponent);
