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

import { validate, getNodeProblems } from "./";
import { nodeSpec } from "./test-utils";

describe("validate", () => {
  it("should return an empty array for a junk string", () => {
    const problems = validate("bad json", {});
    expect(problems).toHaveLength(0);
  });

  it("should return an empty array if there are no problems", () => {
    const pipeline = {
      pipelines: [
        {
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
        },
      ],
    };
    const problems = validate(JSON.stringify(pipeline), []);
    expect(problems).toHaveLength(0);
  });

  it("should return problems for a circular reference", () => {
    const pipeline = {
      pipelines: [
        {
          nodes: [
            {
              id: "node-1",
              type: "execution_node",
              app_data: {
                ui_data: {
                  label: "Node 1",
                },
              },
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
              app_data: {
                ui_data: {
                  label: "Node 2",
                },
              },
              inputs: [
                {
                  links: [
                    {
                      id: "link-2",
                      node_id_ref: "node-1",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    const problems = validate(JSON.stringify(pipeline), []);
    expect(problems).toHaveLength(2);
    expect(problems[0].info.type).toBe("circularReference");
    expect(problems[1].info.type).toBe("circularReference");
  });
});

describe("getNodeProblems", () => {
  it("should skip supernodes", () => {
    const pipeline = {
      nodes: [
        {
          id: "node-1",
          type: "super_node",
          app_data: {
            ui_data: {
              label: "Node 1",
            },
          },
        },
      ],
    };

    const problems = getNodeProblems(pipeline, []);
    expect(problems).toHaveLength(0);
  });

  it("should find missing properties", () => {
    const pipeline = {
      nodes: [
        {
          id: "node-1",
          type: "execution_node",
          op: "execute-notebook-node",
          app_data: {
            ui_data: {
              label: "Node 1",
            },
          },
        },
      ],
    };

    const problems = getNodeProblems(pipeline, [nodeSpec]) as any;
    expect(problems).toHaveLength(2);
    expect(problems[0].info.type).toBe("missingProperty");
    expect(problems[0].info.property).toBe("filename");
    expect(problems[1].info.type).toBe("missingProperty");
    expect(problems[1].info.property).toBe("runtime_image");
  });

  it("should find missing properties for empty strings", () => {
    const pipeline = {
      nodes: [
        {
          id: "node-1",
          type: "execution_node",
          op: "execute-notebook-node",
          app_data: {
            filename: "",
            runtime_image: "",
            ui_data: {
              label: "Node 1",
            },
          },
        },
      ],
    };

    const problems = getNodeProblems(pipeline, [nodeSpec]) as any;
    expect(problems).toHaveLength(2);
    expect(problems[0].info.type).toBe("missingProperty");
    expect(problems[0].info.property).toBe("filename");
    expect(problems[1].info.type).toBe("missingProperty");
    expect(problems[1].info.property).toBe("runtime_image");
  });

  it("should return no problems if required properties are provided", () => {
    const pipeline = {
      nodes: [
        {
          id: "node-1",
          type: "execution_node",
          op: "execute-notebook-node",
          app_data: {
            filename: "example.py",
            runtime_image: "example/runtime:1.2.3",
            ui_data: {
              label: "Node 1",
            },
          },
        },
      ],
    };

    const problems = getNodeProblems(pipeline, [nodeSpec]);
    expect(problems).toHaveLength(0);
  });

  it("should return no problems for no required properties", () => {
    const pipeline = {
      nodes: [
        {
          id: "node-1",
          type: "execution_node",
          op: "execute-notebook-node",
          app_data: {
            ui_data: {
              label: "Node 1",
            },
          },
        },
      ],
    };

    const problems = getNodeProblems(pipeline, [
      { op: "execute-notebook-node" },
    ]);
    expect(problems).toHaveLength(0);
  });

  it("should return no problems for extra properties", () => {
    const pipeline = {
      nodes: [
        {
          id: "node-1",
          type: "execution_node",
          op: "execute-notebook-node",
          app_data: {
            fake: "123",
            ui_data: {
              label: "Node 1",
            },
          },
        },
      ],
    };

    const problems = getNodeProblems(pipeline, [
      { op: "execute-notebook-node" },
    ]);
    expect(problems).toHaveLength(0);
  });
});
