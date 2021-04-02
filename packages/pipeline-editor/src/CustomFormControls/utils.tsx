/*
 * Copyright 2018-2021 Elyra Authors
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

import { useCallback, useRef } from "react";

import { useSelector } from "react-redux";

export interface BaseProps {
  name: string;
  controller: any;
}

export function useControlState<T>(name: string, controller: any) {
  const controllerRef = useRef(controller);
  const value: T = useSelector((state: any) => state.propertiesReducer[name]);
  const setValue = useCallback(
    (value: T) => {
      controllerRef.current.updatePropertyValue({ name }, value);
    },
    [name]
  );

  return [value, setValue] as [T | undefined, (value: T) => void];
}

export function createControl(id: string, Component: any) {
  function Control(
    this: any,
    propertyId: { name: string },
    controller: any,
    data: any
  ) {
    this.propertyId = propertyId;
    this.controller = controller;
    this.data = data;
  }

  Control.id = () => id;

  Control.prototype.renderControl = function () {
    return (
      <Component
        name={this.propertyId.name}
        controller={this.controller}
        {...this.data}
      />
    );
  };

  return Control as any;
}
