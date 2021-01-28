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

import React, { useState } from "react";

interface Props {
  helperText: string;
  propertyId: string;
  controller: any;
}

function BooleanComponent({ helperText, propertyId, controller }: Props) {
  const [isChecked, setIsChecked] = useState(
    controller.getPropertyValue(propertyId)
  );
  return (
    <div
      style={{ display: "flex" }}
      onClick={() => {
        controller.updatePropertyValue({ name: propertyId }, !isChecked);
        setIsChecked(!isChecked);
      }}
    >
      <div
        className={
          isChecked ? "properties-checkbox checked" : "properties-checkbox"
        }
        tabIndex={0}
        role="checkbox"
        aria-checked={isChecked ? "true" : "false"}
        aria-label=""
      />
      <div
        className="properties-control-description"
        style={{ userSelect: "none" }}
      >
        {helperText}
      </div>
    </div>
  );
}

export class BooleanControl {
  helperText: string;
  propertyId: string;
  controller: string;

  static id(): string {
    return "pipeline-editor-boolean-control";
  }

  constructor(propertyId: any, controller: any, data: any, tableInfo: any) {
    this.propertyId = propertyId["name"];
    this.controller = controller;
    this.helperText = data.helperText;
  }

  renderControl() {
    return (
      <BooleanComponent
        helperText={this.helperText}
        propertyId={this.propertyId}
        controller={this.controller}
      />
    );
  }
}

export default BooleanControl;
