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

import {
  PipelineOutOfDateError,
  InvalidPipelineError,
  ElyraOutOfDateError,
} from "../errors";
import { nodeSpec } from "../test-utils";
import PipelineController, {
  PIPELINE_CURRENT_VERSION,
  isPipelineFlowV3,
} from "./";

describe("isPipelineFlowV3", () => {
  it("return false for null flow", () => {
    const isValid = isPipelineFlowV3(null);
    expect(isValid).toBe(false);
  });

  it("return false for undefined flow", () => {
    const isValid = isPipelineFlowV3(undefined);
    expect(isValid).toBe(false);
  });

  it("return false for non 3.0 flow", () => {
    const isValid = isPipelineFlowV3({ version: "2.3" });
    expect(isValid).toBe(false);
  });

  it("return false for non array pipelines field", () => {
    const isValid = isPipelineFlowV3({ version: "3.0", pipelines: "cat" });
    expect(isValid).toBe(false);
  });

  it("return false no pipelines array", () => {
    const isValid = isPipelineFlowV3({ version: "3.0" });
    expect(isValid).toBe(false);
  });

  it("return false for empty pipelines array", () => {
    const isValid = isPipelineFlowV3({ version: "3.0", pipelines: [] });
    expect(isValid).toBe(false);
  });

  it("return false for non number pipeline version", () => {
    const isValid = isPipelineFlowV3({
      version: "3.0",
      pipelines: [{ app_data: { version: "3" } }],
    });
    expect(isValid).toBe(false);
  });

  it("return true for no app_data", () => {
    const isValid = isPipelineFlowV3({
      version: "3.0",
      pipelines: [{}],
    });
    expect(isValid).toBe(true);
  });

  it("return true for no version", () => {
    const isValid = isPipelineFlowV3({
      version: "3.0",
      pipelines: [{ app_data: {} }],
    });
    expect(isValid).toBe(true);
  });

  it("return true for number version", () => {
    const isValid = isPipelineFlowV3({
      version: "3.0",
      pipelines: [{ app_data: { version: 0 } }],
    });
    expect(isValid).toBe(true);
  });
});

describe("open", () => {
  it("should throw for an invalid pipeline", () => {
    const controller = new PipelineController();
    function open() {
      controller.open({
        version: "3.0",
        pipelines: [{ app_data: { version: "3" } }],
      });
    }
    expect(open).toThrow(new InvalidPipelineError());
  });

  it("should throw for an out of date pipeline with no version", () => {
    const controller = new PipelineController();
    function open() {
      controller.open({
        version: "3.0",
        pipelines: [{}],
      });
    }
    expect(open).toThrow(new PipelineOutOfDateError());
  });

  it("should throw for an out of date pipeline", () => {
    const controller = new PipelineController();
    function open() {
      controller.open({
        version: "3.0",
        pipelines: [{ app_data: { version: 1 } }],
      });
    }
    expect(open).toThrow(new PipelineOutOfDateError());
  });

  it("should throw for an out of date elyra", () => {
    const controller = new PipelineController();
    function open() {
      controller.open({
        version: "3.0",
        pipelines: [{ app_data: { version: PIPELINE_CURRENT_VERSION + 1 } }],
      });
    }
    expect(open).toThrow(new ElyraOutOfDateError());
  });

  it("should open a valid pipeline", () => {
    const controller = new PipelineController();
    function open() {
      controller.open({
        version: "3.0",
        pipelines: [{ app_data: { version: PIPELINE_CURRENT_VERSION } }],
      });
    }

    expect(open).not.toThrow();
    expect(controller.getPipelineFlow().pipelines).toHaveLength(1);
    expect(controller.getPipelineFlow().pipelines[0].app_data?.version).toBe(
      PIPELINE_CURRENT_VERSION
    );
  });

  it("should open a null pipeline", () => {
    const controller = new PipelineController();
    function open() {
      controller.open(null);
    }

    expect(open).not.toThrow();
    expect(controller.getPipelineFlow().pipelines).toHaveLength(1);
    expect(controller.getPipelineFlow().pipelines[0].app_data?.version).toBe(
      PIPELINE_CURRENT_VERSION
    );
  });

  it("should open an undefined pipeline", () => {
    const controller = new PipelineController();
    function open() {
      controller.open(null);
    }

    expect(open).not.toThrow();
    expect(controller.getPipelineFlow().pipelines).toHaveLength(1);
    expect(controller.getPipelineFlow().pipelines[0].app_data?.version).toBe(
      PIPELINE_CURRENT_VERSION
    );
  });

  it("should not attempt to re-open the same pipeline", () => {
    const pipeline = {
      version: "3.0",
      pipelines: [{ app_data: { version: 1 } }],
    };

    const controller = new PipelineController();
    function open() {
      controller.open(pipeline);
    }
    expect(open).toThrow(new PipelineOutOfDateError());
    expect(open).not.toThrow();
  });

  it("should attempt to re-open the same pipeline if they are not the same reference", () => {
    const controller = new PipelineController();
    function open() {
      const pipeline = {
        version: "3.0",
        pipelines: [{ app_data: { version: 1 } }],
      };
      controller.open(pipeline);
    }
    expect(open).toThrow(new PipelineOutOfDateError());
    expect(open).toThrow(new PipelineOutOfDateError());
  });
});

