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

import Form, {
  ArrayFieldTemplateProps,
  FieldTemplateProps,
  UiSchema,
} from "@rjsf/core";

import { Message } from "./PropertiesPanel";

interface Props {
  pipelineFlow: any;
  propertiesSchema?: any;
  onChange?: (data: any) => any;
}

/**
 * React component that allows for custom add / remove buttons in the array
 * field component.
 */
const ArrayTemplate: React.FC<ArrayFieldTemplateProps> = (props) => {
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
      {props.canAdd && (
        <button
          className="jp-mod-styled jp-mod-reject"
          onClick={props.onAddClick}
        >
          {"Add"}
        </button>
      )}
    </div>
  );
};

const CustomFieldTemplate: React.FC<FieldTemplateProps> = (props) => {
  return (
    <div className={props.classNames}>
      {props.schema.title !== undefined && props.schema.title !== " " ? (
        <div className="label-header">
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
      {props.children}
      {props.errors}
    </div>
  );
};

function PipelineProperties({
  pipelineFlow,
  propertiesSchema,
  onChange,
}: Props) {
  if (propertiesSchema === undefined) {
    return <Message>No pipeline properties defined.</Message>;
  }

  const uiSchema: UiSchema = {};
  for (const field in propertiesSchema.properties) {
    const properties = propertiesSchema.properties[field];
    if (typeof properties !== "boolean" && properties.uihints) {
      uiSchema[field] = properties.uihints;
    }
  }

  return (
    <Form
      formData={pipelineFlow?.pipelines?.[0]?.app_data?.properties ?? {}}
      uiSchema={uiSchema}
      schema={propertiesSchema as any}
      onChange={(e) => onChange?.(e.formData)}
      id={pipelineFlow?.id}
      ArrayFieldTemplate={ArrayTemplate}
      FieldTemplate={CustomFieldTemplate}
      className={"elyra-formEditor"}
    />
  );
}

export default PipelineProperties;
