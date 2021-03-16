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

import React, { useCallback, useRef } from "react";

import { useSelector } from "react-redux";

interface Props {
  name: string;
  controller: any;
  placeholder?: string;
}

function FileComponent({ name, controller, placeholder }: Props) {
  const controllerRef = useRef(controller);

  const path: string = useSelector(
    (state: any) => state.propertiesReducer[name]
  );

  const isError: boolean = useSelector(
    (state: any) => state.errorMessagesReducer[name]?.type === "error"
  );

  const handleChooseFile = useCallback(async () => {
    const { actionHandler } = controllerRef.current.getHandlers();
    const values = await actionHandler?.("browse_file", undefined, {
      canSelectMany: false,
      defaultUri: path,
      filters: { Notebook: ["ipynb"] }, // TODO: this should be specified via node definition
    });
    //  Don't set if nothing was chosen.
    if (values !== undefined && values.length > 0) {
      controllerRef.current.updatePropertyValue({ name }, values[0]);
    }
  }, [name, path]);

  return (
    <div className={isError ? "elyra-fileControl error" : "elyra-fileControl"}>
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
    </div>
  );
}

export class FileControl {
  static id() {
    return "pipeline-editor-file-control";
  }

  constructor(
    private propertyId: { name: string },
    private controller: any,
    private data: any
  ) {}

  renderControl() {
    return (
      <FileComponent
        name={this.propertyId.name}
        controller={this.controller}
        {...this.data}
      />
    );
  }
}
export default FileControl;
