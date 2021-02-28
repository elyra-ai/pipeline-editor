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

import { fireEvent, render } from "@testing-library/react";
import { Provider } from "react-redux";

import StringArrayControl, { reducer, ListItem } from "./StringArrayControl";
import { createPropertiesStore } from "./test-utils";

const propertyId = { name: "string-array" };

describe("reducer - ADD_ITEM", () => {
  it("adds an item an empty item", () => {
    const result = reducer([] as any[], {
      type: "ADD_ITEM",
      payload: { id: "1" },
    });
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe("");
    expect(result[0].id).toBe("1");
  });
});

describe("reducer - DELETE_ITEM", () => {
  it("doesn't delete anything if the item doesn't exist", () => {
    const result = reducer([{ value: "one", id: "1" }], {
      type: "DELETE_ITEM",
      payload: { id: "2" },
    });
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe("one");
    expect(result[0].id).toBe("1");
  });

  it("deletes an item", () => {
    const result = reducer([{ value: "one", id: "1" }], {
      type: "DELETE_ITEM",
      payload: { id: "1" },
    });
    expect(result).toHaveLength(0);
  });
});

describe("reducer - UPSERT_ITEM", () => {
  it("appends an item if it doesn't exist", () => {
    const result = reducer([{ value: "one", id: "1" }], {
      type: "UPSERT_ITEM",
      payload: { value: "two", id: "2" },
    });
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe("one");
    expect(result[0].id).toBe("1");
    expect(result[1].value).toBe("two");
    expect(result[1].id).toBe("2");
  });

  it("updates an item if it exists", () => {
    const result = reducer([{ value: "one", id: "1" }], {
      type: "UPSERT_ITEM",
      payload: { value: "new one", id: "1" },
    });
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe("new one");
    expect(result[0].id).toBe("1");
  });

  it("removes the item if value is empty", () => {
    const result = reducer([{ value: "one", id: "1" }], {
      type: "UPSERT_ITEM",
      payload: { value: "", id: "1" },
    });
    expect(result).toHaveLength(0);
  });

  it("doesn't add the item if value is empty", () => {
    const result = reducer([{ value: "one", id: "1" }], {
      type: "UPSERT_ITEM",
      payload: { value: "", id: "2" },
    });
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe("one");
    expect(result[0].id).toBe("1");
  });
});

describe("reducer - UPSERT_ITEMS", () => {
  it("appends a list of items", () => {
    const result = reducer([] as any[], {
      type: "UPSERT_ITEMS",
      payload: {
        id: "xxx",
        items: [
          { value: "one", id: "1" },
          { value: "two", id: "2" },
        ],
      },
    });
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe("one");
    expect(result[0].id).toBe("1");
    expect(result[1].value).toBe("two");
    expect(result[1].id).toBe("2");
  });

  it("inserts a list of items at id", () => {
    const result = reducer(
      [
        { value: "one", id: "1" },
        { value: "two", id: "2" },
        { value: "five", id: "5" },
        { value: "six", id: "6" },
      ],
      {
        type: "UPSERT_ITEMS",
        payload: {
          id: "2",
          items: [
            { value: "two", id: "2" },
            { value: "three", id: "3" },
            { value: "four", id: "4" },
          ],
        },
      }
    );
    expect(result).toHaveLength(6);
    expect(result[0].value).toBe("one");
    expect(result[1].value).toBe("two");
    expect(result[2].value).toBe("three");
    expect(result[3].value).toBe("four");
    expect(result[4].value).toBe("five");
    expect(result[5].value).toBe("six");
  });

  it("inserts nothing if items is empty", () => {
    const result = reducer(
      [
        { value: "one", id: "1" },
        { value: "two", id: "2" },
        { value: "five", id: "5" },
        { value: "six", id: "6" },
      ],
      {
        type: "UPSERT_ITEMS",
        payload: {
          id: "2",
          items: [],
        },
      }
    );
    expect(result).toHaveLength(4);
    expect(result[0].value).toBe("one");
    expect(result[1].value).toBe("two");
    expect(result[2].value).toBe("five");
    expect(result[3].value).toBe("six");
  });
});

