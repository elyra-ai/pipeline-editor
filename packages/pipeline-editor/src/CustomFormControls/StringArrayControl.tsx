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
  singleItemLabel?: string;
  fileBrowser?: boolean;
}

function StringArrayComponent({
  name,
  controller,
  placeholder,
  singleItemLabel,
  fileBrowser,
}: Props) {
  const controllerRef = useRef(controller);

  const items: string[] = useSelector(
    (state: any) => state.propertiesReducer[name]
  );

  const handleAddItem = useCallback(() => {
    controllerRef.current.updatePropertyValue({ name }, [...items, ""]);
  }, [items, name]);

  const handleDeleteItem = useCallback(
    (index) => {
      const newValues = items.filter((_, i) => i !== index);
      controllerRef.current.updatePropertyValue({ name }, newValues);
    },
    [items, name]
  );

  const handleInputChange = useCallback(
    (e, index) => {
      const newValues = items.map((item, i) => {
        if (i === index) {
          return e.target.value;
        }
        return item;
      });
      controllerRef.current.updatePropertyValue({ name }, newValues);
    },
    [items, name]
  );

  const handleChooseFile = useCallback((index) => {
    //   const actionHandler = this.controller.getHandlers().actionHandler;
    //   if (typeof actionHandler === "function") {
    //     const newValue = await actionHandler(
    //       "browse_file",
    //       this.controller.getAppData(),
    //       {
    //         parameter_ref: "browse_file",
    //         propertyValue: this.values,
    //         index: index,
    //       }
    //     );
    //   }
  }, []);

  return (
    <div>
      <div>
        {items.map((item, i) => (
          <div key={i}>
            <input
              defaultValue={item}
              placeholder={placeholder}
              onChange={(e) => {
                handleInputChange(e, i);
              }}
            />
            {fileBrowser ? (
              <button
                onClick={() => {
                  handleChooseFile(i);
                }}
              >
                B
              </button>
            ) : null}
            <div
              onClick={() => {
                handleDeleteItem(i);
              }}
            >
              X
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <div onClick={handleAddItem} style={{ marginTop: 8 }}>
          Add {singleItemLabel ?? "item"}
        </div>
      </div>
    </div>
  );
}

export class StringArrayControl {
  static id() {
    return "pipeline-editor-string-array-control";
  }

  constructor(
    private propertyId: { name: string },
    private controller: any,
    private data: any
  ) {}

  renderControl() {
    return (
      <StringArrayComponent
        name={this.propertyId.name}
        controller={this.controller}
        {...this.data}
      />
    );
  }
}
export default StringArrayControl;
