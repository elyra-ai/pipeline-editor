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
import { findNode, getLinks, getNodes, rangeForLocation } from "./utils";

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
      path: [...link.path, "node_id_ref"],
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

    for (const prop of nodeDef.properties?.parameters ?? []) {
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
        const paramInfo = nodeDef.properties.uihints.parameter_info;
        const param = paramInfo.find((p: any) => p.parameter_ref === prop.id);
        problems.push({
          message: `The property '${param.label.default}' on node '${node.app_data.ui_data.label}' is required.`,
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

export function validate(pipeline: string, nodeDefinitions: any) {
  const pipelineTreeRoot = parseTree(pipeline);
  if (pipelineTreeRoot === undefined) {
    return [];
  }

  const pipelineJSON = JSON.parse(pipeline);

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
