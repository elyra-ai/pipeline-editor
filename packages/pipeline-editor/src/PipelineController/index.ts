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

import path from "path";

import {
  CanvasController,
  ExecutionNodeDef,
  NodeTypeDef,
  PipelineFlowV3,
} from "@elyra/canvas";
import { checkCircularReferences } from "@elyra/pipeline-validation";
import { nanoid } from "nanoid";

import { CustomNodeSpecification } from "../types";
import {
  ElyraOutOfDateError,
  PipelineOutOfDateError,
  UnknownVersionError,
} from "./../errors";
import { createPalette } from "./create-palette";

const PIPELINE_CURRENT_VERSION = 3;

interface AddNodeOptions {
  x?: number;
  y?: number;
}

// TODO: use function from `@elyra/pipeline-validation`
function validateProperties(
  nodeDef: CustomNodeSpecification,
  node: any
): string | undefined {
  const errors: string[] = [];
  for (const prop of nodeDef.properties?.parameters ?? []) {
    // this should be safe because a boolean can't be required
    // otherwise we would need to check strings for undefined or empty string
    if (prop.required && !node.app_data[prop.id]) {
      const label = nodeDef.properties?.uihints?.parameter_info.find(
        (p) => p.parameter_ref === prop.id
      )?.label.default;
      errors.push(`property "${label}" is required`);
      continue;
    }
  }

  if (errors.length > 0) {
    return errors.join("\n");
  }
  return;
}

class PipelineController extends CanvasController {
  private nodes: CustomNodeSpecification[] = [];
  private lastOpened: PipelineFlowV3 | undefined;

  open(pipelineJson: PipelineFlowV3) {
    // if pipeline is null create a new one from scratch.
    if (pipelineJson === undefined) {
      pipelineJson = this.getPipelineFlow();
      // NOTE: We should be guaranteed app_data is defined here.
      pipelineJson.pipelines[0].app_data!.version = PIPELINE_CURRENT_VERSION;
    }

    if (this.lastOpened === pipelineJson) {
      return;
    }
    this.lastOpened = pipelineJson;

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
    if (version < PIPELINE_CURRENT_VERSION) {
      throw new PipelineOutOfDateError();
    }

    // we should only reach here if the version isn't a number
    throw new UnknownVersionError();
  }

  private _getNode(nodeID: string): any {
    const pipelineID = this.getPrimaryPipelineId();
    const node = this.getNode(nodeID, pipelineID);
    if (node) {
      return node;
    }
    // If the node is in a supernode, search supernodes for it
    const superNodes = this.getSupernodes(pipelineID);
    for (const superNode of superNodes) {
      const superNodePipelineID = superNode.subflow_ref.pipeline_id_ref;
      const node = this.getNode(nodeID, superNodePipelineID);
      if (node) {
        return node;
      }
    }
  }

  setNodes(nodes: CustomNodeSpecification[]) {
    this.nodes = nodes;
    const palette = createPalette(this.nodes);
    this.setPipelineFlowPalette(palette);
  }

  addNode(item: any, { x, y }: AddNodeOptions = {}): void {
    const nodeTemplate = this.getPaletteNode(item.op);
    const data = {
      editType: "createNode",
      offsetX: x || 40,
      offsetY: y || 40,
      nodeTemplate: this.convertNodeTemplate(nodeTemplate),
    };
    let env_vars = item.env_vars || [];
    data.nodeTemplate.label = path.parse(item.path).base;
    data.nodeTemplate.app_data.filename = item.path;
    data.nodeTemplate.app_data.runtime_image = "";
    data.nodeTemplate.app_data.env_vars = env_vars;
    data.nodeTemplate.app_data.include_subdirectories = false;
    this.editActionHandler(data);
  }