describe("ListItem", () => {
  it("renders", () => {
    const { container } = render(<ListItem value="Example list item" />);
    expect(container.firstChild).toHaveTextContent(/example list item/i);
  });

  it("calls onEdit when double clicked", () => {
    const handleEdit = jest.fn();
    const { getByTestId, rerender } = render(
      <ListItem value="Example list item" onEdit={handleEdit} />
    );
    const row = getByTestId("list-row");
    fireEvent.doubleClick(row);
    expect(handleEdit).toHaveBeenCalledTimes(1);

    rerender(<ListItem value="Example list item" />);

    fireEvent.doubleClick(row);
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onEdit when edit button is clicked", () => {
    const handleEdit = jest.fn();
    const { getByTitle, rerender } = render(
      <ListItem value="Example list item" onEdit={handleEdit} />
    );
    const editButton = getByTitle("edit");
    fireEvent.click(editButton);
    expect(handleEdit).toHaveBeenCalledTimes(1);

    rerender(<ListItem value="Example list item" />);

    fireEvent.click(editButton);
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onChooseFiles when browse button is clicked", () => {
    const handleChooseFiles = jest.fn();
    const { getByTitle, rerender } = render(
      <ListItem
        value="Example list item"
        onChooseFiles={handleChooseFiles}
        canBrowseFiles
      />
    );
    const browseButton = getByTitle("browse");
    fireEvent.click(browseButton);
    expect(handleChooseFiles).toHaveBeenCalledTimes(1);

    rerender(<ListItem value="Example list item" canBrowseFiles />);

    fireEvent.click(browseButton);
    expect(handleChooseFiles).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when delete button is clicked", () => {
    const handleDelete = jest.fn();
    const { getByTitle, rerender } = render(
      <ListItem value="Example list item" onDelete={handleDelete} />
    );
    const editButton = getByTitle("delete");
    fireEvent.click(editButton);
    expect(handleDelete).toHaveBeenCalledTimes(1);

    rerender(<ListItem value="Example list item" />);

    fireEvent.click(editButton);
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it("should focus the input when isEditing is true", () => {
    const { getByRole } = render(<ListItem isEditing />);
    const input = getByRole("textbox");
    expect(input).toHaveFocus();
  });

  it("should not have an empty value if value is set", () => {
    const { getByRole } = render(<ListItem value="example value" isEditing />);
    const input = getByRole("textbox");
    expect(input).toHaveFocus();
    expect(input).toHaveValue("example value");
  });

  it("call onSubmit with a string when 'ok' button is pressed but value is undefined", () => {
    const handleSubmit = jest.fn();
    const { getByText } = render(
      <ListItem onSubmit={handleSubmit} isEditing />
    );
    fireEvent.click(getByText(/ok/i));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith("");
  });

  it("call onSubmit when 'ok' button is pressed", () => {
    const handleSubmit = jest.fn();
    const { getByText, getByRole, rerender } = render(
      <ListItem onSubmit={handleSubmit} isEditing />
    );
    fireEvent.change(getByRole("textbox"), {
      target: { value: "I am user entered text" },
    });
    fireEvent.click(getByText(/ok/i));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith("I am user entered text");

    rerender(<ListItem isEditing />);
    fireEvent.click(getByText(/ok/i));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("call onSubmit when 'enter' key is pressed", () => {
    const handleSubmit = jest.fn();
    const { getByRole, rerender } = render(
      <ListItem onSubmit={handleSubmit} isEditing />
    );
    fireEvent.change(getByRole("textbox"), {
      target: { value: "I am user entered text" },
    });
    fireEvent.keyDown(getByRole("textbox"), { key: "Enter", code: "Enter" });
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith("I am user entered text");

    rerender(<ListItem isEditing />);
    fireEvent.keyDown(getByRole("textbox"), { key: "Enter", code: "Enter" });
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("call onCancel when 'cancel' button is pressed", () => {
    const handleCancel = jest.fn();
    const { getByRole, getByText, rerender } = render(
      <ListItem onCancel={handleCancel} isEditing />
    );
    fireEvent.change(getByRole("textbox"), {
      target: { value: "I am user entered text" },
    });
    fireEvent.click(getByText(/cancel/i));
    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleCancel).toHaveBeenCalledWith();

    rerender(<ListItem isEditing />);
    fireEvent.click(getByText(/cancel/i));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("call onCancel when 'escape' key is pressed", () => {
    const handleCancel = jest.fn();
    const { getByRole, rerender } = render(
      <ListItem onCancel={handleCancel} isEditing />
    );
    fireEvent.change(getByRole("textbox"), {
      target: { value: "I am user entered text" },
    });
    fireEvent.keyDown(getByRole("textbox"), { key: "Escape", code: "Escape" });
    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleCancel).toHaveBeenCalledWith();

    rerender(<ListItem isEditing />);
    fireEvent.keyDown(getByRole("textbox"), { key: "Escape", code: "Escape" });
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("does nothing when 'escape' or 'enter' key is not pressed", () => {
    const handleSubmit = jest.fn();
    const handleCancel = jest.fn();
    const { getByRole } = render(
      <ListItem onCancel={handleCancel} onSubmit={handleSubmit} isEditing />
    );
    fireEvent.keyDown(getByRole("textbox"), { key: "A", code: "KeyA" });
    expect(handleCancel).toHaveBeenCalledTimes(0);
    expect(handleSubmit).toHaveBeenCalledTimes(0);
  });
});

it("has an id", () => {
  expect(StringArrayControl.id()).toBe("pipeline-editor-string-array-control");
});

it("renders only a button when items is undefined", () => {
  const store = createPropertiesStore(propertyId, undefined);

  const data = {
    placeholder: undefined,
    singleItemLabel: undefined,
    canBrowseFiles: undefined,
  };

  const control = new StringArrayControl(propertyId, {}, data);
  const { getByRole } = render(
    <Provider store={store}>{control.renderControl()}</Provider>
  );

  const button = getByRole("button");

  expect(button).toHaveTextContent(/add item/i);
});

it("renders only a button when items is empty", () => {
  const store = createPropertiesStore(propertyId, []);

  const data = {
    placeholder: undefined,
    singleItemLabel: undefined,
    canBrowseFiles: undefined,
  };

  const control = new StringArrayControl(propertyId, {}, data);
  const { getByRole, queryByRole } = render(
    <Provider store={store}>{control.renderControl()}</Provider>
  );

  const button = getByRole("button");
  expect(button).toHaveTextContent(/add item/i);

  expect(queryByRole("textbox")).not.toBeInTheDocument();
});

it("renders items", () => {
  const store = createPropertiesStore(propertyId, [
    { value: "item one", id: "1" },
    { value: "item two", id: "2" },
  ]);

  const data = {
    placeholder: undefined,
    singleItemLabel: undefined,
    canBrowseFiles: undefined,
  };

  const control = new StringArrayControl(propertyId, {}, data);
  const { container } = render(
    <Provider store={store}>{control.renderControl()}</Provider>
  );

  expect(container).toHaveTextContent(/item one/i);
  expect(container).toHaveTextContent(/item two/i);
});

it("renders custom add item button", () => {
  const store = createPropertiesStore(propertyId, []);

  const data = {
    placeholder: undefined,
    singleItemLabel: "Custom Item",
    canBrowseFiles: undefined,
  };

  const control = new StringArrayControl(propertyId, {}, data);
  const { getByRole } = render(
    <Provider store={store}>{control.renderControl()}</Provider>
  );

  const button = getByRole("button");
  expect(button).toHaveTextContent(/add custom item/i);
});

it("renders as second button 'browse' when canBrowseFiles is true", () => {
  const store = createPropertiesStore(propertyId, []);

  const data = {
    placeholder: undefined,
    singleItemLabel: undefined,
    canBrowseFiles: true,
  };

  const control = new StringArrayControl(propertyId, {}, data);
  const { getAllByRole } = render(
    <Provider store={store}>{control.renderControl()}</Provider>
  );

  const buttons = getAllByRole("button");
  expect(buttons[1]).toHaveTextContent(/browse/i);
});

it("shows an input with 'ok' and 'cancel' buttons when 'add item' is clicked", async () => {
  const store = createPropertiesStore(propertyId, []);

  const data = {
    placeholder: undefined,
    singleItemLabel: undefined,
    canBrowseFiles: undefined,
  };

  const control = new StringArrayControl(propertyId, {}, data);
  const { getByText, getByRole, queryByText } = render(
    <Provider store={store}>{control.renderControl()}</Provider>
  );

  fireEvent.click(getByText(/add item/i));

  expect(queryByText(/add item/i)).not.toBeInTheDocument();

  expect(getByRole("textbox")).toBeInTheDocument();
  expect(getByText(/ok/i)).toBeInTheDocument();
  expect(getByText(/cancel/i)).toBeInTheDocument();
});