describe("setNodes", () => {
  it("sets the nodes", () => {
    const controller = new PipelineController();
    controller.setNodes([
      {
        op: "example-op",
        label: "example-label",
        description: "example-description",
      },
    ]);

    const paletteNode = controller.getPaletteNode("example-op") as any;
    expect(paletteNode.app_data.ui_data.label).toBe("example-label");
  });

  it("sets the nodes with an image", () => {
    const controller = new PipelineController();
    controller.setNodes([
      {
        op: "example-op",
        label: "example-label",
        description: "example-description",
        image: "example-image",
      },
    ]);

    const paletteNode = controller.getPaletteNode("example-op") as any;
    expect(paletteNode.app_data.ui_data.image).toBe("example-image");
  });
});

describe("addNode", () => {
  it("adds a node at specified location", () => {
    const controller = new PipelineController();
    controller.setNodes([
      {
        op: "example-op",
        label: "example-label",
        description: "example-description",
      },
    ]);

    const editActionHandler = jest.fn();
    controller.editActionHandler = editActionHandler;

    controller.addNode({ op: "example-op", x: 15, y: 20 });

    expect(editActionHandler).toHaveBeenCalledTimes(1);
    expect(editActionHandler.mock.calls[0][0].offsetX).toBe(15);
    expect(editActionHandler.mock.calls[0][0].offsetY).toBe(20);
  });

  it("adds a node at a default location", () => {
    const controller = new PipelineController();
    controller.setNodes([
      {
        op: "example-op",
        label: "example-label",
        description: "example-description",
      },
    ]);

    const editActionHandler = jest.fn();
    controller.editActionHandler = editActionHandler;

    controller.addNode({ op: "example-op" });

    expect(editActionHandler).toHaveBeenCalledTimes(1);
    expect(editActionHandler.mock.calls[0][0].offsetX).toBe(40);
    expect(editActionHandler.mock.calls[0][0].offsetY).toBe(40);
  });
});

describe("setNodeErrors", () => {
  it("styles nothing for an empty object", () => {
    const controller = new PipelineController();

    const setObjectsStyle = jest.fn();
    const setNodeDecorations = jest.fn();
    controller.setObjectsStyle = setObjectsStyle;
    controller.setNodeDecorations = setNodeDecorations;

    controller.setNodeErrors({});

    expect(setObjectsStyle).toHaveBeenCalledTimes(1);
    expect(setObjectsStyle).toHaveBeenCalledWith({}, expect.anything(), true);

    expect(setNodeDecorations).not.toHaveBeenCalled();
  });

  it("styles multiple nodes across multiple pipelines", () => {
    const controller = new PipelineController();

    const setObjectsStyle = jest.fn();
    const setNodeDecorations = jest.fn();
    controller.setObjectsStyle = setObjectsStyle;
    controller.setNodeDecorations = setNodeDecorations;

    controller.setNodeErrors({
      pipeline1: ["node1"],
      pipeline2: ["node2", "node3"],
    });

    expect(setObjectsStyle).toHaveBeenCalledTimes(1);
    expect(setObjectsStyle).toHaveBeenCalledWith(
      {
        pipeline1: ["node1"],
        pipeline2: ["node2", "node3"],
      },
      expect.anything(),
      true
    );

    expect(setNodeDecorations).toHaveBeenCalledTimes(3);
    expect(setNodeDecorations.mock.calls[0][0]).toBe("node1");
    expect(setNodeDecorations.mock.calls[0][2]).toBe("pipeline1");
    expect(setNodeDecorations.mock.calls[1][0]).toBe("node2");
    expect(setNodeDecorations.mock.calls[1][2]).toBe("pipeline2");
    expect(setNodeDecorations.mock.calls[2][0]).toBe("node3");
    expect(setNodeDecorations.mock.calls[2][2]).toBe("pipeline2");
  });
});

