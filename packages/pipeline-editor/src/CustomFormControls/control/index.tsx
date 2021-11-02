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
  id: string;
}

const ControlContext = React.createContext<ContextValue>({
  name: "",
  controller: {},
  id: "",
});

export function useHandlers() {
  const { controller } = useContext(ControlContext);
  const controllerRef = useRef(controller);
  return useMemo(() => controllerRef.current.getHandlers(), []);
}

export function usePropertyID() {
  const { name } = useContext(ControlContext);
  return name;
}

export function useControlState<T>() {
  const { name, controller, id } = useContext(ControlContext);
  const controllerRef = useRef(controller);
  const currentValue: any = useSelector((state: any) => {
    return state.propertiesReducer[name];
  });
  const value: T = useSelector((state: any) => {
    if (id !== "OneOfControl") {
      return state.propertiesReducer[name];
    }
    const { activeControl } = state.propertiesReducer[name];
    return state.propertiesReducer[name][activeControl];
  });
  const activeControl: string = useSelector((state: any) => {
    return state.propertiesReducer[name]?.activeControl ?? "";
  });
  const setValue = useCallback(
    (value: T) => {
      if (id !== "OneOfControl") {
        controllerRef.current.updatePropertyValue({ name }, value);
      } else {
        controllerRef.current.updatePropertyValue(
          { name },
          { ...currentValue, [activeControl]: value }
        );
      }
    },
    [name, currentValue, activeControl, id]
  );
  const setActiveControl = useCallback(
    (activeControl: string) => {
      controllerRef.current.updatePropertyValue(
        { name },
        { ...currentValue, activeControl }
      );
    },
    [name, currentValue]
  );
  return [value, setValue, activeControl, setActiveControl] as [
    T | undefined,
    (value: T | undefined) => void,
    string,
    (value: string) => void
  ];
}

export function createControl(id: string, Component: any) {
  function Control(
    this: any,
    propertyId: { name: string },
    controller: any,
    data: any
  ) {
    this.value = { name: propertyId.name, controller, id };
    this.data = data;
  }

  Control.id = () => id;

  Control.prototype.renderControl = function () {
    return (
      <ControlContext.Provider value={this.value}>
        <Component {...this.data} />
      </ControlContext.Provider>
    );
  };

  return Control as any;
}
