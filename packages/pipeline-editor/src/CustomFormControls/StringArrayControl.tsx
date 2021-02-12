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
import { useEffect } from "react";

import produce from "immer";
import { nanoid } from "nanoid";
import { useSelector } from "react-redux";

interface Props {
  name: string;
  controller: any;
  placeholder?: string;
  singleItemLabel?: string;
  canBrowseFiles?: boolean;
}

interface ListItemProps {
  value?: string;
  canBrowseFiles?: boolean;
  isEditing?: boolean;
  placeholder?: string;
  onSubmit?: (value: string) => any;
  onCancel?: () => any;
  onDelete?: () => any;
  onChooseFiles?: () => any;
  onEdit?: () => any;
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
    case "UPSERT_ITEM": {
      const index = draft.findIndex((i) => i.id === payload.id);
      if (index !== -1) {
        // If the item is empty remove it.
        if (payload.value.trim() === "") {
          draft.splice(index, 1);
        } else {
          draft[index].value = payload.value;
        }
      } else if (payload.value.trim() !== "") {
        draft.push({ value: payload.value, id: payload.id });
      }
      break;
    }
    case "UPSERT_ITEMS": {
      const index = draft.findIndex((i) => i.id === payload.id);
      if (index !== -1 && payload.items.length > 0) {
        // Update value of the selected input with the first value in the array.
        draft[index].value = payload.items[0].value;

        // Insert the remaining items.
        draft.splice(index + 1, 0, ...payload.items.slice(1));
      } else {
        draft.push(...payload.items);
      }
      break;
    }
  }
});

function ListItem({
  value,
  isEditing,
  placeholder,
  canBrowseFiles,
  onSubmit,
  onCancel,
  onDelete,
  onChooseFiles,
  onEdit,
}: ListItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // We want this to be called anytime isEditing becomes true.
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div style={{ display: "flex" }}>
        <div className="elyra-stringArrayControl-input">
          <input
            ref={inputRef}
            defaultValue={value ?? ""}
            placeholder={placeholder}
          />
        </div>
        <button
          style={{ margin: "0 4px" }}
          onClick={() => {
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
    <div
      className="elyra-stringArrayControl-listRow"
      onDoubleClick={() => {
        onEdit?.();
      }}
    >
      <div className="elyra-stringArrayControl-listItem">{value}</div>
      <div className="elyra-stringArrayControl-listActions">
        <div className="elyra-actionItem">
          <div
            className="elyra-icon elyra-actionItemIcon elyra-item-edit"
            onClick={() => {
              onEdit?.();
            }}
          />
        </div>
        {!!canBrowseFiles && (
          <div className="elyra-actionItem">
            <div
              className="elyra-icon elyra-actionItemIcon elyra-item-folder"
              onClick={() => {
                onChooseFiles?.();
              }}
            />
          </div>
        )}
        <div className="elyra-actionItem">
          <div
            className="elyra-icon elyra-actionItemIcon elyra-item-delete"
            onClick={() => {
              onDelete?.();
            }}
          />
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
  canBrowseFiles,
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

  const handleChooseFiles = useCallback(
    async (id) => {
      const { actionHandler } = controllerRef.current.getHandlers();
      const values = await actionHandler?.("browse_file", undefined, {
        canSelectMany: true,
        defaultUri: items.find((i) => i.id === id)?.value,
      });

      handleAction({
        type: "UPSERT_ITEMS",
        payload: {
          id: id,
          items: values.map((v: string) => ({
            value: v,
            id: nanoid(),
          })),
        },
      });
    },
    [handleAction, items]
  );

  const actualItem = items.find((i) => editingID === i.id);

  return (
    <div style={{ marginTop: "9px" }}>
      <div style={{ padding: "1px", marginBottom: "1px" }}>
        {items.map((item) => (
          <ListItem
            key={item.id}
            value={item.value}
            placeholder={placeholder}
            canBrowseFiles={canBrowseFiles}
            isEditing={item.id === editingID}
            onSubmit={(value) => {
              setEditingID(undefined);
              handleAction({
                type: "UPSERT_ITEM",
                payload: { id: item.id, value },
              });
            }}
            onCancel={() => {
              setEditingID(undefined);
            }}
            onDelete={() => {
              handleAction({
                type: "DELETE_ITEM",
                payload: { id: item.id },
              });
            }}
            onChooseFiles={() => {
              handleChooseFiles(item.id);
            }}
            onEdit={() => {
              setEditingID(item.id);
            }}
          />
        ))}
        {editingID !== undefined && actualItem === undefined && (
          <ListItem
            placeholder={placeholder}
            isEditing
            onSubmit={(value) => {
              setEditingID(undefined);
              handleAction({
                type: "UPSERT_ITEM",
                payload: { id: editingID, value },
              });
            }}
            onCancel={() => {
              setEditingID(undefined);
            }}
          />
        )}
      </div>
      <div
        style={{
          display:
            editingID !== undefined && actualItem === undefined
              ? "none"
              : "flex",
        }}
      >
        <button
          onClick={() => {
            const id = nanoid();
            setEditingID(id);
          }}
          style={{ marginTop: "4px", marginRight: "4px" }}
        >
          Add {singleItemLabel ?? "Item"}
        </button>
        {!!canBrowseFiles && (
          <button
            onClick={() => {
              const id = nanoid();
              handleChooseFiles(id);
            }}
            style={{ marginTop: "4px", marginRight: "4px" }}
          >
            Browse
          </button>
        )}
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
