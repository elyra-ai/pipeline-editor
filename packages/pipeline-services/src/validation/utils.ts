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

import { Node } from "jsonc-parser";

import { Link } from "./types";

export function getLinks(pipeline: any) {
  let links: Link[] = [];
  for (const [n, node] of pipeline.nodes.entries()) {
    for (const [i, input] of node.inputs?.entries() ?? []) {
      if (input.links !== undefined) {
        for (const [l, link] of input.links.entries()) {
          if (findNode(pipeline, link.node_id_ref) !== undefined) {
            links.push({
              id: link.id,
              trgNodeId: node.id,
              srcNodeId: link.node_id_ref,
              // TODO: handle link type
              type: "",
              path: ["nodes", n, "inputs", i, "links", l],
            });
          }
        }
      }
    }
  }
  return links;
}

export function getNodes(pipeline: any): any[] {
  return pipeline.nodes;
}

export function findNode(pipeline: any, id: string) {
  return pipeline.nodes.find((node: any) => node.id === id);
}

export function rangeForLocation(location: Node | undefined) {
  return {
    offset: location?.offset ?? 0,
    length: location?.length ?? 0,
  };
}
