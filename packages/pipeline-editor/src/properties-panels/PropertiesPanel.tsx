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

import {
  transformErrors,
  createCustomValidator,
} from "@elyra/pipeline-services";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv6";
import { produce } from "immer";
import styled from "styled-components";

import {
  FileWidget,
  CustomFieldTemplate,
  ArrayTemplate,
  CustomOneOf,
} from "../CustomFormControls";

export const Message = styled.div`
  margin-top: 14px;
  padding: 0 22px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight};
  font-size: ${({ theme }) => theme.typography.fontSize};
  color: ${({ theme }) => theme.palette.text.primary};
  opacity: 0.5;
`;

interface Props {
  data: any;
  schema?: any;
  onChange?: (data: any) => any;
  onFileRequested?: (options: any) => any;
  onPropertiesUpdateRequested?: (options: any) => any;
  noValidate?: boolean;
  id?: string;
}

export function PropertiesPanel({
  data,
  schema,
  onChange,
  onFileRequested,
  onPropertiesUpdateRequested,
  noValidate,
  id,
}: Props) {
  if (schema === undefined) {
    return <Message>No properties defined.</Message>;
  }

  let uiSchema: any = {};
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
  uiSchema = {
    ...uiSchema,
    ...schema.uihints,
  };

  return (
    <Form
      formData={data}
      uiSchema={uiSchema}
      schema={schema as any}
      customValidate={createCustomValidator(schema)}
      onChange={(e) => {
        onChange?.(e.formData);
      }}
      formContext={{
        onFileRequested: async (args: any) => {
          const values = await onFileRequested?.({
            ...args,
            filename: data.component_parameters.filename,
          });
          const newFormData = produce(data, (draft: any) => {
            if (args.canSelectMany) {
              draft.component_parameters[args.propertyID] = [
                ...draft.component_parameters[args.propertyID],
                ...values,
              ];
            } else {
              if (args.parentID) {
                draft.component_parameters[args.parentID].value = values?.[0];
              } else {
                draft.component_parameters[args.propertyID] = values?.[0];
              }
            }
          });
          onChange?.(newFormData ?? data);
        },
        onPropertiesUpdateRequested: async (args: any) => {
          const newData = await onPropertiesUpdateRequested?.(args);
          onChange?.(newData);
        },
        formData: data,
      }}
      id={id}
      widgets={{
        file: FileWidget,
      }}
      fields={{
        OneOfField: CustomOneOf,
      }}
      liveValidate={!noValidate}
      validator={validator}
      templates={{
        ArrayFieldTemplate: ArrayTemplate,
        FieldTemplate: CustomFieldTemplate,
      }}
      noHtml5Validate
      className={"elyra-formEditor"}
      transformErrors={transformErrors}
    />
  );
}
