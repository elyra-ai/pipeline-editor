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

import styled from "styled-components";

import Form, {
  ArrayFieldTemplateProps,
  Field,
  FieldTemplateProps,
  UiSchema,
  Widget,
  utils,
  WidgetProps,
  FieldProps,
} from "@rjsf/core";

import { FileWidget } from "../CustomFormControls";
import { useEffect, useState } from "react";

export const Message = styled.div`
  margin-top: 14px;
  padding: 0 22px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight};
  font-size: ${({ theme }) => theme.typography.fontSize};
  color: ${({ theme }) => theme.palette.text.primary};
  opacity: 0.5;
`;

const widgets: { [id: string]: Widget } = {
  file: FileWidget,
  inputpath: FileWidget,
};

interface Props {
  data: any;
  schema?: any;
  onChange?: (data: any) => any;
  onFileRequested?: (options: any) => any;
  onPropertiesUpdateRequested?: (options: any) => any;
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

const CustomOneOf: Field = (props) => {
  const {
    baseType,
    disabled,
    readonly,
    hideError,
    errorSchema,
    formData,
    idPrefix,
    idSeparator,
    idSchema,
    onBlur,
    onChange,
    onFocus,
    options,
    registry,
    uiSchema,
    schema,
    formContext,
  } = props;
  console.log("ONEOF");
  const findOption = (widgetName: string): any => {
    for (const i in options as any[]) {
      const option = options[i];
      if (option.uihints?.value?.["ui:widget"] === widgetName) {
        return i;
      }
    }
    return 0;
  };
  const [selectedOption, setSelectedOption] = useState(
    findOption(formData["widget"])
  );

  const onOptionChange = (option: any) => {
    const selectedOption = parseInt(option, 10);
    const { rootSchema } = registry;
    const newOption = utils.retrieveSchema(
      options[selectedOption],
      rootSchema,
      formData
    );

    // If the new option is of type object and the current data is an object,
    // discard properties added using the old option.
    let newFormData = undefined;
    if (
      utils.guessType(formData) === "object" &&
      (newOption.type === "object" || newOption.properties)
    ) {
      newFormData = Object.assign({}, formData);

      const optionsToDiscard = options.slice();
      optionsToDiscard.splice(selectedOption, 1);

      // Discard any data added using other options
      for (const option of optionsToDiscard) {
        if (option.properties) {
          for (const key in option.properties) {
            if (newFormData.hasOwnProperty(key)) {
              delete newFormData[key];
            }
          }
        }
      }

      newFormData["ui:widget"] = (newOption as any).uihints?.["ui:widget"];
    }
    // Call getDefaultFormState to make sure defaults are populated on change.
    onChange(
      utils.getDefaultFormState(
        options[selectedOption],
        newFormData,
        rootSchema
      )
    );

    setSelectedOption(parseInt(option, 10));
  };

  const _SchemaField = registry.fields.SchemaField as React.FC<FieldProps>;
  const { widgets } = registry;
  const uiOptions = (utils.getUiOptions(uiSchema) ?? {}) as WidgetProps;
  const Widget = utils.getWidget(
    { type: "number" },
    "select",
    widgets
  ) as React.FC<WidgetProps>;

  const option = options[selectedOption] || null;
  let optionSchema;

  if (option) {
    // If the subschema doesn't declare a type, infer the type from the
    // parent schema
    optionSchema = option.type
      ? option
      : Object.assign({}, option, { type: baseType });
  }

  const enumOptions = options.map((option: any, index: number) => ({
    label: option.title || `Option ${index + 1}`,
    value: index,
  }));

  console.log(optionSchema);

  return (
    <div className="panel panel-default panel-body">
      <div className="form-group">
        <Widget
          {...uiOptions}
          id={`${idSchema.$id}${
            schema.oneOf ? "__oneof_select" : "__anyof_select"
          }`}
          schema={{ type: "number", default: 0 }}
          onChange={onOptionChange}
          onBlur={onBlur}
          onFocus={onFocus}
          value={selectedOption}
          options={{ enumOptions }}
          registry={registry}
        />
      </div>

      {option !== null && (
        <_SchemaField
          {...props}
          schema={optionSchema}
          uiSchema={optionSchema.uihints}
          errorSchema={errorSchema}
          idSchema={idSchema}
          idPrefix={idPrefix}
          idSeparator={idSeparator}
          formData={formData}
          onChange={onChange}
          formContext={formContext}
          onBlur={onBlur}
          onFocus={onFocus}
          registry={registry}
          disabled={disabled}
          readonly={readonly}
          hideError={hideError}
        />
      )}
    </div>
  );
};

const CustomFieldTemplate: React.FC<FieldTemplateProps> = (props) => {
  console.log(props);
  console.log("CUSTOMFIELD");
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

export function PropertiesPanel({
  data,
  schema,
  onChange,
  onFileRequested,
  onPropertiesUpdateRequested,
}: Props) {
  if (schema === undefined) {
    return <Message>No properties defined.</Message>;
  }

  const uiSchema: UiSchema = {};
  for (const field in schema.properties) {
    uiSchema[field] = {};
    const properties = schema.properties[field];
    if (properties.type === "object") {
      for (const subField in properties.properties) {
        const subProps = properties.properties[subField];
        if (typeof subProps !== "boolean" && subProps.uihints) {
          uiSchema[field][subField] = subProps.uihints;
        }
      }
    }
    if (typeof properties !== "boolean" && properties.uihints) {
      uiSchema[field] = properties.uihints;
    }
  }

  console.log(uiSchema);
  console.log(schema);

  return (
    <Form
      formData={data}
      uiSchema={uiSchema}
      schema={schema as any}
      onChange={(e) => {
        const newFormData = e.formData;
        const params = schema.properties?.component_parameters?.properties;
        for (const field in params) {
          if (params[field].oneOf) {
            for (const option of params[field].oneOf) {
              if (option.widget?.const !== undefined) {
                newFormData.component_parameters[field].widget =
                  option.widget.const;
              }
            }
          }
        }
        onChange?.(e.formData);
      }}
      formContext={{
        onFileRequested,
        onPropertiesUpdateRequested,
      }}
      id={data?.id}
      widgets={widgets}
      fields={{
        OneOfField: CustomOneOf,
      }}
      ArrayFieldTemplate={ArrayTemplate}
      FieldTemplate={CustomFieldTemplate}
      className={"elyra-formEditor"}
    />
  );
}
