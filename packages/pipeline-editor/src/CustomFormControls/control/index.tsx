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

import React, { useCallback, useContext, useMemo, useRef } from "react";

import { useSelector } from "react-redux";

interface ContextValue {
  name: string;
  controller: any;
}

const ControlContext = React.createContext<ContextValue>({
  name: "",
  controller: {},
});

export function useHandlers() {
  const { controller } = useContext(ControlContext);
  const controllerRef = useRef(controller);
  return useMemo(() => controllerRef.current.getHandlers(), []);
}

export function useErrorMessage(): { type: "error" } | undefined {
  const { name } = useContext(ControlContext);
  return useSelector((state: any) => state.errorMessagesReducer[name]);
}

export function useControlState<T>() {
  const { name, controller } = useContext(ControlContext);
  const controllerRef = useRef(controller);
  const value: T = useSelector((state: any) => state.propertiesReducer[name]);
  const setValue = useCallback(
    (value: T) => {
      controllerRef.current.updatePropertyValue({ name }, value);
    },
    [name]
  );
  return [value, setValue] as [T | undefined, (value: T | undefined) => void];
}

export function createControl(Component: any) {
  function Control(
    this: any,
    propertyId: { name: string },
    controller: any,
    data: any
  ) {
    this.value = { name: propertyId.name, controller };
    this.data = data;
  }

  Control.id = () => Component.name;

  Control.prototype.renderControl = function () {
    return (
      <ControlContext.Provider value={this.value}>
        <Component {...this.data} />
      </ControlContext.Provider>
    );
  };

  return Control as any;
}
