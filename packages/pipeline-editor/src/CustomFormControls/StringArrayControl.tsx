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
import styled from "styled-components";

import IconButton from "../IconButton";

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

const StyledIconButton = styled(IconButton)`
  width: 16px;
  height: 20px;
  padding: 2px;
  margin-right: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ListItemValue = styled.div`
  display: block;
  margin-right: 47px;
  margin-left: 2px;
  line-height: 24px;
  max-width: 90%;
  font-family: var(--elyra-font-family-sans);
  font-weight: var(--elyra-font-weight-sans);
  font-size: var(--elyra-font-size-sans);
  color: var(--elyra-color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InputGroup = styled.div`
  display: flex;

  & button:first-of-type {
    margin: 0 4px;
  }
`;

const InputContainer = styled.div`
  background-color: var(--elyra-color-arrayInput-bg);
  border: 1px solid var(--elyra-color-arrayInput-border);
  height: 24px;
  max-width: 320px;
  margin-right: 4px;
  box-sizing: border-box;

  & input {
    background-color: inherit;
    color: var(--elyra-color-arrayInput-text);
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    line-height: inherit;
    border: none;
    font-family: inherit;
    font-size: inherit;
    resize: none;
    padding: 4px;
  }

  & input:focus {
    outline: 1px solid var(--elyra-color-focus) !important;
    outline-offset: 0px;
  }
`;

const Actions = styled.div`
  display: none;
  position: absolute;
  right: 0;
  top: 0;
`;

const ListRow = styled.div`
  position: relative;

  &:hover {
    background-color: var(--vscode-list-hoverBackground);
  }

  &:hover ${Actions} {
    display: flex;
  }
`;

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
      <InputGroup>
        <InputContainer>
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
        </InputContainer>
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
      </InputGroup>
    );
  }
  return (
    <ListRow
      data-testid="list-row"
      onDoubleClick={() => {
        onEdit?.();
      }}
    >
      <ListItemValue>{value}</ListItemValue>
      <Actions>
        <StyledIconButton
          title="Edit"
          className="elyra-icon elyra-item-edit"
          onClick={() => {
            onEdit?.();
          }}
        />

        {!!canBrowseFiles && (
          <StyledIconButton
            title="Browse"
            className="elyra-icon elyra-item-folder"
            onClick={() => {
              onChooseFiles?.();
            }}
          />
        )}
        <StyledIconButton
          title="Delete"
          className="elyra-icon  elyra-item-delete"
          onClick={() => {
            onDelete?.();
          }}
        />
      </Actions>
    </ListRow>
  );
}

const Container = styled.div`
  margin-top: 9px;
`;

const ListGroup = styled.div`
  padding: 1px;
  margin-bottom: 1px;
`;

const ButtonGroup = styled.div`
  display: flex;
  margin-top: 4px;
  & button {
    margin-right: 4px;
  }
`;

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
    <Container>
      <ListGroup>
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
      </ListGroup>

      {editingIndex !== "new" && (
        <ButtonGroup>
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
        </ButtonGroup>
      )}
    </Container>
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
