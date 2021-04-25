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

import { parseTree, findNodeAtLocation } from "jsonc-parser";

import checkCircularReferences from "./check-circular-references";
import { PartialProblem, Problem } from "./types";
import {
  findNode,
  getLabel,
  getLinks,
  getNodes,
  rangeForLocation,
} from "./utils";

export function getLinkProblems(pipeline: any) {
  const links = getLinks(pipeline);

  const taintedLinks = checkCircularReferences(links);

  let problems: PartialProblem[] = [];
  for (const linkID of taintedLinks) {
    // linkID should be guaranteed to be found.
    const link = links.find((l) => l.id === linkID)!;

    const source = findNode(pipeline, link.srcNodeId);
    const target = findNode(pipeline, link.trgNodeId);

    const sourceLabel = getLabel(source);
    const targetLabel = getLabel(target);

    problems.push({
      message: `The connection between nodes '${sourceLabel}' and '${targetLabel}' is part of a circular reference.`,
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

export function getNodeProblems(pipeline: any, nodeDefinitions: any) {
  const nodes = getNodes(pipeline);
  let problems: PartialProblem[] = [];
  for (const [n, node] of nodes.entries()) {
    if (node.type !== "execution_node") {
      continue;
    }

    const nodeDef = nodeDefinitions.find((n: any) => n.op === node.op);
    if (nodeDef === undefined) {
      continue;
    }

    for (const prop of nodeDef.properties ?? []) {
      // If the property isn't in the json, report the error one level higher.
      let path = ["nodes", n, "app_data"];
      if (node.app_data[prop.id] !== undefined) {
        path.push(prop.id);
      }

      // this should be safe because a boolean can't be required
      // otherwise we would need to check strings for undefined or empty string
      // NOTE: 0 is also falsy, but we don't have any number inputs right now?
      // TODO: We should update this to do type checking.
      if (prop.required && !node.app_data[prop.id]) {
        const nodeLabel = getLabel(node);
        problems.push({
          message: `The property '${prop.title}' on node '${nodeLabel}' is required.`,
          path,
          info: {
            type: "missingProperty",
            pipelineID: pipeline.id,
            nodeID: node.id,
            property: prop.id,
          },
        });
      }
    }
  }

  return problems;
}

function getStructuralProblems(pipeline: any): string[] {
  let messages = [];
  // the pipeline contains a `primary_pipeline` field that is a string
  if (pipeline.primary_pipeline === undefined) {
    messages.push("Could not determine the primary pipeline.");
  } else if (typeof pipeline.primary_pipeline !== "string") {
    messages.push("Field 'primary_pipeline' should be a string.");
  }

  // the pipeline contains a `pipelines` field that is an array
  if (pipeline.pipelines === undefined) {
    messages.push("Pipeline definition not found.");
  } else if (Array.isArray(pipeline.pipelines) === false) {
    messages.push("Field 'pipelines' should be a list.");
  }

  // the `primary_pipeline` is findable in the `pipelines` array
  const primaryID = pipeline.primary_pipeline;
  const primary = pipeline.pipelines.find((p: any) => p.id === primaryID);
  if (primary === undefined) {
    messages.push(`Primary pipeline '${primaryID}' not found.`);

    // we can't run any of tests without a primary pipeline
    return messages;
  }

  // the found `primary_pipeline` has an `app_data` field that is an object containing a `version` field that is a number
  if (primary.app_data === undefined) {
    messages.push(`Primary pipeline is missing 'app_data' field.`);
  } else if (primary.app_data.version === undefined) {
    messages.push(`Could not determine the pipeline version.`);
  } else if (typeof primary.app_data.version !== "number") {
    messages.push("Field 'version' should be a number.");
  }

  // the found `primary_pipeline` has an `nodes` field that is an array
  if (Array.isArray(primary.nodes) === false) {
    messages.push("Field 'nodes' should be a list.");
  }

  return messages;
}

export function validate(pipeline: string, nodeDefinitions: any): Problem[] {
  const pipelineTreeRoot = parseTree(pipeline);
  if (pipelineTreeRoot === undefined) {
    const invalidJSON: Problem = {
      info: {
        type: "invalidJSON",
      },
      message: "Unable to parse JSON tree.",
      severity: 1,
      range: {
        offset: 0,
        length: 0,
      },
    };
    return [invalidJSON];
  }

  let pipelineJSON;
  try {
    pipelineJSON = JSON.parse(pipeline);
  } catch (e) {
    const invalidJSON: Problem = {
      info: {
        type: "invalidJSON",
      },
      message: e.message,
      severity: 1,
      range: {
        offset: 0,
        length: 0,
      },
    };
    return [invalidJSON];
  }

  const structuralProblems = getStructuralProblems(pipelineJSON);

  // If there are structural problems we are probably in an irrecoverable state,
  // so bail now.
  if (structuralProblems.length > 0) {
    return structuralProblems.map((message) => ({
      info: {
        type: "invalidPipeline",
      },
      message,
      severity: 1,
      range: {
        offset: 0,
        length: 0,
      },
    }));
  }

  let problems: Problem[] = [];
  for (const [p, pipeline] of pipelineJSON.pipelines.entries()) {
    let partials: PartialProblem[] = [];

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