describe("setLinkErrors", () => {
  it("styles nothing for an empty object", () => {
    const controller = new PipelineController();

    const setLinksStyle = jest.fn();
    controller.setLinksStyle = setLinksStyle;

    controller.setLinkErrors({});

    expect(setLinksStyle).toHaveBeenCalledTimes(1);
    expect(setLinksStyle).toHaveBeenCalledWith({}, expect.anything(), true);
  });

  it("styles multiple links across multiple pipelines", () => {
    const controller = new PipelineController();

    const setLinksStyle = jest.fn();
    controller.setLinksStyle = setLinksStyle;

    controller.setLinkErrors({
      pipeline1: ["link1"],
      pipeline2: ["link2", "link3"],
    });

    expect(setLinksStyle).toHaveBeenCalledTimes(1);
    expect(setLinksStyle).toHaveBeenCalledWith(
      {
        pipeline1: ["link1"],
        pipeline2: ["link2", "link3"],
      },
      expect.anything(),
      true
    );
  });
});

describe("setSupernodeErrors", () => {
  it("doesn't style any nodes if pipeline isn't a subflow of any supernodes", () => {
    const controller = new PipelineController();

    const setNodeErrors = jest.fn();
    controller.setNodeErrors = setNodeErrors;

    controller.setSupernodeErrors(["pipeline1"]);

    expect(setNodeErrors).toHaveBeenCalledTimes(1);
    expect(setNodeErrors).toHaveBeenCalledWith({});
  });

  it("styles a supernode when a pipeline with errors is a subflow of it", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "supernode1",
              type: "super_node",
              subflow_ref: {
                pipeline_id_ref: "pipeline2",
              },
            },
          ],
        },
        {
          id: "pipeline2",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [],
        },
      ],
    };

    controller.open(pipeline);

    const setNodeErrors = jest.fn();
    controller.setNodeErrors = setNodeErrors;

    controller.setSupernodeErrors(["pipeline1", "pipeline2"]);

    expect(setNodeErrors).toHaveBeenCalledTimes(1);
    expect(setNodeErrors).toHaveBeenCalledWith({ pipeline1: ["supernode1"] });
  });

  it("styles multiple supernodes when a pipeline with errors is a subflow of it", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "supernode1",
              type: "super_node",
              subflow_ref: {
                pipeline_id_ref: "pipeline2",
              },
            },
            {
              id: "supernode2",
              type: "super_node",
              subflow_ref: {
                pipeline_id_ref: "pipeline3",
              },
            },
          ],
        },
        {
          id: "pipeline2",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [],
        },
        {
          id: "pipeline3",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [],
        },
      ],
    };

    controller.open(pipeline);

    const setNodeErrors = jest.fn();
    controller.setNodeErrors = setNodeErrors;

    controller.setSupernodeErrors(["pipeline1", "pipeline2", "pipeline3"]);

    expect(setNodeErrors).toHaveBeenCalledTimes(1);
    expect(setNodeErrors).toHaveBeenCalledWith({
      pipeline1: ["supernode1", "supernode2"],
    });
  });
});

