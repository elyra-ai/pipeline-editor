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

import { FieldTemplateProps } from "@rjsf/core";

export const CustomFieldTemplate: React.FC<FieldTemplateProps> = (props) => {
  let children = props.children;
  if (props.uiSchema["ui:field"] === "hidden") {
    return <div />;
  }
  if (props.uiSchema["ui:readonly"]) {
    children = (
      <div style={{ paddingTop: "8px" }}>
        {props.formData ?? props.schema.default}
      </div>
    );
  }
  if (
    props.schema.uniqueItems &&
    (props.schema.items as any)?.enum?.length === 0
  ) {
    children = (
      <div style={{ paddingTop: "8px" }}>
        No pipeline parameters are defined.
      </div>
    );
  } else if (props.schema.uniqueItems && props.formData) {
    const filteredItems = props.formData.filter((item: any) => {
      return (props.schema.items as any)?.enum?.includes(item);
    });
    if (filteredItems.length !== props.formData.length) {
      props.onChange(filteredItems);
    }
  }
  const requiredError = props.required && props.formData === undefined;
  const hasError = props.rawErrors || requiredError;
  return (
    <div
      className={`${props.classNames} ${
        props.schema.properties?.value &&
        props.schema.properties?.widget &&
        "small-object-field"
      } ${props.schema.oneOf ? "field-oneOf" : ""}`}
      id={props.id}
    >
      {hasError && <div className="errorIndicator" />}
      {props.schema.title !== undefined && props.schema.title !== " " ? (
        <div
          className={`label-header ${
            props.uiSchema["ui:field"] === "header" ? "category-header" : ""
          }`}
        >
          <label className="control-label" htmlFor={props.id}>
            {`${props.schema.title}${props.required ? "*" : ""}`}
          </label>
          {props.schema.description && (
            <div className="description-wrapper">
              <div className="description-button">?</div>
              <p
                className={`field-description ${
                  props.schema.title.length < 10 ? "short-title" : ""
                }`}
              >
                {props.schema.description}
              </p>
            </div>
          )}
        </div>
      ) : undefined}
      {children}
      {props.errors}
      {requiredError && <li className="text-danger">is a required property</li>}
    </div>
  );
};
