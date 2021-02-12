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
  helperText: string;
}

function BooleanComponent({ name, controller, helperText }: Props) {
  const controllerRef = useRef(controller);

  const isChecked = useSelector((state: any) => state.propertiesReducer[name]);

  const handleToggle = useCallback(() => {
    controllerRef.current.updatePropertyValue({ name }, !isChecked);
  }, [isChecked, name]);

  return (
    <div style={{ display: "flex" }} onClick={handleToggle}>
      <div
        className={
          isChecked
            ? "elyra-icon properties-checkbox checked"
            : "elyra-icon properties-checkbox"
        }
        tabIndex={0}
        role="checkbox"
        aria-checked={isChecked ? "true" : "false"}
        aria-label=""
      />
      <div className="properties-control-description">{helperText}</div>
    </div>
  );
}

export class BooleanControl {
  static id() {
    return "pipeline-editor-boolean-control";
  }

  constructor(
    private propertyId: { name: string },
    private controller: any,
    private data: any
  ) {}

  renderControl() {
    return (
      <BooleanComponent
        name={this.propertyId.name}
        controller={this.controller}
        {...this.data}
      />
    );
  }
}

export default BooleanControl;
