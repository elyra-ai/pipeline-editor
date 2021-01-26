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
}

function BooleanComponent({ helperText }: Props) {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div style={{ display: "flex" }} onClick={() => setIsChecked(!isChecked)}>
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

  static id(): string {
    return "pipeline-editor-boolean-control";
  }

  constructor(propertyId: any, controller: any, data: any, tableInfo: any) {
    // console.log("propertyId", propertyId);
    // console.log("controller", controller);
    // console.log("data", data);
    // console.log("tableInfo", tableInfo);
    this.helperText = data.helperText;
  }

  renderControl() {
    return <BooleanComponent helperText={this.helperText} />;
  }
}

export default BooleanControl;
