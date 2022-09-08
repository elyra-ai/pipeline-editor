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

import { useState } from "react";

import Form, {
  ArrayFieldTemplateProps,
  Field,
  FieldTemplateProps,
  UiSchema,
  Widget,
  utils,
  WidgetProps,
  FieldProps,
  AjvError,
} from "@rjsf/core";
import styled from "styled-components";

import { FileWidget } from "../CustomFormControls";

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

/**
 * A custom oneOf field to handle the 2 custom oneOf cases that Elyra has:
 * 1. Each oneOf entry represents a different widget:
 *       Selecting the options based on widget type: assumes the value of the field
 *       is { value, widget } so that the widget type can be saved in the json.
 * 2. "inputpath": Each oneOf entry represents a different set object
 *       Selecting the options based on the default values of the given oneOf object.
 */
export const CustomOneOf: Field = (props) => {
  const { options, formData, registry } = props;
  const findOption = (): any => {
    // For inputpaths, expect a oneOf that has { value, option } for each entry
    if ((props.schema as any).uihints?.["inputpath"]) {
      for (const i in props.schema.oneOf ?? []) {
        const properties: any = props.schema.oneOf?.[i];
        if (
          formData?.value === (properties as any).properties.value.default &&
          formData?.option === (properties as any).properties.option.default
        ) {
          return i;
        }
      }
      return 0;
    }
    // for other oneOfs, check for widget specified in the "value" uihints to match the saved widget
    for (const i in options as any[]) {
      const option = options[i];
      if (option.properties.widget?.default === formData?.widget) {
        return i;
      }
    }
    return 0;
  };
  const [selectedOption, setSelectedOption] = useState(findOption());

  const onOptionChange = (option: any) => {
    const selectedOption = parseInt(option, 10);
    const { rootSchema } = props.registry;
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
    }
    // Call getDefaultFormState to make sure defaults are populated on change.
    let defaults;
    try {
      defaults = utils.getDefaultFormState(
        options[selectedOption],
        newFormData,
        rootSchema
      );
    } catch {}
    props.onChange(defaults);

    setSelectedOption(parseInt(option, 10));
  };

  const SchemaField = registry.fields.SchemaField as React.FC<FieldProps>;
  const { widgets } = registry;
  const uiOptions = (utils.getUiOptions(props.uiSchema) ?? {}) as WidgetProps;
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
      : Object.assign({}, option, { type: props.baseType });
  }

  const enumOptions = options.map((option: any, index: number) => ({
    label: option.title || `Option ${index + 1}`,
    value: index,
  }));

  return (
    <div className="panel panel-default panel-body">
      <div className="form-group">
        <Widget
          {...uiOptions}
          id={`${props.idSchema.$id}${
            props.schema.oneOf ? "__oneof_select" : "__anyof_select"
          }`}
          schema={{ type: "number", default: 0 }}
          onChange={onOptionChange}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          value={selectedOption}
          options={{ enumOptions }}
          registry={registry}
        />
      </div>

      {option !== null && (
        <SchemaField
          {...props}
          schema={optionSchema}
          uiSchema={optionSchema.uihints}
        />
      )}
    </div>
  );
};

const CustomFieldTemplate: React.FC<FieldTemplateProps> = (props) => {
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
  const requiredError = props.required && props.formData === undefined;
  const hasError = props.rawErrors || requiredError;
  return (
    <div
      className={`${props.classNames} ${
        props.schema.oneOf ? "field-oneOf" : ""
      }`}
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
        onFileRequested: async (args: any) => {
          return await onFileRequested?.({
            ...args,
            filename: data.component_parameters.filename,
          });
        },
        onPropertiesUpdateRequested: async (args: any) => {
          const newData = await onPropertiesUpdateRequested?.(args);
          onChange?.(newData);
        },
        formData: data,
      }}
      id={data?.id}
      widgets={widgets}
      fields={{
        OneOfField: CustomOneOf,
      }}
      liveValidate
      ArrayFieldTemplate={ArrayTemplate}
      noHtml5Validate
      FieldTemplate={CustomFieldTemplate}
      className={"elyra-formEditor"}
      transformErrors={(errors: AjvError[]) => {
        // Suppress the "oneof" validation because we're using oneOf in a custom way.
        const transformed = [];
        for (const error of errors) {
          if (
            error.message !== "should match exactly one schema in oneOf" &&
            (error as any).schemaPath?.includes("oneOf") &&
            error.message !== "should be object" &&
            error.message !== "should be string"
          ) {
            transformed.push(error);
          }
        }
        return transformed;
      }}
    />
  );
}
