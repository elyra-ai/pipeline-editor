import React, { useState } from "react";

interface Props {
  helperText: string;
}

function BooleanComponent({ helperText }: Props) {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div style={{ display: "flex" }} onClick={() => setIsChecked(!isChecked)}>
      <div
        className={
          isChecked ? "properties-checkbox checked" : "properties-checkbox"
        }
        tabIndex={0}
        role="checkbox"
        aria-checked={isChecked ? "true" : "false"}
        aria-label=""
      />
      <div
        className="properties-control-description"
        style={{ userSelect: "none" }}
      >
        {helperText}
      </div>
    </div>
  );
}

export class BooleanControl {
  helperText: string;

  static id(): string {
    return "pipeline-editor-boolean-control";
  }

  constructor(propertyId: any, controller: any, data: any, tableInfo: any) {
    console.log("propertyId", propertyId);
    console.log("controller", controller);
    console.log("data", data);
    console.log("tableInfo", tableInfo);
    this.helperText = data.helperText;
  }

  renderControl() {
    return <BooleanComponent helperText={this.helperText} />;
  }
}

export default BooleanControl;
