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

import { parseTree, findNodeAtLocation } from "jsonc-parser";

import checkCircularReferences from "./check-circular-references";
import { PartialProblem, Problem } from "./types";
import {
  findNode,
  getLinks,
  getNodes,
  getValue,
  rangeForLocation,
} from "./utils";

import validator from "@rjsf/validator-ajv6";
import { ErrorTransformer, CustomValidator, FormValidation } from "@rjsf/utils";

export const transformErrors: ErrorTransformer = (errors) => {
  const newErrors = [];
  for (const error of errors ?? []) {
    if (error.name !== "minItems") {
      newErrors.push(error);
    }
  }
  return newErrors;
};

export function createCustomValidator(schema: any): CustomValidator {
  return (formData: any, errors: FormValidation) => {
    for (const field in formData) {
      if (
        schema.required?.includes(field) &&
        formData[field]?.widget &&
        (formData[field]?.value === undefined || formData[field]?.value === "")
      ) {
        errors[field]?.addError("required field");
      }
    }
    return errors;
  };
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
        property:
          error.property
            ?.replace(".properties['", "")
            ?.replace("'].required", "") ?? "",
        type: "missingProperty",
      },
    });
  }

  return problems;
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
      const property = error.property?.replace(".", "") ?? "";
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
