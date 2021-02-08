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

import React, { useCallback, useRef, useState } from "react";

import produce from "immer";
import { nanoid } from "nanoid";
import { useSelector } from "react-redux";

interface Props {
  name: string;
  controller: any;
  placeholder?: string;
  singleItemLabel?: string;
  fileBrowser?: boolean;
}

interface ListItemProps {
  value: string;
  isEditing?: boolean;
  placeholder?: string;
  onSubmit?: (value: string) => any;
  onCancel?: () => any;
}

interface Item {
  value: string;
  id: string;
}

const reducer = produce((draft: Item[], action) => {
  const { type, payload } = action;
  switch (type) {
    case "ADD_ITEM": {
      draft.push({ value: "", id: payload.id });
      break;
    }
    case "DELETE_ITEM": {
      const index = draft.findIndex((i) => i.id === payload.id);
      if (index !== -1) {
        draft.splice(index, 1);
      }
      break;
    }
    case "UPDATE_ITEM": {
      const index = draft.findIndex((i) => i.id === payload.id);
      if (index !== -1) {
        // If the item is empty remove it.
        if (payload.value.trim() === "") {
          draft.splice(index, 1);
        } else {
          draft[index].value = payload.value;
        }
      }
      break;
    }
    case "UPSERT_ITEMS": {
      const index = draft.findIndex((i) => i.id === payload.id);
      if (index !== -1 && payload.values.length > 0) {
        // Update value of the selected input with the first value in the array.
        draft[index].value = payload.values[0];

        // Give all the values an ID.
        const items = payload.values.map((v: string) => ({
          value: v,
          id: nanoid(),
        }));

        // Remove the first item since it has already been set.
        items.shift();

        // Insert the remaining items.
        draft.splice(index + 1, 0, ...items);
      }
      break;
    }
  }
});

function ListItem({
  value,
  isEditing,
  placeholder,
  onSubmit,
  onCancel,
}: ListItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  if (isEditing) {
    return (
      <div>
        <input
          ref={inputRef}
          defaultValue={value ?? ""}
          placeholder={placeholder}
        />
        <button
          onClick={() => {
            console.log("submit", inputRef.current?.value);
            onSubmit?.(inputRef.current?.value ?? "");
          }}
        >
          OK
        </button>
        <button
          onClick={() => {
            onCancel?.();
          }}
        >
          Cancel
        </button>
      </div>
    );
  }
  return (
    <div className="elyra-stringArrayControl-listRow">
      <div className="elyra-stringArrayControl-listItem">{value}</div>
      <div className="elyra-stringArrayControl-listActions">
        <div className="elyra-actionItem">
          <div className="elyra-icon elyra-actionItemIcon elyra-item-edit" />
        </div>
        <div className="elyra-actionItem">
          <div className="elyra-icon elyra-actionItemIcon elyra-item-delete" />
        </div>
      </div>
    </div>
  );
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

  const [editingID, setEditingID] = useState<string>();

  const items: Item[] = useSelector(
    (state: any) => state.propertiesReducer[name]
  );

  const handleAction = useCallback(
    (action) => {
      const newItems = reducer(items, action);
      controllerRef.current.updatePropertyValue({ name }, newItems);
    },
    [items, name]
  );

  const handleChooseFile = useCallback(
    async (id) => {
      const { actionHandler } = controllerRef.current.getHandlers();
      const values = await actionHandler?.("browse_file", undefined, {
        canSelectMany: true,
        defaultUri: items.find((i) => i.id === id)?.value,
      });
      handleAction({
        type: "UPSERT_ITEMS",
        payload: { id: id, values },
      });
    },
    [handleAction, items]
  );

  return (
    <div style={{ marginTop: "9px" }}>
      <div style={{ padding: "1px", marginBottom: "1px" }}>
        {items.map((item) => (
          <ListItem
            key={item.id}
            value={item.value}
            placeholder={placeholder}
            isEditing={item.id === editingID}
            onSubmit={(value) => {
              setEditingID(undefined);
              handleAction({
                type: "UPDATE_ITEM",
                payload: { id: item.id, value },
              });
            }}
            onCancel={() => {
              setEditingID(undefined);
              // delete the current item, since we canceled.
              handleAction({
                type: "DELETE_ITEM",
                payload: { id: item.id },
              });
            }}
          />
          // <div key={item.id}>
          //   <input
          //     value={item.value ?? ""}
          //     placeholder={placeholder}
          //     onChange={(e) => {
          //       handleAction({
          //         type: "UPDATE_ITEM",
          //         payload: { id: item.id, value: e.target.value },
          //       });
          //     }}
          //   />
          //   {fileBrowser ? (
          //     <button
          //       onClick={() => {
          //         handleChooseFile(item.id);
          //       }}
          //     >
          //       B
          //     </button>
          //   ) : null}
          //   <button
          //     onClick={() => {
          //       handleAction({
          //         type: "DELETE_ITEM",
          //         payload: { id: item.id },
          //       });
          //     }}
          //   >
          //     X
          //   </button>
          // </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <button
          onClick={() => {
            const id = nanoid();
            setEditingID(id);
            handleAction({
              type: "ADD_ITEM",
              payload: { id },
            });
          }}
          style={{ marginTop: "4px", marginRight: "4px" }}
        >
          Add {singleItemLabel ?? "Item"}
        </button>
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
