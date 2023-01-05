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

import { Field, FieldProps, utils, WidgetProps } from "@rjsf/core";

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
    if (props.uiSchema?.["inputpath"]) {
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
      if (
        (formData?.widget &&
          option.properties?.widget?.default === formData?.widget) ||
        (formData?.type && option.properties?.type?.default === formData?.type)
      ) {
        return i;
      }
    }
    return 0;
  };
  const onOptionChange = (option: any) => {
    const selectedOption = parseInt(option, 10);
    const { rootSchema } = props.registry;

    // Call getDefaultFormState to make sure defaults are populated on change.
    let defaults;
    try {
      defaults = utils.getDefaultFormState(
        options[selectedOption],
        undefined,
        rootSchema
      );
    } catch {}
    props.onChange(defaults);
  };

  const SchemaField = registry.fields.SchemaField as React.FC<FieldProps>;
  const { widgets } = registry;
  const uiOptions = (utils.getUiOptions(props.uiSchema) ?? {}) as WidgetProps;
  const Widget = utils.getWidget(
    { type: "number" },
    "select",
    widgets
  ) as React.FC<WidgetProps>;

  const option = options[findOption()] || null;
  let optionSchema;

  if (option) {
    // If the subschema doesn't declare a type, infer the type from the
    // parent schema
    optionSchema = option.type
      ? option
      : Object.assign({}, option, { type: props.baseType });
  }

  optionSchema = {
    ...optionSchema,
    uihints: {
      ...optionSchema.uihints,
      value: {
        ...optionSchema.uihints.value,
        parentID: props.idSchema.$id.replace("root_component_parameters_", ""),
      },
    },
  };

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
          value={findOption()}
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
