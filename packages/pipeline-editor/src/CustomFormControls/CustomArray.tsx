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

import { useCallback } from "react";

import { ArrayFieldTemplateProps } from "@rjsf/core";

const renderDefaults = (
  items: any[],
  props: any
): React.ReactElement | undefined => {
  const allRendered = [];
  if (items.length === 0) {
    return undefined;
  } else if (props.schema.items?.type === "object") {
    for (const item of items) {
      const itemRendered = [];
      for (const key in props.schema.items.properties ?? {}) {
        const propertySchema = props.schema.items.properties[key];
        if (propertySchema.type === "boolean") {
          itemRendered.push(
            <div className="checkbox">
              <label>
                <input readOnly type="checkbox" checked={item[key]} />
                <span className="control-label">
                  {props.schema.items.properties[key].title}
                </span>
              </label>
            </div>
          );
        } else {
          itemRendered.push(
            <div key={`${key}-defaultValue`} style={{ margin: "5px" }}>
              <label className="control-label">{`${props.schema.items.properties[key].title}: `}</label>
              <input readOnly value={item[key]} className="form-control" />
            </div>
          );
        }
      }
      allRendered.push(
        <div key={`${props.id}-defaultValues`} className="array-item">
          <label
            className="control-label"
            style={{ color: "var(--jp-content-font-color2)" }}
          >
            (pipeline default)
          </label>
          {itemRendered}
        </div>
      );
    }
  } else {
    for (const item of items) {
      if (item === null || item === undefined || item === "") {
        return undefined;
      } else {
        return (
          <div className="array-pipelineDefaults form-control">
            <div className="left">{item}</div>
            <div className="right">(pipeline default)</div>
          </div>
        );
      }
    }
  }
  return <div>{allRendered}</div>;
};

/**
 * React component that allows for custom add / remove buttons in the array
 * field component.
 */
export const ArrayTemplate: React.FC<ArrayFieldTemplateProps> = (props) => {
  const renderedDefaults = renderDefaults(
    props.uiSchema.pipeline_defaults ?? [],
    props
  );
  const handleChooseFile = useCallback(async () => {
    props.formContext.onFileRequested({
      canSelectMany: true,
      filters: { File: props.uiSchema.extensions },
      propertyID: props.idSchema.$id.replace("root_component_parameters_", ""),
    });
  }, [props]);
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
      {renderedDefaults}
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
      {props.uiSchema?.files && (
        <button
          className="jp-mod-styled jp-mod-reject"
          style={{ marginLeft: "5px" }}
          onClick={handleChooseFile}
        >
          {"Browse"}
        </button>
      )}
    </div>
  );
};
