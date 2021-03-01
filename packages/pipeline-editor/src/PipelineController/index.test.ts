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

    controller.addNode({ op: "example-op" }, { x: 15, y: 20 });

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
