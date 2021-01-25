export interface INode {
  op: string;
  label: string;
  description: string;
  labelField?: string;
  fileField?: string;
  fileBased?: boolean;
  extension?: string;
  image?: string;
  properties?: IProperties;
}

export interface IProperties {
  current_parameters: ICurrentParameters;
  parameters: IParameter[];
  uihints: IUIHints;
  resources: IResources;
}

export interface ICurrentParameters {
  [key: string]: any;
}

export interface IParameter {
  id: string;
  type: "string" | "array[string]" | "boolean";
  enum?: any[];
  required?: boolean;
}

export interface IUIHints {
  id: string;
  parameter_info: IParameterInfo[];
  action_info: any[];
  group_info: any[];
}

export interface IResources {
  [key: string]: string;
}

export interface IParameterInfo {
  parameter_ref: string;
  label: {
    default: string;
  };
  control?: "readonly" | "oneofselect";
  place_holder_text?: {
    default: string;
  };
}

export interface IRuntime {
  name: string;
  schema_name?: string;
  display_name: string;
}
