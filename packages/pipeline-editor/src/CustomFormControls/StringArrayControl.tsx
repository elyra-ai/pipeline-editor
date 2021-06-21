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
import styled, { useTheme } from "styled-components";

import IconButton from "../IconButton";
import { createControl, useControlState, useHandlers } from "./control";
import { StringArrayValidatorOptions } from "./validators";

interface Props extends StringArrayValidatorOptions {
  placeholder?: string;
  format?: "file";
  canRefresh?: boolean;
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
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight};
  font-size: ${({ theme }) => theme.typography.fontSize};
  color: ${({ theme }) => theme.palette.text.primary};
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
  background-color: ${({ theme }) => theme.palette.secondary.main};
  border: 1px solid ${({ theme }) => theme.palette.inputBorder};
  height: 24px;
  max-width: 320px;
  margin-right: 4px;
  box-sizing: border-box;

  & input {
    background-color: inherit;
    color: ${({ theme }) => theme.palette.text.primary};
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
    outline: 1px solid ${({ theme }) => theme.palette.focus};
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

  &:hover ${Actions} {
    display: flex;
  }
`;

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
  const theme = useTheme();
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
        <InputContainer className="elyra-inputContainer">
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
      className="elyra-listRow"
    >
      <ListItemValue>{value}</ListItemValue>
      <Actions className="elyra-stringArrayActions">
        <StyledIconButton
          title="Edit"
          className="elyricon elyricon-edit"
          onClick={() => {
            onEdit?.();
          }}
        >
          {theme.overrides?.editIcon}
        </StyledIconButton>

        {!!canBrowseFiles && (
          <StyledIconButton
            title="Browse"
            className="elyricon elyricon-folder"
            onClick={() => {
              onChooseFiles?.();
            }}
          >
            {theme.overrides?.folderIcon}
          </StyledIconButton>
        )}
        <StyledIconButton
          title="Delete"
          className="elyricon elyricon-delete"
          onClick={() => {
            onDelete?.();
          }}
        >
          {theme.overrides?.deleteIcon}
        </StyledIconButton>
      </Actions>
    </ListRow>
  );
}

function StringArrayControl({ placeholder, format, canRefresh }: Props) {
  const [items = [], setItems] = useControlState<string[]>();

  const [editingIndex, setEditingIndex] = useState<number | "new">();

  const handleAction = useCallback(
    (action) => {
      const newItems = reducer(items, action);
      setItems(newItems);
    },
    [items, setItems]
  );

  const { actionHandler } = useHandlers();
  const handleChooseFiles = useCallback(
    async (index) => {
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
    [actionHandler, handleAction, items]
  );

  const handleRefreshProperties = useCallback(async () => {
    const updatedProperties = await actionHandler?.(
      "refresh_properties",
      undefined,
      {
        env_vars: items,
      }
    );
    setItems(updatedProperties.env_vars);
  }, [actionHandler, items, setItems]);

  // TODO: validate string arrays.

  return (
    <Container>
      <ListGroup>
        {items.map((item, index) => (
          <ListItem
            key={index}
            value={item}
            placeholder={placeholder}
            canBrowseFiles={format === "file"}
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
            Add Item
          </button>
          {format === "file" && (
            <button
              onClick={() => {
                handleChooseFiles(undefined);
              }}
            >
              Browse
            </button>
          )}
          {canRefresh && (
            <button
              onClick={() => {
                setEditingIndex(undefined);
                handleRefreshProperties();
              }}
            >
              Refresh
            </button>
          )}
        </ButtonGroup>
      )}
    </Container>
  );
}

export default createControl("StringArrayControl", StringArrayControl);
