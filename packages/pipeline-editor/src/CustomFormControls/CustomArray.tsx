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

import { ArrayFieldTemplateProps } from "@rjsf/core";

/**
 * React component that allows for custom add / remove buttons in the array
 * field component.
 */
export const ArrayTemplate: React.FC<ArrayFieldTemplateProps> = (props) => {
  return (
    <div className={props.className}>
      {props.items.map((item) => {
        return (
          <div key={item.key} className={item.className}>
            {item.children}
            <button
              className="jp-mod-styled jp-mod-warn"
              onClick={item.onDropIndexClick(item.index)}
              disabled={!item.hasRemove}
            >
              {"Remove"}
            </button>
          </div>
        );
      })}
      {props.uiSchema.pipeline_defaults?.map((item: any) => {
        if (item === null || item === "") {
          return undefined;
        }
        return (
          <div className="array-pipelineDefaults form-control">
            <div className="left">{item}</div>
            <div className="right">(pipeline default)</div>
          </div>
        );
      })}
      {props.canAdd && (
        <button
          className="jp-mod-styled jp-mod-reject"
          onClick={props.onAddClick}
        >
          {"Add"}
        </button>
      )}
      {props.uiSchema.canRefresh && (
        <button
          className="jp-mod-styled jp-mod-reject"
          style={{ marginLeft: "5px" }}
          onClick={() =>
            props.formContext?.onPropertiesUpdateRequested(
              props.formContext.formData
            )
          }
        >
          {"Refresh"}
        </button>
      )}
    </div>
  );
};
