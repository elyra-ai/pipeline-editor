import React from "react";

export class StringArrayControl extends React.Component {
  parameter: string;
  controller: any;
  values: string[];
  fileBrowser?: boolean;
  singleItemLabel?: string;
  placeholder?: string;

  static id(): string {
    return "pipeline-editor-string-array-control";
  }

  constructor(parameters: any, controller: any, data: any) {
    super({});
    console.log(parameters);
    if (data) {
      this.singleItemLabel = data.single_item_label;
      this.placeholder = data.placeholder;
      this.fileBrowser = data.filebrowser;
    }
    this.parameter = parameters["name"];
    this.controller = controller;
    this.values = this.controller.getPropertyValue(this.parameter);
    if (!this.values) {
      this.controller.updatePropertyValue(this.parameter, []);
      this.values = [];
    }
    console.log(this.values);

    this.deleteHandler = this.deleteHandler.bind(this);
    this.onTextAreaChange = this.onTextAreaChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.addHandler = this.addHandler.bind(this);
  }

  deleteHandler = (index: number): void => {
    delete this.values[index];
    this.controller.updatePropertyValue({ name: this.parameter }, this.values);
  };

  onTextAreaChange = (props: any): void => {
    this.values = props.value.split("\n");
  };

  onInputChange = (event: any, index: number): void => {
    event.target.value
      .split("\n")
      .forEach((element: string, valueIndex: number): void => {
        if (valueIndex === 0) {
          this.values[index] = element;
        } else {
          this.values.splice(index, 0, element);
        }
      });
    this.values[index] = event.target.value;
    this.controller.updatePropertyValue({ name: this.parameter }, this.values);
  };

  addHandler = (): void => {
    this.values.push("");
    this.controller.updatePropertyValue({ name: this.parameter }, this.values);
  };

  renderControl(): any {
    this.values = this.controller.getPropertyValue(this.parameter);
    return (
      <div>
        <div id={this.parameter}>
          {this.values.map((value: any, index: number) => (
            <div
              key={this.parameter + index + "ControlGroup"}
              className={"elyra-StringArrayControl-entry"}
            >
              <input
                key={this.parameter + index + "InputGroup"}
                className="jp-InputGroup"
                defaultValue={value}
                placeholder={this.placeholder}
                onChange={(event: any): void => {
                  this.onInputChange(event, index);
                }}
              />
              <div
                className="jp-Button"
                onClick={(): void => {
                  const actionHandler = this.controller.getHandlers()
                    .actionHandler;
                  if (typeof actionHandler === "function") {
                    actionHandler(
                      "add_dependencies",
                      this.controller.getAppData(),
                      { parameter_ref: "dependencies", index: index }
                    );
                  }
                }}
              ></div>
              <div
                onClick={(): void => {
                  this.deleteHandler(index);
                }}
              >
                {" "}
                X{" "}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex" }}>
          <div
            className="jp-Button"
            onClick={this.addHandler}
            style={{ marginTop: 8 }}
          >
            Add {this.singleItemLabel ? this.singleItemLabel : "item"}
          </div>
        </div>
      </div>
    );
  }
}
export default StringArrayControl;
