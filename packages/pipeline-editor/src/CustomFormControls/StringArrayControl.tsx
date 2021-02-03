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

import { nanoid } from "nanoid";
import { useSelector } from "react-redux";

interface Props {
  name: string;
  controller: any;
  placeholder?: string;
  singleItemLabel?: string;
  fileBrowser?: boolean;
}

// NOTE: This uses IDs which is a breaking change to pipeline spec. Would
// require a migration.
function StringArrayComponent({
  name,
  controller,
  placeholder,
  singleItemLabel,
  fileBrowser,
}: Props) {
  const controllerRef = useRef(controller);

  const items: { value: string; id: string }[] = useSelector(
    (state: any) => state.propertiesReducer[name]
  );

  console.log(items);

  const handleAddItem = useCallback(() => {
    controllerRef.current.updatePropertyValue({ name }, [
      ...items,
      { value: "", id: nanoid() },
    ]);
  }, [items, name]);

  const handleDeleteItem = useCallback(
    (id) => {
      const newValues = items.filter((item) => item.id !== id);
      controllerRef.current.updatePropertyValue({ name }, newValues);
    },
    [items, name]
  );

  const handleInputChange = useCallback(
    (e, id) => {
      const newValues = items.map((item) => {
        if (item.id === id) {
          return { ...item, value: e.target.value };
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
        {items.map((item) => (
          <div key={item.id}>
            <input
              value={item.value}
              placeholder={placeholder}
              onChange={(e) => {
                handleInputChange(e, item.id);
              }}
            />
            {fileBrowser ? (
              <button
                onClick={() => {
                  handleChooseFile(item.id);
                }}
              >
                B
              </button>
            ) : null}
            <div
              onClick={() => {
                handleDeleteItem(item.id);
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
