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
import {
  getErrorMessages,
  getEnumValidators,
  getNestedEnumValidators,
  getNumberValidators,
  getStringValidators,
  getStringArrayValidators,
} from "./validators";

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

function getPropertyValidationErrors(prop: any, value: any): any[] {
  let errorMessages: any[] = [];
  switch (prop.custom_control_id) {
    case "EnumControl":
      const enumValidators = getEnumValidators(prop.data);
      errorMessages = getErrorMessages(value, enumValidators);
      break;
    case "NestedEnumControl":
      const nestedEnumValidators = getNestedEnumValidators(prop.data);
      errorMessages = prop.data?.required
        ? getErrorMessages(value, nestedEnumValidators)
        : [];
      break;
    case "NumberControl":
      const trimmedNumber = (value?.toString() ?? "").trim();
      if (!prop.data?.required && trimmedNumber === "") {
        break;
      }
      const numberValidators = getNumberValidators(prop.data);
      errorMessages = getErrorMessages(trimmedNumber, numberValidators);
      break;
    case "StringArrayControl":
      const stringArrayValidators = getStringArrayValidators(prop.data);
      errorMessages = getErrorMessages(value ?? [], stringArrayValidators);
      break;
    case "StringControl":
      const trimmedString = (value ?? "").trim();
      if (!prop.data?.required && trimmedString === "") {
        break;
      }
      const stringValidators = getStringValidators(prop.data);
      errorMessages = getErrorMessages(trimmedString, stringValidators);
      break;
  }
  return errorMessages;
}

export function getPipelineProblems(pipeline: any, pipelineProperties: any) {
  let problems: PartialProblem[] = [];

  for (const prop of pipelineProperties?.properties ?? []) {
    // If the property isn't in the json, report the error one level higher.
    let path = ["pipeline", "0", "app_data"];
    if (pipeline.app_data?.[prop] !== undefined) {
      path.push(pipelineProperties[prop]);
    }

    // this should be safe because a boolean can't be required
    // otherwise we would need to check strings for undefined or empty string
    // NOTE: 0 is also falsy, but we don't have any number inputs right now?
    // TODO: We should update this to do type checking.
    const value = getValue(
      pipeline.app_data?.properties,
      prop.parameter_ref,
      pipeline.app_data?.properties?.pipeline_defaults
    );
    if (prop.data?.required && !value) {
      problems.push({
        message: `The pipeline property '${prop.label.default}' is required.`,
        path,
        info: {
          type: "missingProperty",
          pipelineID: pipeline.id,
          // do not strip elyra here, we need to differentiate between pipeline_defaults still.
          property: prop.parameter_ref,
        },
      });
    }

    let errorMessages = getPropertyValidationErrors(prop, value);

    if (errorMessages[0] !== undefined) {
      problems.push({
        message: `The pipeline property '${prop.label.default}' is invalid: ${errorMessages[0]}`,
        path,
        info: {
          type: "invalidProperty",
          pipelineID: pipeline.id,
          // do not strip elyra here, we need to differentiate between pipeline_defaults still.
          property: prop.parameter_ref,
          message: errorMessages[0],
        },
      });
    }
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
      nodeDef.app_data.properties?.properties?.component_parameters?.properties;
    for (const fieldName in nodeProperties ?? []) {
      const prop = nodeProperties[fieldName];
      // If the property isn't in the json, report the error one level higher.
      let path = ["nodes", n, "app_data"];
      if (node.app_data.component_parameters?.[fieldName] !== undefined) {
        path.push(prop.parameter_ref);
      }

      // this should be safe because a boolean can't be required
      // otherwise we would need to check strings for undefined or empty string
      // NOTE: 0 is also falsy, but we don't have any number inputs right now?
      // TODO: We should update this to do type checking.
      const value = getValue(
        node.app_data.component_parameters ?? {},
        fieldName,
        pipeline.app_data?.properties?.pipeline_defaults
      );
      if (
        nodeDef.app_data.properties?.properties?.component_parameters?.required?.includes(
          fieldName
        ) &&
        !value
      ) {
        problems.push({
          message: `The property '${prop.title}' on node '${node.app_data.ui_data.label}' is required.`,
          path,
          info: {
            type: "missingProperty",
            pipelineID: pipeline.id,
            nodeID: node.id,
            property: fieldName,
          },
        });
      }

      let errorMessages = getPropertyValidationErrors(prop, value);

      if (errorMessages[0] !== undefined) {
        problems.push({
          message: `The property '${prop.label.default}' on node '${node.app_data.ui_data.label}' is invalid: ${errorMessages[0]}`,
          path,
          info: {
            type: "invalidProperty",
            pipelineID: pipeline.id,
            nodeID: node.id,
            // do not strip elyra here, we need to differentiate between component_parameters still.
            property: prop.parameter_ref,
            message: errorMessages[0],
          },
        });
      }
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
          ...path,
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
