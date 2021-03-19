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

import { useCallback, useRef, useState } from "react";
import { useEffect } from "react";

import produce from "immer";
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

export const reducer = produce((draft: string[], action) => {
  const { type, payload } = action;
  switch (type) {
    case "DELETE_ITEM": {
      const { index } = payload;
      if (index !== undefined && index < draft.length) {
        draft.splice(index, 1);
      }
      break;
    }
    case "UPSERT_ITEM": {
      const { index } = payload;
      if (index !== undefined && index < draft.length) {
        // If the item is empty remove it.
        if (payload.value.trim() === "") {
          draft.splice(index, 1);
        } else {
          draft[index] = payload.value;
        }
      } else if (payload.value.trim() !== "") {
        draft.push(payload.value);
      }
      break;
    }
    case "UPSERT_ITEMS": {
      const { index } = payload;
      if (
        index !== undefined &&
        index < draft.length &&
        payload.items.length > 0
      ) {
        // Update value of the selected input with the first value in the array.
        draft[index] = payload.items[0];

        // Insert the remaining items.
        draft.splice(index + 1, 0, ...payload.items.slice(1));
      } else {
        draft.push(...payload.items);
      }
      break;
    }
  }
});

export function ListItem({
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
      inputRef.current!.focus();
      inputRef.current!.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className="elyra-stringArrayControl-inputWrapper">
        <div className="elyra-stringArrayControl-input">
          <input
            ref={inputRef}
            defaultValue={value ?? ""}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                onSubmit?.(inputRef.current!.value);
                return;
              }
              if (e.code === "Escape") {
                onCancel?.();
                return;
              }
            }}
          />
        </div>
        <button
          onClick={() => {
            onSubmit?.(inputRef.current!.value);
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
      data-testid="list-row"
      className="elyra-stringArrayControl-listRow"
      onDoubleClick={() => {
        onEdit?.();
      }}
    >
      <div className="elyra-stringArrayControl-listItem">{value}</div>
      <div className="elyra-stringArrayControl-listActions">
        <div className="elyra-actionItem">
          <div
            title="Edit"
            className="elyra-icon elyra-actionItemIcon elyra-item-edit"
            onClick={() => {
              onEdit?.();
            }}
          />
        </div>
        {!!canBrowseFiles && (
          <div className="elyra-actionItem">
            <div
              title="Browse"
              className="elyra-icon elyra-actionItemIcon elyra-item-folder"
              onClick={() => {
                onChooseFiles?.();
              }}
            />
          </div>
        )}
        <div className="elyra-actionItem">
          <div
            title="Delete"
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

function StringArrayComponent({
  name,
  controller,
  placeholder,
  singleItemLabel,
  canBrowseFiles,
}: Props) {
  const controllerRef = useRef(controller);

  const [editingIndex, setEditingIndex] = useState<number | "new">();

  const items: string[] = useSelector(
    (state: any) => state.propertiesReducer[name] ?? []
  );

  const handleAction = useCallback(
    (action) => {
      const newItems = reducer(items, action);
      controllerRef.current.updatePropertyValue({ name }, newItems);
    },
    [items, name]
  );

  const handleChooseFiles = useCallback(
    async (index) => {
      const { actionHandler } = controllerRef.current.getHandlers();
      const newItems = await actionHandler?.("browse_file", undefined, {
        canSelectMany: true,
        defaultUri: items[index],
      });

      if (Array.isArray(newItems)) {
        handleAction({
          type: "UPSERT_ITEMS",
          payload: {
            index,
            items: newItems,
          },
        });
      }
    },
    [handleAction, items]
  );

  return (
    <div className="elyra-stringArrayControl">
      <div className="elyra-stringArrayControl-listGroup">
        {items.map((item, index) => (
          <ListItem
            key={index}
            value={item}
            placeholder={placeholder}
            canBrowseFiles={canBrowseFiles}
            isEditing={index === editingIndex}
            onSubmit={(value) => {
              setEditingIndex(undefined);
              handleAction({
                type: "UPSERT_ITEM",
                payload: { index, value },
              });
            }}
            onCancel={() => {
              setEditingIndex(undefined);
            }}
            onDelete={() => {
              handleAction({
                type: "DELETE_ITEM",
                payload: { index },
              });
            }}
            onChooseFiles={() => {
              handleChooseFiles(index);
            }}
            onEdit={() => {
              setEditingIndex(index);
            }}
          />
        ))}
        {editingIndex === "new" && (
          <ListItem
            placeholder={placeholder}
            isEditing
            onSubmit={(value) => {
              setEditingIndex(undefined);
              handleAction({
                type: "UPSERT_ITEM",
                payload: { value },
              });
            }}
            onCancel={() => {
              setEditingIndex(undefined);
            }}
          />
        )}
      </div>

      {editingIndex !== "new" && (
        <div className="elyra-stringArrayControl-buttonGroup">
          <button
            onClick={() => {
              setEditingIndex("new");
            }}
          >
            Add {singleItemLabel ?? "Item"}
          </button>
          {!!canBrowseFiles && (
            <button
              onClick={() => {
                handleChooseFiles(undefined);
              }}
            >
              Browse
            </button>
          )}
        </div>
      )}
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
