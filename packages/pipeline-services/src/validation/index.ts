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

// 3 seconds should be ample time.
// should only protect against any infinite loops.
const TIMEOUT = 3000;

export interface Link {
  id: string;
  trgNodeId: string;
  srcNodeId: string;
  type: string;
  path?: any[];
}

export function checkCircularReferences(links: Link[]) {
  const startTime = Date.now();

  // filter out comment links.
  links = links.filter((l) => l.type !== "commentLink");

  // organize links into easily indexable map:
  // {srcNodeId: link[]}
  const linkMap: { [key: string]: Link[] } = {};
  for (const l of links) {
    if (linkMap[l.srcNodeId] === undefined) {
      linkMap[l.srcNodeId] = [];
    }
    linkMap[l.srcNodeId].push(l);
  }

  let orderedChain: string[] = [];
  const taintedLinks = new Set<string>();
  const seen = new Set<string>();
  const stack: Link[] = [];
  for (const l of links) {
    if (seen.has(l.id)) {
      continue;
    }
    seen.add(l.id);
    orderedChain = [];
    orderedChain.push(l.id);
    const linksToVisit = linkMap[l.trgNodeId];
    if (linksToVisit === undefined) {
      continue;
    }
    stack.push(...linksToVisit);
    const forkStack: number[] = [];
    const chainLength = orderedChain.length;
    forkStack.push(...linksToVisit.map(() => chainLength));

    while (stack.length > 0 && Date.now() - startTime < TIMEOUT) {
      forkStack.pop();
      const l = stack.pop()!; // we should be gauranteed an item.
      seen.add(l.id);
      const seenLinkIndex = orderedChain.indexOf(l.id);

      // We hit a link we've already seen in the chain. This means there is a
      // cycle from the seen link to the end of the chain.
      if (seenLinkIndex > -1) {
        for (const item of orderedChain.slice(seenLinkIndex)) {
          taintedLinks.add(item);
        }

        // This is completely useless, but it makes me feel better that this is
        // here.
        const position = forkStack.slice(-1).pop();
        if (position !== undefined) {
          orderedChain = orderedChain.slice(0, position);
        }
        // if position is undefined we will set orderedChain to []
        continue;
      }

      orderedChain.push(l.id);

      const linksToVisit = linkMap[l.trgNodeId];

      // We reached the end of a chain.
      if (linksToVisit === undefined) {
        // This is 100% necessary unlike the other example.
        const position = forkStack.slice(-1).pop();
        if (position !== undefined) {
          orderedChain = orderedChain.slice(0, position);
        }
        // if position is undefined we will set orderedChain to []
        continue;
      }

      // Uncharted teritory, add it to the stack to be explored.
      stack.push(...linksToVisit);
      const chainLength = orderedChain.length;
      forkStack.push(...linksToVisit.map(() => chainLength));
    }
  }

  return [...taintedLinks];
}

enum Severity {
  Error = 1,
  Warning,
  Info,
  Hint,
}

interface CircularReferenceInfo {
  type: "circularReference";
  linkID: string;
}

interface MissingPropertyInfo {
  type: "missingProperty";
  nodeID: string;
  property: string;
}

interface InvalidNodeInfo {
  type: "invalidNode";
  nodeID: string;
  op: string;
}

interface Problem {
  severity: Severity;
  range: {
    offset: number;
    length: number;
  };
  message: string;
  info: CircularReferenceInfo | MissingPropertyInfo | InvalidNodeInfo;
}

function isNode(nodes: any[], id: string) {
  const index = nodes.findIndex((node) => node.id === id);
  if (index === -1) {
    return false;
  }
  return true;
}

function getLinks(pipeline: any): Link[] {
  let links: Link[] = [];
  for (const [n, node] of pipeline.nodes.entries()) {
    for (const [i, input] of node.inputs.entries()) {
      if (input.links !== undefined) {
        for (const [l, link] of input.links.entries()) {
          if (isNode(pipeline.nodes, link.node_id_ref)) {
            links.push({
              id: link.id,
              trgNodeId: node.id,
              srcNodeId: link.node_id_ref,
              type: "",
              path: ["pipelines", 0, "nodes", n, "inputs", i, "links", l],
            });
          }
        }
      }
    }
  }
  return links;
}

function getNodes(pipeline: any): any[] {
  return pipeline.nodes;
}

function findNode(pipeline: any, id: string) {
  return pipeline.nodes.find((node: any) => node.id === id);
}

export function validate(pipeline: string, nodeDefinitions: any): Problem[] {
  const pipelineTreeRoot = parseTree(pipeline);
  if (pipelineTreeRoot === undefined) {
    return [];
  }

  const pipelineJSON = JSON.parse(pipeline);
  const primaryPipeline = pipelineJSON.pipelines.find(
    (p: any) => p.id === pipelineJSON.primary_pipeline
  );
  const links = getLinks(primaryPipeline);
  const taintedLinks = checkCircularReferences(links);

  let problems = taintedLinks.map(
    (linkID): Problem => {
      const link = links.find((l) => l.id === linkID);
      const location = findNodeAtLocation(pipelineTreeRoot, [
        ...(link?.path ?? []),
        "node_id_ref",
      ]);
      const source = findNode(primaryPipeline, link?.srcNodeId ?? "");
      const target = findNode(primaryPipeline, link?.trgNodeId ?? "");
      return {
        severity: 1,
        message: `The connection between nodes '${source.app_data.ui_data.label}' and '${target.app_data.ui_data.label}' is part of a circular reference.`,
        range: {
          offset: location?.offset ?? 0,
          length: location?.length ?? 0,
        },
        info: {
          type: "circularReference",
          linkID: linkID,
        },
      };
    }
  );

  // validate properties
  const nodes = getNodes(primaryPipeline);
  for (const [n, node] of nodes.entries()) {
    if (node.op === undefined) {
      // NOTE: supernode or binding, don't know if we need to validate anything?
      continue;
    }
    const nodeDef = nodeDefinitions.find((n: any) => n.op === node.op);
    if (nodeDef) {
      for (const prop of nodeDef.properties?.parameters ?? []) {
        // this should be safe because a boolean can't be required
        // otherwise we would need to check strings for undefined or empty string
        // NOTE: 0 is also falsy, but we don't have any number inputs right now?
        // TODO: We should update this to do type checking.
        const location = findNodeAtLocation(pipelineTreeRoot, [
          "pipelines",
          0,
          "nodes",
          n,
          "app_data",
          prop.id,
        ]);
        if (prop.required && !node.app_data[prop.id]) {
          const label = nodeDef.properties?.uihints.parameter_info.find(
            (p: any) => p.parameter_ref === prop.id
          )?.label.default;
          problems.push({
            severity: 1,
            message: `The property '${label}' on node '${node.app_data.ui_data.label}' is required.`,
            range: {
              offset: location?.offset ?? 0,
              length: location?.length ?? 0,
            },
            info: {
              type: "missingProperty",
              nodeID: node.id,
              property: prop.id,
            },
          });
          continue;
        }
      }
    }
  }

  return problems;
}
