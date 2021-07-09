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

import { CanvasController, PipelineFlowV3, PaletteV3 } from "@elyra/canvas";
import { validate } from "@elyra/pipeline-services";

import {
  ElyraOutOfDateError,
  PipelineOutOfDateError,
  InvalidPipelineError,
} from "./../errors";
import { getFileName } from "./utils";

export const PIPELINE_CURRENT_VERSION = 3;

// TODO: Experiment with pipeline editor settings.
const SHOW_EXTENSIONS = true;

// NOTE: This is extremely basic validation.
export function isPipelineFlowV3(pipeline: any): pipeline is PipelineFlowV3 {
  if (pipeline === undefined || pipeline === null) {
    return false;
  }
  if (pipeline.version !== "3.0") {
    return false;
  }
  if (!Array.isArray(pipeline.pipelines)) {
    return false;
  }
  if (pipeline.pipelines.length < 1) {
    return false;
  }
  if (
    pipeline.pipelines[0].app_data?.version !== undefined &&
    typeof pipeline.pipelines[0].app_data.version !== "number"
  ) {
    return false;
  }
  return true;
}

// TODO: Should update `app_data` in `PipelineFlowV3` to be non-option? or maybe
// a second type `PipelineFlowV3Opened` because `app_data` is guaranteed once
// the pipeline file has been opened by canvas.
class PipelineController extends CanvasController {
  private palette: PaletteV3 = {};
  private lastOpened: PipelineFlowV3 | undefined;

  open(pipelineJson: any) {
    // if pipeline is undefined/null create a new one from scratch.
    if (pipelineJson === undefined || pipelineJson === null) {
      pipelineJson = {
        doc_type: "pipeline",
        version: "3.0",
        json_schema:
          "http://api.dataplatform.ibm.com/schemas/common-pipeline/pipeline-flow/pipeline-flow-v3-schema.json",
        id: "elyra-auto-generated-pipeline",
        primary_pipeline: "primary",
        pipelines: [
          {
            id: "primary",
            nodes: [],
            app_data: {
              ui_data: { comments: [] },
              version: PIPELINE_CURRENT_VERSION,
            },
            runtime_ref: "",
          },
        ],
        schemas: [],
      };
    }

    // This must happen after the pipeline has been finalized, but before any
    // errors are thrown.
    if (this.lastOpened === pipelineJson) {
      return;
    }
    this.lastOpened = pipelineJson;

    if (!isPipelineFlowV3(pipelineJson)) {
      throw new InvalidPipelineError();
    }

    // TODO: Should this be primary pipeline? or can it be any?
    const version = pipelineJson.pipelines[0].app_data?.version ?? 0;

    if (version === PIPELINE_CURRENT_VERSION) {
      this.setPipelineFlow(pipelineJson);
      return;
    }

    // the pipeline was last edited in a "more recent release"
    // the user should update his version of Elyra to consume the pipeline
    if (version > PIPELINE_CURRENT_VERSION) {
      throw new ElyraOutOfDateError();
    }

    // in this case, pipeline was last edited in a "old" version of Elyra and
    // it needs to be updated/migrated.
    throw new PipelineOutOfDateError();
  }

  async addNode(item: {
    op: string;
    x?: number;
    y?: number;
    pipelineId?: string;
    path?: string;
    onPropertiesUpdateRequested?(options: { filename: string }): Promise<any>;
  }) {
    const nodeTemplate = this.getPaletteNode(item.op);

    const data = {
      editType: "createNode",
      finalized: true,
      offsetX: item.x ?? 40,
      offsetY: item.y ?? 40,
      nodeTemplate: this.convertNodeTemplate(nodeTemplate),
      pipelineId: item.pipelineId,
    };

    const nodeDef = this.getAllPaletteNodes().find((n) => n.op === item.op);
    if (nodeDef?.app_data.properties?.current_parameters) {
      data.nodeTemplate.app_data = {
        ...nodeDef?.app_data.properties?.current_parameters,
      };
    }

    if (item.path) {
      data.nodeTemplate.app_data.filename = item.path;
      const properties = await item.onPropertiesUpdateRequested?.({
        filename: item.path,
      });
      data.nodeTemplate.app_data = {
        ...data.nodeTemplate.app_data,
        ...properties,
      };
    }

    this.editActionHandler(data);
  }