describe("findExecutionNode", () => {
  it("can find a node", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node-to-find",
              type: "execution_node",
            },
          ],
        },
      ],
    };
    controller.open(pipeline);

    const node = controller.findExecutionNode("node-to-find");
    expect(node?.id).toBe("node-to-find");
  });

  it("can find a node in any pipeline", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [],
        },
        {
          id: "pipeline2",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node-to-find",
              type: "execution_node",
            },
          ],
        },
      ],
    };
    controller.open(pipeline);

    const node = controller.findExecutionNode("node-to-find");
    expect(node?.id).toBe("node-to-find");
  });

  it("doesn't find nodes that aren't 'execution_node' type", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node-to-find",
              type: "super_node",
            },
          ],
        },
      ],
    };
    controller.open(pipeline);

    const node = controller.findExecutionNode("node-to-find");
    expect(node).toBeUndefined();
  });
});

describe("findNodeParentPipeline", () => {
  it("can find a parent", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node-to-find",
              type: "execution_node",
            },
          ],
        },
      ],
    };
    controller.open(pipeline);

    const search = controller.findNodeParentPipeline("node-to-find");
    expect(search?.id).toBe("pipeline1");
  });

  it("can find a parent of a node in any pipeline", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [],
        },
        {
          id: "pipeline2",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node-to-find",
              type: "execution_node",
            },
          ],
        },
      ],
    };
    controller.open(pipeline);

    const search = controller.findNodeParentPipeline("node-to-find");
    expect(search?.id).toBe("pipeline2");
  });

  it("can find parent of any node type", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node-to-find",
              type: "super_node",
            },
          ],
        },
      ],
    };
    controller.open(pipeline);

    const search = controller.findNodeParentPipeline("node-to-find");
    expect(search?.id).toBe("pipeline1");
  });

  it("returns undefined for a not found node", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [],
        },
      ],
    };
    controller.open(pipeline);

    const search = controller.findNodeParentPipeline("node-to-find");
    expect(search).toBeUndefined();
  });
});

describe("properties", () => {
  it("returns an empty list for no properties", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node-to-find",
              type: "execution_node",
              op: "fake",
            },
          ],
        },
      ],
    };
    controller.open(pipeline);

    const properties = controller.properties("node-to-find");
    expect(properties).toHaveLength(0);
  });

  it("returns an empty list for non spec properties", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node-to-find",
              type: "execution_node",
              op: "fake",
              app_data: {
                filename: "example.py",
              },
            },
          ],
        },
      ],
    };
    controller.open(pipeline);

    const properties = controller.properties("node-to-find");
    expect(properties).toHaveLength(0);
  });

  it("returns node properties", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node-to-find",
              type: "execution_node",
              op: "execute-notebook-node",
              app_data: {
                filename: "example.py",
              },
            },
          ],
        },
      ],
    };
    controller.open(pipeline);
    controller.setNodes([nodeSpec as any]);

    const properties = controller.properties("node-to-find");
    expect(properties).toHaveLength(6);
    expect(properties[0].label).toBe("File");
    expect(properties[0].value).toBe("example.py");
  });

  it("returns node properties when app_data is undefined", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node-to-find",
              type: "execution_node",
              op: "execute-notebook-node",
            },
          ],
        },
      ],
    };
    controller.open(pipeline);
    controller.setNodes([nodeSpec as any]);

    const properties = controller.properties("node-to-find");
    expect(properties).toHaveLength(6);
  });

  it("returns an empty list for non 'execution_node' nodes", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node-to-find",
              type: "super_node",
            },
          ],
        },
      ],
    };
    controller.open(pipeline);

    const properties = controller.properties("node-to-find");
    expect(properties).toHaveLength(0);
  });
});

