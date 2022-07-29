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

import { useCallback, useState } from "react";

import { Widget } from "@rjsf/core";

// TODO: Make the file clearable
export const FileWidget: Widget = (props) => {
  const [value, setValue] = useState<string>(props.value);

  const handleChooseFile = useCallback(async () => {
    const values = await props.formContext.onFileRequested({
      canSelectMany: false,
      defaultUri: value,
      filters: { File: props.uiSchema.extensions },
      id: props.id,
    });
    console.log(values);
    props.onChange(values[0]);
    setValue(values[0]);
  }, [props.formContext.actionHandler, value, props.uiSchema]);

  return (
    <div style={{ display: "flex" }}>
      <input
        type="text"
        className="form-control"
        value={value}
        placeholder={props.uiSchema?.["ui:placeholder"]}
        onChange={(e) => {
          console.log(e);
        }}
        disabled
      />
      <button
        className="form-control"
        style={{ width: "fit-content" }}
        onClick={handleChooseFile}
      >
        Browse
      </button>
    </div>
  );
};
