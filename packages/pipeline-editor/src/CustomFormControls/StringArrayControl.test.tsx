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

import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { render, waitFor, screen, fireEvent } from "../test-utils";
import StringArrayControl, { reducer, ListItem } from "./StringArrayControl";
import { createPropertiesStore } from "./test-utils";

const propertyId = { name: "string-array" };

describe("reducer - DELETE_ITEM", () => {
  it("doesn't delete anything if the item doesn't exist", () => {
    const result = reducer(["one"], {
      type: "DELETE_ITEM",
      payload: { index: 1 },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe("one");
  });

  it("deletes an item", () => {
    const result = reducer(["one"], {
      type: "DELETE_ITEM",
      payload: { index: 0 },
    });
    expect(result).toHaveLength(0);
  });
});

describe("reducer - UPSERT_ITEM", () => {
  it("appends an item if it doesn't exist", () => {
    const result = reducer(["one"], {
      type: "UPSERT_ITEM",
      payload: { value: "two" },
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toBe("one");
    expect(result[1]).toBe("two");
  });

  it("updates an item if it exists", () => {
    const result = reducer(["one"], {
      type: "UPSERT_ITEM",
      payload: { value: "new one", index: 0 },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe("new one");
  });

  it("removes the item if value is empty", () => {
    const result = reducer(["one"], {
      type: "UPSERT_ITEM",
      payload: { value: "", index: 0 },
    });
    expect(result).toHaveLength(0);
  });

  it("doesn't add the item if value is empty", () => {
    const result = reducer(["one"], {
      type: "UPSERT_ITEM",
      payload: { value: "" },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe("one");
  });
});

describe("reducer - UPSERT_ITEMS", () => {
  it("appends a list of items", () => {
    const result = reducer([] as any[], {
      type: "UPSERT_ITEMS",
      payload: {
        index: undefined,
        items: ["one", "two"],
      },
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toBe("one");
    expect(result[1]).toBe("two");
  });

  it("inserts a list of items at id", () => {
    const result = reducer(["one", "two", "five", "six"], {
      type: "UPSERT_ITEMS",
      payload: {
        index: 1,
        items: ["two", "three", "four"],
      },
    });
    expect(result).toHaveLength(6);
    expect(result[0]).toBe("one");
    expect(result[1]).toBe("two");
    expect(result[2]).toBe("three");
    expect(result[3]).toBe("four");
    expect(result[4]).toBe("five");
    expect(result[5]).toBe("six");
  });

  it("inserts nothing if items is empty", () => {
    const result = reducer(["one", "two", "five", "six"], {
      type: "UPSERT_ITEMS",
      payload: {
        index: 1,
        items: [],
      },
    });
    expect(result).toHaveLength(4);
    expect(result[0]).toBe("one");
    expect(result[1]).toBe("two");
    expect(result[2]).toBe("five");
    expect(result[3]).toBe("six");
  });
});

describe("ListItem", () => {
  it("renders", () => {
    const { container } = render(<ListItem value="Example list item" />);
    expect(container.firstChild).toHaveTextContent(/example list item/i);
  });

  it("calls onEdit when double clicked", () => {
    const handleEdit = jest.fn();
    const { rerender } = render(
      <ListItem value="Example list item" onEdit={handleEdit} />
    );
    const row = screen.getByTestId("list-row");
    userEvent.dblClick(row);
    expect(handleEdit).toHaveBeenCalledTimes(1);

    rerender(<ListItem value="Example list item" />);

    userEvent.dblClick(row);
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onEdit when edit button is clicked", () => {
    const handleEdit = jest.fn();
    const { rerender } = render(
      <ListItem value="Example list item" onEdit={handleEdit} />
    );
    const editButton = screen.getByTitle(/edit/i);
    userEvent.click(editButton);
    expect(handleEdit).toHaveBeenCalledTimes(1);

    rerender(<ListItem value="Example list item" />);

    userEvent.click(editButton);
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onChooseFiles when browse button is clicked", () => {
    const handleChooseFiles = jest.fn();
    const { rerender } = render(
      <ListItem
        value="Example list item"
        onChooseFiles={handleChooseFiles}
        canBrowseFiles
      />
    );
    const browseButton = screen.getByTitle(/browse/i);
    userEvent.click(browseButton);
    expect(handleChooseFiles).toHaveBeenCalledTimes(1);

    rerender(<ListItem value="Example list item" canBrowseFiles />);

    userEvent.click(browseButton);
    expect(handleChooseFiles).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when delete button is clicked", () => {
    const handleDelete = jest.fn();
    const { rerender } = render(
      <ListItem value="Example list item" onDelete={handleDelete} />
    );
    const editButton = screen.getByTitle(/delete/i);
    userEvent.click(editButton);
    expect(handleDelete).toHaveBeenCalledTimes(1);

    rerender(<ListItem value="Example list item" />);

    userEvent.click(editButton);
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it("should focus the input when isEditing is true", () => {
    render(<ListItem isEditing />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveFocus();
  });

  it("should not have an empty value if value is set", () => {
    render(<ListItem value="example value" isEditing />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveFocus();
    expect(input).toHaveValue("example value");
  });

  it("call onSubmit with a string when 'ok' button is pressed but value is undefined", () => {
    const handleSubmit = jest.fn();
    render(<ListItem onSubmit={handleSubmit} isEditing />);
    userEvent.click(screen.getByText(/ok/i));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith("");
  });

  it("call onSubmit when 'ok' button is pressed", () => {
    const handleSubmit = jest.fn();
    const { rerender } = render(<ListItem onSubmit={handleSubmit} isEditing />);
    userEvent.type(screen.getByRole("textbox"), "I am user entered text");
    userEvent.click(screen.getByText(/ok/i));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith("I am user entered text");

    rerender(<ListItem isEditing />);
    userEvent.click(screen.getByText(/ok/i));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("call onSubmit when 'enter' key is pressed", () => {
    const handleSubmit = jest.fn();
    const { rerender } = render(<ListItem onSubmit={handleSubmit} isEditing />);
    userEvent.type(screen.getByRole("textbox"), "I am user entered text");
    fireEvent.keyDown(screen.getByRole("textbox"), {
      key: "Enter",
      code: "Enter",
    });
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith("I am user entered text");

    rerender(<ListItem isEditing />);
    fireEvent.keyDown(screen.getByRole("textbox"), {
      key: "Enter",
      code: "Enter",
    });
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("call onCancel when 'cancel' button is pressed", () => {
    const handleCancel = jest.fn();
    const { rerender } = render(<ListItem onCancel={handleCancel} isEditing />);
    userEvent.type(screen.getByRole("textbox"), "I am user entered text");
    userEvent.click(screen.getByText(/cancel/i));
    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleCancel).toHaveBeenCalledWith();

    rerender(<ListItem isEditing />);
    userEvent.click(screen.getByText(/cancel/i));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("call onCancel when 'escape' key is pressed", () => {
    const handleCancel = jest.fn();
    const { rerender } = render(<ListItem onCancel={handleCancel} isEditing />);
    userEvent.type(screen.getByRole("textbox"), "I am user entered text");
    fireEvent.keyDown(screen.getByRole("textbox"), {
      key: "Escape",
      code: "Escape",
    });
    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleCancel).toHaveBeenCalledWith();

    rerender(<ListItem isEditing />);
    fireEvent.keyDown(screen.getByRole("textbox"), {
      key: "Escape",
      code: "Escape",
    });
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});

it("has an id", () => {
  expect(StringArrayControl.id()).toBe("StringArrayControl");
});

it("renders only a button when items is undefined", () => {
  const store = createPropertiesStore(propertyId, undefined);

  const actionHandler = jest.fn().mockResolvedValue([]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    getHandlers,
  };

  const data = {
    placeholder: undefined,
    format: undefined,
  };

  const control = new StringArrayControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  const button = screen.getByRole("button");

  expect(button).toHaveTextContent(/add item/i);
});

it("renders only a button when items is empty", () => {
  const store = createPropertiesStore(propertyId, []);

  const actionHandler = jest.fn().mockResolvedValue([]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    getHandlers,
  };

  const data = {
    placeholder: undefined,
    format: undefined,
  };

  const control = new StringArrayControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  const button = screen.getByRole("button");
  expect(button).toHaveTextContent(/add item/i);

  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
});

it("renders items", () => {
  const store = createPropertiesStore(propertyId, ["item one", "item two"]);

  const actionHandler = jest.fn().mockResolvedValue([]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    getHandlers,
  };

  const data = {
    placeholder: undefined,
    format: undefined,
  };

  const control = new StringArrayControl(propertyId, controller, data);
  const { container } = render(
    <Provider store={store}>{control.renderControl()}</Provider>
  );

  expect(container).toHaveTextContent(/item one/i);
  expect(container).toHaveTextContent(/item two/i);
});

it("renders as second button 'browse' when canBrowseFiles is true", () => {
  const store = createPropertiesStore(propertyId, []);

  const actionHandler = jest.fn().mockResolvedValue([]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    getHandlers,
  };

  const data = {
    placeholder: undefined,
    format: "file",
  };

  const control = new StringArrayControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  const buttons = screen.getAllByRole("button");
  expect(buttons[1]).toHaveTextContent(/browse/i);
});

it("shows an input with 'ok' and 'cancel' buttons when 'add item' is clicked", async () => {
  const store = createPropertiesStore(propertyId, []);

  const actionHandler = jest.fn().mockResolvedValue([]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    getHandlers,
  };

  const data = {
    placeholder: undefined,
    format: undefined,
  };

  const control = new StringArrayControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByText(/add item/i));

  expect(screen.queryByText(/add item/i)).not.toBeInTheDocument();

  expect(screen.getByRole("textbox")).toBeInTheDocument();
  expect(screen.getByText(/ok/i)).toBeInTheDocument();
  expect(screen.getByText(/cancel/i)).toBeInTheDocument();

  userEvent.click(screen.getByText(/cancel/i));

  expect(screen.queryByText(/add item/i)).toBeInTheDocument();
});

it("adds nothing to list if no files are chosen", async () => {
  const store = createPropertiesStore(propertyId, []);

  const updatePropertyValue = jest.fn();

  const actionHandler = jest.fn().mockResolvedValue([]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    updatePropertyValue,
    getHandlers,
  };

  const data = {
    placeholder: undefined,
    format: "file",
  };

  const control = new StringArrayControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByText(/browse/i));

  await waitFor(() => {
    expect(updatePropertyValue).toHaveBeenCalledTimes(1);
    expect(updatePropertyValue).toHaveBeenCalledWith(propertyId, []);
  });
});

it("adds appends items to list if files are chosen", async () => {
  const store = createPropertiesStore(propertyId, ["one", "two"]);

  const updatePropertyValue = jest.fn();

  const actionHandler = jest.fn().mockResolvedValue(["three", "four"]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    updatePropertyValue,
    getHandlers,
  };

  const data = {
    placeholder: undefined,
    format: "file",
  };

  const control = new StringArrayControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByText(/browse/i));

  await waitFor(() => {
    expect(updatePropertyValue).toHaveBeenCalledTimes(1);
    expect(updatePropertyValue).toHaveBeenCalledWith(propertyId, [
      "one",
      "two",
      "three",
      "four",
    ]);
  });
});

it("calls updatePropertyValue with entered text", async () => {
  const store = createPropertiesStore(propertyId, []);

  const updatePropertyValue = jest.fn();
  const actionHandler = jest.fn().mockResolvedValue([]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    updatePropertyValue,
    getHandlers,
  };

  const data = {
    placeholder: undefined,
    format: undefined,
  };

  const control = new StringArrayControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByText(/add item/i));

  userEvent.type(screen.getByRole("textbox"), "I am user entered text");

  userEvent.click(screen.getByText(/ok/i));

  expect(updatePropertyValue).toHaveBeenCalledTimes(1);
  expect(updatePropertyValue).toHaveBeenCalledWith(propertyId, [
    "I am user entered text",
  ]);
});

it("can delete list item", async () => {
  const store = createPropertiesStore(propertyId, ["one"]);

  const updatePropertyValue = jest.fn();
  const actionHandler = jest.fn().mockResolvedValue([]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    updatePropertyValue,
    getHandlers,
  };

  const data = {
    placeholder: undefined,
    format: undefined,
  };

  const control = new StringArrayControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByTitle(/delete/i));

  expect(updatePropertyValue).toHaveBeenCalledTimes(1);
  expect(updatePropertyValue).toHaveBeenCalledWith(propertyId, []);
});

it("can edit list item", async () => {
  const store = createPropertiesStore(propertyId, ["one"]);

  const updatePropertyValue = jest.fn();
  const actionHandler = jest.fn().mockResolvedValue([]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    updatePropertyValue,
    getHandlers,
  };

  const data = {
    placeholder: undefined,
    format: undefined,
  };

  const control = new StringArrayControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByTitle(/edit/i));

  userEvent.type(screen.getByRole("textbox"), "updated one");

  userEvent.click(screen.getByText(/ok/i));

  expect(updatePropertyValue).toHaveBeenCalledTimes(1);
  expect(updatePropertyValue).toHaveBeenCalledWith(propertyId, ["updated one"]);
});

it("doesn't edit list item when canceled", async () => {
  const store = createPropertiesStore(propertyId, ["one"]);

  const updatePropertyValue = jest.fn();
  const actionHandler = jest.fn().mockResolvedValue([]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    updatePropertyValue,
    getHandlers,
  };

  const data = {
    placeholder: undefined,
    format: undefined,
  };

  const control = new StringArrayControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByTitle(/edit/i));

  userEvent.type(screen.getByRole("textbox"), "updated one");

  userEvent.click(screen.getByText(/cancel/i));

  expect(updatePropertyValue).toHaveBeenCalledTimes(0);

  userEvent.click(screen.getByTitle(/edit/i));

  expect(screen.getByRole("textbox")).toHaveValue("one");
});

it("can browse for files from list item", async () => {
  const store = createPropertiesStore(propertyId, ["one"]);

  const updatePropertyValue = jest.fn();

  const actionHandler = jest.fn().mockResolvedValue(["file.py"]);
  const getHandlers = jest.fn(() => ({
    actionHandler,
  }));

  const controller = {
    updatePropertyValue,
    getHandlers,
  };

  const data = {
    placeholder: undefined,
    format: "file",
  };

  const control = new StringArrayControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByTitle(/browse/i));

  await waitFor(() => {
    expect(updatePropertyValue).toHaveBeenCalledTimes(1);
    expect(updatePropertyValue).toHaveBeenCalledWith(propertyId, ["file.py"]);
  });
});

it("doesn't call updatePropertyValue when no files are retrieved", async () => {
  const store = createPropertiesStore(propertyId, ["one"]);

  const updatePropertyValue = jest.fn();

  const getHandlers = jest.fn(() => ({}));

  const controller = {
    updatePropertyValue,
    getHandlers,
  };

  const data = {
    placeholder: undefined,
    format: "file",
  };

  const control = new StringArrayControl(propertyId, controller, data);
  render(<Provider store={store}>{control.renderControl()}</Provider>);

  userEvent.click(screen.getByTitle(/browse/i));

  await waitFor(() => {
    expect(updatePropertyValue).toHaveBeenCalledTimes(0);
  });
});