  setNodeErrors(
    nodeToBeStyled: { [key: string]: string[] },
    styleOptions?: { redColor: string }
  ) {
    this.setObjectsStyle(
      nodeToBeStyled,
      {
        body: { default: `stroke: ${styleOptions?.redColor};` },
        selection_outline: { default: `stroke: ${styleOptions?.redColor};` },
      },
      true
    );

    // TODO: this shouldn't be hard-coded but we cant use css variables.
    const indicator = {
      id: "error",
      image:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          '<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="#da1e28" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="#ffffff"></circle><path d="M8,1C4.2,1,1,4.2,1,8s3.2,7,7,7s7-3.1,7-7S11.9,1,8,1z M7.5,4h1v5h-1C7.5,9,7.5,4,7.5,4z M8,12.2	c-0.4,0-0.8-0.4-0.8-0.8s0.3-0.8,0.8-0.8c0.4,0,0.8,0.4,0.8,0.8S8.4,12.2,8,12.2z"></path><path d="M7.5,4h1v5h-1C7.5,9,7.5,4,7.5,4z M8,12.2c-0.4,0-0.8-0.4-0.8-0.8s0.3-0.8,0.8-0.8	c0.4,0,0.8,0.4,0.8,0.8S8.4,12.2,8,12.2z" data-icon-path="inner-path" opacity="0"></path></svg>'
        ),
      outline: false,
      position: "topRight",
      x_pos: -24,
      y_pos: -8,
    };
    for (const [pipelineID, nodes] of Object.entries(nodeToBeStyled)) {
      for (const nodeID of nodes) {
        this.setNodeDecorations(nodeID, [indicator], pipelineID);
      }
    }
  }

  setInvalidNode(pipelineID: string, nodeID: string) {
    const node = this.getNode(nodeID, pipelineID);
    if (node.type !== "execution_node") {
      return;
    }
    // TODO: this shouldn't be "red"
    const image =
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`<svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            viewBox="0 0 22 22"
          >
            <text
              x="11"
              y="16.5"
              text-anchor="middle"
              fill="red" 
              font-family="'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif"
              font-size="15px"
            >
              ?
            </text>
          </svg>`);
    this.setNodeProperties(
      node.id,
      {
        app_data: {
          ...node.app_data,
          invalidNodeError: `"${node.op}" is an unsupported node type`,
        },
        description: undefined,
        image: image,
      },
      pipelineID
    );
    this.setNodeLabel(node.id, "unsupported node", pipelineID);
  }

  setLinkErrors(
    linkToBeStyled: { [key: string]: string[] },
    styleOptions?: { redColor: string }
  ) {
    this.setLinksStyle(
      linkToBeStyled,
      {
        line: {
          // TODO: styles - don't use !important
          default: `
            stroke: ${styleOptions?.redColor} !important; 
            stroke-width: 2;
            stroke-linecap: round;
            stroke-dasharray: 10 10;
            `,
        },
      },
      true
    );
  }

  resetStyles() {
    this.removeAllStyles();

    for (const pipeline of this.getPipelineFlow().pipelines) {
      for (const node of pipeline.nodes) {
        if (node.type !== "execution_node" && node.type !== "super_node") {
          continue;
        }
        // `setNodeDecorations` is VERY slow, so make sure we HAVE to set it
        // before setting it.
        if (
          // `app_data` and `ui_data` should always be defined.
          node.app_data!.ui_data!.decorations !== undefined &&
          node.app_data!.ui_data!.decorations.length !== 0
        ) {
          this.setNodeDecorations(node.id, [], pipeline.id);
        }

        if (node.type !== "execution_node") {
          continue;
        }

        const nodeDef = this.getAllPaletteNodes().find((n) => n.op === node.op);

        if (nodeDef === undefined) {
          // We don't have a nodedef, skipping...
          continue;
        }

        let newLabel = nodeDef.app_data.ui_data?.label;
        if (
          typeof node.app_data!.filename === "string" &&
          node.app_data!.filename !== ""
        ) {
          newLabel = getFileName(node.app_data!.filename, {
            withExtension: SHOW_EXTENSIONS,
          });
        }

        if (
          typeof node.app_data!.label === "string" &&
          node.app_data!.label !== ""
        ) {
          newLabel = node.app_data!.label;
        }

        // `setNodeLabel` is VERY slow, so make sure we HAVE to set it before
        // setting it.
        if (node.app_data!.ui_data!.label !== newLabel) {
          this.setNodeLabel(node.id, newLabel as string, pipeline.id);
        }

        if (
          // `app_data` and `ui_data` should be guaranteed.
          node.app_data!.ui_data!.description !== nodeDef.description ||
          node.app_data!.ui_data!.image !== nodeDef.app_data.ui_data?.image ||
          node.app_data!.invalidNodeError !== undefined
        ) {
          this.setNodeProperties(
            node.id,
            {
              description: nodeDef.description,
              image: nodeDef.app_data.ui_data?.image,
              app_data: {
                ...node.app_data,
                invalidNodeError: undefined,
              },
            },
            pipeline.id
          );
        }
      }
    }
  }

  setSupernodeErrors(
    pipelineIDs: string[],
    styleOptions?: { redColor: string }
  ) {
    let supernodesWithErrors: { [key: string]: string[] } = {};
    for (const pipelineID of pipelineIDs) {
      try {
        const sn = this.getSupernodeObjReferencing(pipelineID);
        supernodesWithErrors[sn.parentPipelineId] = [
          ...(supernodesWithErrors[sn.parentPipelineId] ?? []),
          sn.supernodeId,
        ];
      } catch {}
    }

    this.setNodeErrors(supernodesWithErrors, styleOptions);
  }

  // TODO: Can we find a better way to handle setting error styles? This tightly
  // couples style to the controller which isn't great. Setting a classname
  // would be better, but the CommonCanvas implementation is very buggy.
  validate(styleOptions?: { redColor: string }) {
    this.resetStyles();

    const problems = validate(
      JSON.stringify(this.getPipelineFlow()),
      this.getAllPaletteNodes()
    );

    const linksWithErrors: { [key: string]: string[] } = {};
    const nodesWithErrors: { [key: string]: string[] } = {};
    const missingProperties = [];
    for (const problem of problems) {
      switch (problem.info.type) {
        case "circularReference":
          linksWithErrors[problem.info.pipelineID] = [
            ...(linksWithErrors[problem.info.pipelineID] ?? []),
            problem.info.linkID,
          ];
          break;
        case "missingProperty":
          nodesWithErrors[problem.info.pipelineID] = [
            ...(nodesWithErrors[problem.info.pipelineID] ?? []),
            problem.info.nodeID,
          ];
          missingProperties.push({
            nodeID: problem.info.nodeID,
            property: problem.info.property,
          });
          break;
      }
    }
    this.setLinkErrors(linksWithErrors, styleOptions);
    this.setNodeErrors(nodesWithErrors, styleOptions);

    // Pass a list of all pipelineIDs that have errors. This will find and style
    // any supernodes that have the pipeline as a subflow.
    this.setSupernodeErrors(
      [
        ...new Set([
          ...Object.keys(linksWithErrors),
          ...Object.keys(nodesWithErrors),
        ]),
      ],
      styleOptions
    );

    for (const pipeline of this.getPipelineFlow().pipelines) {
      for (const node of pipeline.nodes) {
        if (node.type !== "execution_node") {
          continue;
        }

        const nodeProblems = missingProperties.filter(
          (p) => p.nodeID === node.id
        );
        if (nodeProblems.length > 0) {
          // All of this information should be defined, otherwise we wouldn't
          // have had any problems reported.
          const nodeDef = this.getAllPaletteNodes().find(
            (n) => n.op === node.op
          );

          const message = nodeProblems
            .map((problem) => {
              const label = nodeDef!.app_data.properties!.uihints!.parameter_info.find(
                (p) => p.parameter_ref === problem.property
              )!.label.default;
              return `property "${label}" is required`;
            })
            .join("\n");

          this.setNodeProperties(
            node.id,
            {
              app_data: {
                ...node.app_data,
                invalidNodeError: message,
              },
            },
            pipeline.id
          );
        }
      }
    }
  }

  setPalette(palette: any) {
    this.palette = palette;
    this.setPipelineFlowPalette(palette);
  }

  idsToNodes(nodeIDs: string[]) {
    let nodes = [];
    for (const pipeline of this.getPipelineFlow().pipelines) {
      nodes.push(...pipeline.nodes.filter((n) => nodeIDs.includes(n.id)));
    }
    return nodes;
  }

  getAllPaletteNodes() {
    if (this.palette.categories === undefined) {
      return [];
    }

    let nodes = [];
    for (const c of this.palette.categories) {
      if (c.node_types) {
        nodes.push(...c.node_types);
      }
    }

    return nodes;
  }

  findExecutionNode(nodeID: string) {
    for (const pipeline of this.getPipelineFlow().pipelines) {
      const search = pipeline.nodes.find((n) => n.id === nodeID);
      if (search !== undefined && search.type === "execution_node") {
        return search;
      }
    }
    return undefined;
  }

  findNodeParentPipeline(nodeID: string) {
    for (const pipeline of this.getPipelineFlow().pipelines) {
      const search = pipeline.nodes.find((n) => n.id === nodeID);
      if (search !== undefined) {
        return pipeline;
      }
    }
    return undefined;
  }

  properties(nodeID: string) {
    let node = this.findExecutionNode(nodeID);

    if (node !== undefined) {
      const { op, app_data } = node;
      const nodeDef = this.getAllPaletteNodes().find((n) => n.op === op);

      const info = nodeDef?.app_data.properties?.uihints?.parameter_info ?? [];

      const properties = info.map((i) => {
        return {
          label: i.label.default,
          value: app_data?.[i.parameter_ref],
        };
      });
      return properties;
    }

    return [];
  }
}

export default PipelineController;
