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

import { ErrorTransformer, CustomValidator, FormValidation } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv6";
import { parseTree, findNodeAtLocation } from "jsonc-parser";

import checkCircularReferences from "./check-circular-references";
import { PartialProblem, Problem } from "./types";
import { findNode, getLinks, getNodes, rangeForLocation } from "./utils";

export const transformErrors: ErrorTransformer = (errors) => {
  const newErrors = [];
  for (const error of errors ?? []) {
    if (
      error.name !== "minItems" &&
      error.name !== "oneOf" &&
      error.message !== "should be object" &&
      error.message !== "should be string"
    ) {
      newErrors.push(error);
    }
  }
  return newErrors;
};

export function createCustomValidator(schema: any): CustomValidator {
  const validate = (formData: any, errors: FormValidation) => {
    for (const field in formData) {
      if (
        schema.required?.includes(field) &&
        formData[field]?.widget &&
        (formData[field]?.value === undefined || formData[field]?.value === "")
      ) {
        errors[field]?.addError("required field");
      }
      if (schema.required?.includes(field) && formData[field] === "") {
        errors[field]?.addError("required field");
      }
    }
    const component_parameters = schema.properties?.component_parameters ?? {};
    for (const field in formData.component_parameters ?? {}) {
      if (
        component_parameters.required?.includes(field) &&
        formData.component_parameters[field]?.widget &&
        (formData.component_parameters[field]?.value === undefined ||
          formData.component_parameters[field]?.value === "")
      ) {
        errors["component_parameters"]?.[field]?.addError("required field");
      }
      if (
        component_parameters.required?.includes(field) &&
        formData.component_parameters?.[field] === ""
      ) {
        errors["component_parameters"]?.[field]?.addError("required field");
      }
    }
    return errors;
  };
  return validate;
}

export function getLinkProblems(pipeline: any) {
  const links = getLinks(pipeline);

  const taintedLinks = checkCircularReferences(links);

  let problems: PartialProblem[] = [];
  for (const linkID of taintedLinks) {
    // linkID should be guaranteed to be found.
    const link = links.find((l) => l.id === linkID)!;

    const source = findNode(pipeline, link.srcNodeId);
    const target = findNode(pipeline, link.trgNodeId);
    problems.push({
      message: `The connection between nodes '${source.app_data.ui_data.label}' and '${target.app_data.ui_data.label}' is part of a circular reference.`,
      path: [...link.path, "id"],
      info: {
        type: "circularReference",
        pipelineID: pipeline.id,
        linkID: linkID,
      },
    });
  }

  return problems;
}

export function getPipelineProblems(pipeline: any, pipelineProperties: any) {
  let problems: PartialProblem[] = [];
  let errorMessages = validator.validateFormData(
    pipeline.app_data ?? {},
    pipelineProperties ?? {},
    undefined,
    transformErrors
  ).errors;

  for (const error of errorMessages) {
    problems.push({
      message: error.message ?? "",
      path: error.params,
      info: {
        pipelineID: pipeline.id,
        property: getPropertyName(error.property ?? ""),
        type: "missingProperty",
      },
    });
  }

  return problems;
}

function getPropertyName(property: string) {
  // Split out the name without brackets for more complicated property names.
  // Ex: properties['runtime_image'].items -> you would only want runtime_image
  const propertyWithoutBrackets = property.split(/[[''\]]+/);
  if (propertyWithoutBrackets.length === 1) {
    // Properties that don't have brackets will start with '.', so remove that as well.
    return propertyWithoutBrackets[0].replace(".", "");
  } else {
    return property.split(/[[''\]]+/)[1]?.replace("'", "");
  }
}

export function getNodeProblems(pipeline: any, nodeDefinitions: any) {
  const nodes = getNodes(pipeline);
  let problems: PartialProblem[] = [];
  for (const [n, node] of nodes.entries()) {
    if (node.type !== "execution_node") {
      continue;
    }

    const nodeDef = nodeDefinitions.find((n: any) => n.op === node.op);
    if (nodeDef === undefined) {
      problems.push({
        message: `The component '${node.op}' cannot be found.`,
        path: ["nodes", n],
        info: {
          type: "missingComponent",
          pipelineID: pipeline.id,
          nodeID: node.id,
          op: node.op,
        },
      });
      continue;
    }

    const nodeProperties =
      nodeDef.app_data.properties?.properties?.component_parameters ?? {};

    const errorMessages = validator.validateFormData(
      node.app_data.component_parameters ?? {},
      nodeProperties,
      createCustomValidator(nodeProperties),
      transformErrors
    ).errors;
    for (const error of errorMessages) {
      const property = getPropertyName(error.property ?? "");
      problems.push({
        message: error.message ?? "",
        path: error.params,
        info: {
          pipelineID: pipeline.id,
          nodeID: node.id,
          property: property,
          type: "missingProperty",
        },
      });
    }
  }

  return problems;
}

export function validate(
  pipeline: string,
  nodeDefinitions: any,
  pipelineProperties?: any
) {
  const pipelineTreeRoot = parseTree(pipeline);
  if (pipelineTreeRoot === undefined) {
    return [];
  }

  const pipelineJSON = JSON.parse(pipeline);

  let problems: Problem[] = [];
  for (const [p, pipeline] of pipelineJSON.pipelines.entries()) {
    let partials: PartialProblem[] = [];

    partials.push(...getPipelineProblems(pipeline, pipelineProperties));
    partials.push(...getLinkProblems(pipeline));
    partials.push(...getNodeProblems(pipeline, nodeDefinitions));

    problems.push(
      ...partials.map((partial) => {
        const { path, ...rest } = partial;
        const location = findNodeAtLocation(pipelineTreeRoot, [
          "pipelines",
          p,
          ...(path ?? []),
        ]);

        return {
          ...rest,
          severity: 1 as 1 | 2 | 3 | 4 | undefined,
          range: rangeForLocation(location),
        };
      })
    );
  }

  return problems;
}

export * from "./validators";
export * from "./types";
