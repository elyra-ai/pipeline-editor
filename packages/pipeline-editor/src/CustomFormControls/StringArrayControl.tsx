/*
 * Copyright 2018-2022 Elyra Authors
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

import {
  getErrorMessages,
  getStringArrayValidators,
  StringArrayValidatorOptions,
} from "@elyra/pipeline-services";
import produce from "immer";
import styled, { useTheme } from "styled-components";

import IconButton from "../IconButton";
import {
  createControl,
  useControlState,
  useHandlers,
  usePropertyID,
} from "./control";
import { ErrorMessage } from "./ErrorMessage";

interface Props extends StringArrayValidatorOptions {
  placeholder?: string;
  format?: "file";
  canRefresh?: boolean;
  pipeline_defaults?: string[];
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
  margin-bottom: 4px;
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

const ReadOnlyListItem = styled.div`
  display: flex;
  margin-right: 2px;
  margin-left: 2px;
  line-height: 24px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight};
  font-size: ${({ theme }) => theme.typography.fontSize};
  color: ${({ theme }) => theme.palette.text.primary};

  & .left {
    flex: 1;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .right {
    float: right;
    text-align: right;
    white-space: nowrap;
  }
`;

const InputGroup = styled.div`
  display: flex;
  margin-bottom: 3px;

  & button:first-of-type {
    margin: 0 4px;
  }
`;

const InputContainer = styled.div.attrs({ className: "elyra-inputContainer" })`
  background-color: ${({ theme }) => theme.palette.background.secondary};
  border: 1px solid ${({ theme }) => theme.palette.inputBorder};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  height: 24px;
  max-width: 320px;
  margin-right: 4px;
  box-sizing: border-box;

  & input {
    background-color: ${({ theme }) => theme.palette.background.input};
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
    border: 1px solid ${({ theme }) => theme.palette.inputBorder};
    border-radius: ${({ theme }) => theme.shape.borderRadius};
  }

  & input:hover {
    border: 2px solid ${({ theme }) => theme.palette.highlight.hover};
    border-radius: ${({ theme }) => theme.shape.borderRadius};
  }

  & input:focus {
    border: 2px solid ${({ theme }) => theme.palette.focus};
    border-radius: ${({ theme }) => theme.shape.borderRadius};
  }
`;

const Actions = styled.div.attrs({ className: "elyra-stringArrayActions" })`
  display: none;
  position: absolute;
  right: 0;
  top: 0;
`;

const ListRow = styled.div.attrs({ className: "elyra-listRow" })`
  position: relative;
  border: 1px solid ${({ theme }) => theme.palette.inputBorder};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  background-color: ${({ theme }) => theme.palette.background.input};

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

export function StringArrayControl({
  uniqueItems,
  minItems,
  maxItems,
  keyValueEntries,
  placeholder,
  format,
  canRefresh,
  pipeline_defaults,
}: Props) {
  const propertyID = usePropertyID();
  const [items = [], setItems] = useControlState<string[]>();

  const [editingIndex, setEditingIndex] = useState<number | "new">();

  const trimItems = (itemsToTrim: string[]): string[] => {
    if (keyValueEntries) {
      const trimmedItems = itemsToTrim.map((item: string): string => {
        const parts = item.split("=");
        const key = parts[0].trim();
        const value = parts.slice(1).join("=").trim();
        return key && value ? `${key}=${value}` : item.trim();
      });
      return trimmedItems;
    }
    return itemsToTrim.map((i: string) => i.trim());
  };

  const handleAction = useCallback(
    (action) => {
      const newItems = reducer(items, action);
      setItems(trimItems(newItems));
    },
    [items, setItems]
  );

  const { actionHandler } = useHandlers();
  const handleChooseFiles = useCallback(
    async (index) => {
      const newItems = await actionHandler?.("browse_file", undefined, {
        canSelectMany: true,
        defaultUri: items[index],
        propertyID,
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
    [actionHandler, handleAction, items, propertyID]
  );

  const handleRefreshProperties = useCallback(async () => {
    const updatedProperties = await actionHandler?.("refresh_properties");
    if (updatedProperties?.[propertyID]) {
      setItems(trimItems(updatedProperties[propertyID]));
    }
  }, [actionHandler, propertyID, setItems]);

  // TODO: validate string arrays.
  const validators = getStringArrayValidators({
    uniqueItems,
    minItems,
    maxItems,
    keyValueEntries,
  });

  let errorMessages = getErrorMessages(items, validators);

  return (
    <Container className={errorMessages.length > 0 ? "error" : undefined}>
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
        {pipeline_defaults
          ?.filter((item) => !items.includes(item))
          ?.map((item, index) => (
            <ListRow key={`${item}${index}`} data-testid="list-row">
              <ReadOnlyListItem>
                <div className="left">{item}</div>
                <div className="right">(pipeline default)</div>
              </ReadOnlyListItem>
            </ListRow>
          ))}
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
      {errorMessages[0] !== undefined && (
        <ErrorMessage>{errorMessages[0]}</ErrorMessage>
      )}
    </Container>
  );
}

export default createControl("StringArrayControl", StringArrayControl);