describe("setInvalidNode", () => {
  it("sets style for an unsupported node", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node-to-find",
              type: "execution_node",
              op: "fake",
            },
          ],
        },
      ],
    };
    controller.open(pipeline);

    const setNodeProperties = jest.fn();
    const setNodeLabel = jest.fn();
    controller.setNodeProperties = setNodeProperties;
    controller.setNodeLabel = setNodeLabel;

    controller.setInvalidNode("pipeline1", "node-to-find");

    expect(setNodeProperties).toHaveBeenCalledTimes(1);
    expect(setNodeProperties).toHaveBeenCalledWith(
      "node-to-find",
      expect.anything(),
      "pipeline1"
    );
    expect(setNodeProperties.mock.calls[0][1].app_data.invalidNodeError).toBe(
      '"fake" is an unsupported node type'
    );

    expect(setNodeLabel).toHaveBeenCalledTimes(1);
    expect(setNodeLabel).toHaveBeenCalledWith(
      "node-to-find",
      "unsupported node",
      "pipeline1"
    );
  });

  it("doesn't set style for supernodes", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node-to-find",
              type: "super_node",
            },
          ],
        },
      ],
    };
    controller.open(pipeline);

    const setNodeProperties = jest.fn();
    const setNodeLabel = jest.fn();
    controller.setNodeProperties = setNodeProperties;
    controller.setNodeLabel = setNodeLabel;

    controller.setInvalidNode("pipeline1", "node-to-find");

    expect(setNodeProperties).not.toHaveBeenCalled();
    expect(setNodeLabel).not.toHaveBeenCalled();
  });
});

describe("resetStyles", () => {
  it("doesn't make unnecessary setNodeDecorations calls", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node1",
              type: "execution_node",
              app_data: {
                ui_data: {
                  decorations: [],
                },
              },
            },
          ],
        },
      ],
    };
    controller.open(pipeline);

    const setNodeDecorations = jest.fn();
    controller.setNodeDecorations = setNodeDecorations;

    controller.resetStyles();

    expect(setNodeDecorations).not.toHaveBeenCalled();
  });

  it("removes any decorations", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node1",
              type: "execution_node",
              app_data: {
                ui_data: {
                  decorations: [{}],
                },
              },
            },
          ],
        },
      ],
    };
    controller.open(pipeline);

    const setNodeDecorations = jest.fn();
    controller.setNodeDecorations = setNodeDecorations;

    controller.resetStyles();

    expect(setNodeDecorations).toHaveBeenCalledTimes(1);
    expect(setNodeDecorations).toHaveBeenCalledWith("node1", [], "pipeline1");
  });

  it("doesn't make any setNodeXXX calls when node is not a super_node or execution_node", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node1",
              type: "fake",
              app_data: {
                ui_data: {
                  decorations: [{}],
                },
              },
            },
          ],
        },
      ],
    };
    controller.open(pipeline);

    const setNodeDecorations = jest.fn();
    const setNodeLabel = jest.fn();
    const setNodeProperties = jest.fn();

    controller.setNodeDecorations = setNodeDecorations;
    controller.setNodeLabel = setNodeLabel;
    controller.setNodeProperties = setNodeProperties;

    controller.resetStyles();

    expect(setNodeDecorations).not.toHaveBeenCalled();
    expect(setNodeLabel).not.toHaveBeenCalled();
    expect(setNodeProperties).not.toHaveBeenCalled();
  });

  it("only updates decorations for super_node", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node1",
              type: "super_node",
              app_data: {
                ui_data: {
                  decorations: [{}],
                },
              },
            },
          ],
        },
      ],
    };
    controller.open(pipeline);

    const setNodeDecorations = jest.fn();
    const setNodeLabel = jest.fn();
    const setNodeProperties = jest.fn();

    controller.setNodeDecorations = setNodeDecorations;
    controller.setNodeLabel = setNodeLabel;
    controller.setNodeProperties = setNodeProperties;

    controller.resetStyles();

    expect(setNodeDecorations).toHaveBeenCalledTimes(1);
    expect(setNodeDecorations).toHaveBeenCalledWith("node1", [], "pipeline1");
    expect(setNodeLabel).not.toHaveBeenCalled();
    expect(setNodeProperties).not.toHaveBeenCalled();
  });

  it("doesn't unnecessarily update the label", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node1",
              type: "execution_node",
              op: "execute-notebook-node",
              app_data: {
                filename: "example.py",
                ui_data: {
                  label: "example.py",
                },
              },
            },
          ],
        },
      ],
    };
    controller.open(pipeline);
    controller.setNodes([nodeSpec as any]);

    const setNodeLabel = jest.fn();

    controller.setNodeLabel = setNodeLabel;

    controller.resetStyles();

    expect(setNodeLabel).not.toHaveBeenCalled();
  });

  it("updates the label", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node1",
              type: "execution_node",
              op: "execute-notebook-node",
              app_data: {
                ui_data: {
                  label: "old label",
                },
              },
            },
          ],
        },
      ],
    };
    controller.open(pipeline);
    controller.setNodes([nodeSpec as any]);

    controller.resetStyles();

    const flow = controller.getPipelineFlow();
    expect(flow.pipelines[0].nodes[0].app_data?.ui_data?.label).toBe(
      "Notebook"
    );
  });

  it("updates the label with filename", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node1",
              type: "execution_node",
              op: "execute-notebook-node",
              app_data: {
                filename: "example.py",
                ui_data: {
                  label: "old label",
                },
              },
            },
          ],
        },
      ],
    };
    controller.open(pipeline);
    controller.setNodes([nodeSpec as any]);

    controller.resetStyles();

    const flow = controller.getPipelineFlow();
    expect(flow.pipelines[0].nodes[0].app_data?.ui_data?.label).toBe(
      "example.py"
    );
  });

  it("doesn't unnecessarily update properties", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node1",
              type: "execution_node",
              op: "execute-notebook-node",
              app_data: {
                filename: "example.py",
                invalidNodeError: undefined,
                ui_data: {
                  image: undefined,
                  description: "Notebook file",
                },
              },
            },
          ],
        },
      ],
    };
    controller.open(pipeline);
    controller.setNodes([nodeSpec as any]);

    const setNodeProperties = jest.fn();
    controller.setNodeProperties = setNodeProperties;

    controller.resetStyles();

    expect(setNodeProperties).not.toHaveBeenCalled();
  });

  it("removes invalid node errors without removing any other properties", () => {
    const controller = new PipelineController();

    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node1",
              type: "execution_node",
              op: "execute-notebook-node",
              app_data: {
                filename: "example.py",
                invalidNodeError: "some error",
              },
            },
          ],
        },
      ],
    };
    controller.open(pipeline);
    controller.setNodes([nodeSpec as any]);

    controller.resetStyles();

    const flow = controller.getPipelineFlow();
    expect(flow.pipelines[0].nodes[0].app_data?.filename).toBe("example.py");
    expect(
      flow.pipelines[0].nodes[0].app_data?.invalidNodeError
    ).toBeUndefined();
  });
});

