import produce from "immer";

export interface CommonPropertiesSchema {
  current_parameters: {
    [key: string]: any;
  };
  parameters: CommonPropertiesSchema.Parameter[];
  uihints: CommonPropertiesSchema.UIHints;
  resources: any;
}

export namespace CommonPropertiesSchema {
  export interface UIHints {
    id: string;
    parameter_info: any[];
    action_info: any[];
    group_info: any[];
  }
  export interface StringParameter {
    id: string;
    type: "string";
    required: boolean;
  }
  export interface StringArrayParameter {
    id: string;
    type: "array[string]";
    required: boolean;
  }
  export interface BooleanParameter {
    id: string;
    type: "cboolean";
    required: boolean;
  }
  export interface EnumParameter {
    id: string;
    enum: any[];
    required: boolean;
  }
  export type Parameter =
    | StringParameter
    | StringArrayParameter
    | BooleanParameter
    | EnumParameter;
}

export function fillPropertiesWithSavedData(
  properties: CommonPropertiesSchema,
  appData: { [key: string]: any }
) {
  return produce(properties, (draftState) => {
    for (const [key, val] of Object.entries(appData)) {
      if (val !== undefined) {
        draftState.current_parameters[key] = val;
      }
    }
  });
}