  private _styleNode(node: any): void {
    const pipelineId = this.getPrimaryPipelineId();
    const nodeToBeStyled = { [pipelineId]: [node.id] };

    const defaultStyle = {
      body: { default: "" },
      selection_outline: { default: "" },
      label: { default: "" },
    };

    const errorStyle = {
      body: { default: "stroke: var(--elyra-color-error-border);" },
      selection_outline: {
        default: "stroke: var(--elyra-color-error-border);",
      },
    };

    const image =
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="#da1e28" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="#ffffff"></circle><path d="M8,1C4.2,1,1,4.2,1,8s3.2,7,7,7s7-3.1,7-7S11.9,1,8,1z M7.5,4h1v5h-1C7.5,9,7.5,4,7.5,4z M8,12.2	c-0.4,0-0.8-0.4-0.8-0.8s0.3-0.8,0.8-0.8c0.4,0,0.8,0.4,0.8,0.8S8.4,12.2,8,12.2z"></path><path d="M7.5,4h1v5h-1C7.5,9,7.5,4,7.5,4z M8,12.2c-0.4,0-0.8-0.4-0.8-0.8s0.3-0.8,0.8-0.8	c0.4,0,0.8,0.4,0.8,0.8S8.4,12.2,8,12.2z" data-icon-path="inner-path" opacity="0"></path></svg>'
      );

    const indicator = {
      id: "error",
      image: image,
      outline: false,
      position: "topRight",
      x_pos: -24,
      y_pos: -8,
    };

    if (node.app_data.invalidNodeError !== undefined) {
      this.setObjectsStyle(nodeToBeStyled, errorStyle, true);
      this.setNodeDecorations(node.id, [indicator], pipelineId);
    } else {
      this.setObjectsStyle(nodeToBeStyled, defaultStyle, true);
      this.setNodeDecorations(node.id, [], pipelineId);
    }
  }

  private _checkCircularReferences(): void {
    const links = this.getLinks();

    const taintedLinks = checkCircularReferences(links);

    for (const l of links) {
      if (taintedLinks.includes(l.id)) {
        this.setLinkProperties(l.id, {
          id: nanoid(), // forces think to actually be redrawn.
          class_name: "d3-data-link-error",
        });
      } else {
        this.setLinkProperties(l.id, {
          id: nanoid(), // forces think to actually be redrawn.
          class_name:
            l.type === "nodeLink" ? "d3-data-link" : "d3-comment-link",
        });
      }
    }
  }

  // TODO: we shouldn't set anything without using the actual setters.
  private _checkEachNode() {
    const pipelineID = this.getPrimaryPipelineId();
    const nodes = this.getNodes();
    function isExecutionNode(node: NodeTypeDef): node is ExecutionNodeDef {
      return (node as ExecutionNodeDef).op !== undefined;
    }
    for (const node of nodes) {
      if (!isExecutionNode(node)) {
        // NOTE: supernode or binding, don't know if we need to validate anything?
        continue;
      }
      const nodeDef = this.nodes.find((n) => n.op === node.op);
      if (nodeDef) {
        const error = validateProperties(nodeDef, node);

        const newLabel =
          nodeDef.labelField && node.app_data?.[nodeDef.labelField]
            ? node.app_data[nodeDef.labelField]
            : nodeDef.label;

        this.setNodeProperties(
          node.id,
          {
            app_data: {
              ...node.app_data,
              invalidNodeError: error,
            },
            description: nodeDef.description,
            image: nodeDef.image,
          },
          pipelineID
        );
        this.setNodeLabel(node.id, newLabel as string, pipelineID);
      } else {
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
      this._styleNode(this._getNode(node.id));
    }
  }

  validate() {
    this._checkCircularReferences();
    this._checkEachNode();
  }

  clearErrors() {
    const links = this.getLinks();

    for (const l of links) {
      this.setLinkProperties(l.id, {
        id: nanoid(), // forces think to actually be redrawn.
        class_name: l.type === "nodeLink" ? "d3-data-link" : "d3-comment-link",
      });
    }

    const pipelineID = this.getPrimaryPipelineId();
    const nodes = this.getNodes();
    for (const n of nodes) {
      const nodeToBeStyled = { [pipelineID]: [n.id] };

      const defaultStyle = {
        body: { default: "" },
        selection_outline: { default: "" },
        label: { default: "" },
      };

      this.setObjectsStyle(nodeToBeStyled, defaultStyle, false);
      this.setNodeDecorations(n.id, [], pipelineID);
    }
  }

  properties(nodeID: string) {
    const node = this._getNode(nodeID);
    const nodeDef = this.nodes.find((n) => n.op === node.op);

    const properties = (nodeDef?.properties?.uihints?.parameter_info ?? []).map(
      (p) => {
        return {
          label: p.label.default,
          value: node.app_data[p.parameter_ref],
        };
      }
    );

    return properties;
  }
}

export default PipelineController;