describe("validate", () => {
  it("finds all the problems", () => {
    const controller = new PipelineController();
    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node1",
              type: "execution_node",
              op: "execute-notebook-node",
              inputs: [
                {
                  links: [
                    {
                      id: "link1",
                      node_id_ref: "node2",
                    },
                  ],
                },
              ],
            },
            {
              id: "node2",
              type: "execution_node",
              op: "fake",
              inputs: [
                {
                  links: [
                    {
                      id: "link2",
                      node_id_ref: "node1",
                    },
                  ],
                },
              ],
            },
            {
              id: "supernode1",
              type: "super_node",
            },
          ],
        },
      ],
    };
    controller.open(pipeline);
    controller.setNodes([nodeSpec as any]);

    controller.validate();

    const flow = controller.getPipelineFlow();
    expect(flow.pipelines[0].nodes[0].app_data?.invalidNodeError).toBeDefined();
    expect(
      flow.pipelines[0].nodes[1].app_data?.invalidNodeError
    ).toBeUndefined();
    expect(
      flow.pipelines[0].nodes[2].app_data?.invalidNodeError
    ).toBeUndefined();
  });

  it("finds no problems for an op with no properties", () => {
    const controller = new PipelineController();
    const pipeline = {
      version: "3.0",
      primary_pipeline: "pipeline1",
      pipelines: [
        {
          id: "pipeline1",
          app_data: { version: PIPELINE_CURRENT_VERSION },
          nodes: [
            {
              id: "node1",
              type: "execution_node",
              op: "no-props",
            },
          ],
        },
      ],
    };
    controller.open(pipeline);
    controller.setNodes([{ op: "no-props", description: "", label: "" }]);

    controller.validate();

    const flow = controller.getPipelineFlow();
    expect(
      flow.pipelines[0].nodes[0].app_data?.invalidNodeError
    ).toBeUndefined();
  });
});
