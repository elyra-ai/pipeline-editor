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

import Form, { UiSchema } from "@rjsf/core";
import { JSONSchema7 } from "json-schema";

import { Message } from "./PropertiesPanel";

interface Props {
  pipelineFlow: any;
  propertiesSchema?: JSONSchema7;
  onFileRequested?: (options: any) => any;
  onPropertiesUpdateRequested?: (options: any) => any;
  onChange?: (data: any) => any;
}

function PipelineProperties({
  pipelineFlow,
  propertiesSchema,
  onFileRequested,
  onPropertiesUpdateRequested,
  onChange,
}: Props) {
  if (propertiesSchema === undefined) {
    return <Message>No pipeline properties defined.</Message>;
  }

  const uiSchema: UiSchema = {};
  for (const field in propertiesSchema.properties) {
    const properties = propertiesSchema.properties[field];
    if (typeof properties !== "boolean" && properties.const) {
      uiSchema[field] = {
        "ui:readonly": true,
        default: properties.const,
      };
    }
  }

  return (
    <Form
      formData={pipelineFlow?.pipelines?.[0]?.app_data?.properties ?? {}}
      uiSchema={uiSchema}
      // onPropertiesUpdateRequested={onPropertiesUpdateRequested}
      schema={propertiesSchema as any}
      // onFileRequested={onFileRequested}
      onChange={(e) => onChange?.(e.formData)}
      // id={pipelineFlow?.id}
    />
  );
}

export default PipelineProperties;
