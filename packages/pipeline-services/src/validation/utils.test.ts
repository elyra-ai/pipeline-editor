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

import { getLinks, getNodes, findNode, rangeForLocation } from "./utils";

describe("findNode", () => {
  it("returns undefined if node doesn't exist", () => {
    const pipeline = { nodes: [{ id: "node-1" }] };
    const node = findNode(pipeline, "node-2");
    expect(node).toBeUndefined();
  });

  it("returns the node if it exists", () => {
    const pipeline = { nodes: [{ id: "node-1" }] };
    const node = findNode(pipeline, "node-1");
    expect(node.id).toBe("node-1");
  });
});

describe("getNodes", () => {
  it("gets a list of nodes", () => {
    const pipeline = { nodes: ["I am a node"] };
    const nodes = getNodes(pipeline);
    expect(nodes).toEqual(["I am a node"]);
  });
});

describe("getLinks", () => {
  it("returns an empty list when there are no nodes", () => {
    const pipeline = { nodes: [] };
    const links = getLinks(pipeline);
    expect(links).toHaveLength(0);
  });

  it("returns an empty list when the source node doesn't exist", () => {
    const pipeline = {
      nodes: [
        {
          id: "node-1",
          type: "execution_node",
          inputs: [
            {
              links: [
                {
                  id: "link-1",
                  node_id_ref: "node-2",
                },
              ],
            },
          ],
        },
      ],
    };
    const links = getLinks(pipeline);
    expect(links).toHaveLength(0);
  });

  it("returns an empty list when there are no links", () => {
    const pipeline = {
      nodes: [
        {
          id: "node-1",
          type: "execution_node",
          inputs: [
            {
              links: [],
            },
          ],
        },
      ],
    };
    const links = getLinks(pipeline);
    expect(links).toHaveLength(0);
  });

  it("returns an empty list when links are undefined", () => {
    const pipeline = {
      nodes: [
        {
          id: "node-1",
          type: "execution_node",
          inputs: [
            {
              links: undefined,
            },
          ],
        },
      ],
    };
    const links = getLinks(pipeline);
    expect(links).toHaveLength(0);
  });

  it("returns an empty list when there are no inputs", () => {
    const pipeline = {
      nodes: [
        {
          id: "node-1",
          type: "execution_node",
          inputs: [],
        },
      ],
    };
    const links = getLinks(pipeline);
    expect(links).toHaveLength(0);
  });

  it("returns an empty list when inputs are undefined", () => {
    const pipeline = {
      nodes: [
        {
          id: "node-1",
          type: "execution_node",
          inputs: undefined,
        },
      ],
    };
    const links = getLinks(pipeline);
    expect(links).toHaveLength(0);
  });

  it("returns link between two nodes", () => {
    const pipeline = {
      nodes: [
        {
          id: "node-1",
          type: "execution_node",
          inputs: [
            {
              links: [
                {
                  id: "link-1",
                  node_id_ref: "node-2",
                },
              ],
            },
          ],
        },
        {
          id: "node-2",
          type: "execution_node",
        },
      ],
    };
    const links = getLinks(pipeline);
    expect(links).toHaveLength(1);
    expect(links[0].id).toBe("link-1");
    expect(links[0].srcNodeId).toBe("node-2");
    expect(links[0].trgNodeId).toBe("node-1");
  });
});

describe("rangeForLocation", () => {
  it("returns 0,0 for undefined", () => {
    const range = rangeForLocation(undefined);
    expect(range).toEqual({ offset: 0, length: 0 });
  });

  it("returns range for range", () => {
    const range = rangeForLocation({ offset: 10, length: 10 } as Node);
    expect(range).toEqual({ offset: 10, length: 10 });
  });
});
