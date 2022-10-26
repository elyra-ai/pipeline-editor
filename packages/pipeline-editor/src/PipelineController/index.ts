/*
 * Copyright 2018-2022 Elyra Authors
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
  CanvasController,
  PipelineFlowV3,
  PaletteV3,
  ExecutionNodeDef,
  NodeType,
} from "@elyra/canvas";
import { validate } from "@elyra/pipeline-services";
import { getDefaultFormState } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv6";
import produce from "immer";

import {
  ElyraOutOfDateError,
  PipelineOutOfDateError,
  InvalidPipelineError,
} from "./../errors";
import { getFileName, prefixedToNested } from "./utils";

export const PIPELINE_CURRENT_VERSION = 8;

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

  resolveParameterRef(op: string, ref: "filehandler") {
    const nodeDef = this.getAllPaletteNodes().find((n) => n.op === op);

    return nodeDef?.app_data.parameter_refs?.[ref];
  }

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
              properties: {},
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
    editType: "createNode" | "createAutoNode";
    nodeTemplate: {
      op: string;
    };
    offsetX?: number;
    offsetY?: number;
    pipelineId?: string;
    path?: string;
    onPropertiesUpdateRequested?(options: { filename: string }): Promise<any>;
    [key: string]: any;
  }) {
    const {
      path,
      onPropertiesUpdateRequested,
      offsetX,
      offsetY,
      nodeTemplate: { op },
      ...rest
    } = item;

    const nodeTemplate: any = this.getPaletteNode(op);
    const defaults =
      getDefaultFormState(validator, nodeTemplate.app_data.properties ?? {}) ??
      {};
    defaults.label = "";
    nodeTemplate.app_data = defaults;

    const data = {
      ...rest,
      finalized: true,
      offsetX: offsetX ?? 40,
      offsetY: offsetY ?? 40,
      nodeTemplate: this.convertNodeTemplate(nodeTemplate),
    };

    const filenameRef = this.resolveParameterRef(op, "filehandler");

    if (path && filenameRef) {
      if (data.nodeTemplate.app_data.component_parameters === undefined) {
        data.nodeTemplate.app_data.component_parameters = {};
      }
      data.nodeTemplate.app_data.component_parameters[filenameRef] = path;
      if (typeof onPropertiesUpdateRequested === "function") {
        const properties = await onPropertiesUpdateRequested(
          data.nodeTemplate.app_data
        );

        const {
          component_parameters: oldComponentParameters,
          ...oldAppData
        } = data.nodeTemplate.app_data;

        const {
          component_parameters: newComponentParameters,
          ...newAppData
        } = properties;

        data.nodeTemplate.app_data = {
          ...oldAppData,
          ...newAppData,
          component_parameters: {
            ...oldComponentParameters,
            ...newComponentParameters,
          },
        };
      }
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

  getLabelForNode(node: ExecutionNodeDef, nodeDef: NodeType): string {
    let newLabel = nodeDef.app_data.ui_data?.label;

    const filenameRef = this.resolveParameterRef(node.op, "filehandler");
    const parameters = node.app_data?.component_parameters;
    if (
      filenameRef &&
      typeof parameters?.[filenameRef] === "string" &&
      parameters?.[filenameRef] !== ""
    ) {
      newLabel = getFileName(parameters[filenameRef], {
        withExtension: SHOW_EXTENSIONS,
      });
    }

    if (
      typeof node.app_data!.label === "string" &&
      node.app_data!.label !== ""
    ) {
      newLabel = node.app_data!.label;
    }

    return newLabel ?? "";
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

        const newLabel = this.getLabelForNode(node, nodeDef);
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
                // TODO: we can remove this eventually. Removing it now won't
                // cause any harm, but all pipelines with the field would have
                // it until manually deleted.
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
            problem.info.nodeID ?? "",
          ];
          break;
        case "invalidProperty":
          nodesWithErrors[problem.info.pipelineID] = [
            ...(nodesWithErrors[problem.info.pipelineID] ?? []),
            problem.info.nodeID ?? "",
          ];
          break;
        case "missingComponent":
          nodesWithErrors[problem.info.pipelineID] = [
            ...(nodesWithErrors[problem.info.pipelineID] ?? []),
            problem.info.nodeID,
          ];
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
    nodes = this.propagatePipelineDefaultProperties(nodes, this.palette);

    return nodes;
  }

  // Updates the uihints to include pipeline default
  addPipelineDefaultUihints(
    schema: any,
    propValue: any,
    existingPlaceholder?: any
  ) {
    return produce(schema.uihints ?? {}, (draft: any) => {
      if (schema.enum) {
        const valueIndex = schema.enum.indexOf(propValue);
        const propLabel = schema.enumNames?.[valueIndex] ?? propValue;
        if (propLabel) {
          draft["ui:placeholder"] = `Use pipeline default: [${propLabel}]`;
          draft.pipeline_default = true;
        }
      } else if (schema.type === "number") {
        // If the placeholder is already the value of the pipeline default,
        // don't add in the pipeline default text
        if (existingPlaceholder !== propValue) {
          draft["ui:placeholder"] = `${propValue} (pipeline default)`;
          draft.pipeline_default = true;
        } else {
          // Added this to make sure that the placeholder is given as a string
          draft["ui:placeholder"] = `${existingPlaceholder}`;
        }
      } else if (schema.type === "array") {
        draft.pipeline_defaults = propValue;
      } else if (schema.type === "object") {
        for (const property in schema.properties) {
          if (propValue[property] !== undefined) {
            draft[property] = this.addPipelineDefaultUihints(
              schema.properties[property],
              propValue[property],
              schema.uihints?.[property]?.["ui:placeholder"]
            );
          }
        }
      }
    });
  }

  propagatePipelineDefaultProperties(
    nodes: NodeType[],
    palette: PaletteV3
  ): NodeType[] {
    return produce(nodes, (draft: any) => {
      const properties =
        palette.properties?.properties?.pipeline_defaults?.properties ?? {};
      for (const prop in properties) {
        const propValue = this.getPipelineFlow()?.pipelines?.[0]?.app_data
          ?.properties?.pipeline_defaults?.[prop];
        if (propValue === undefined) {
          // Skip propagation if the pipeline default isn't defined
          continue;
        }
        draft.forEach((node: any) => {
          const componentParameters =
            node.app_data.properties.properties.component_parameters;
          const nodeProp = componentParameters.properties[prop];
          if (!nodeProp) {
            // skip nodes that dont have the property
            return;
          }
          const requiredIndex = componentParameters.required?.indexOf(prop);
          if (requiredIndex > -1) {
            componentParameters.required.splice(requiredIndex, 1);
          }
          componentParameters.properties[prop].uihints = {
            ...componentParameters.properties[prop].uihints,
            ...this.addPipelineDefaultUihints(nodeProp, propValue),
          };
        });
      }
    });
  }

  getUpstreamNodes(nodeId: string) {
    const pipelineId = this.findNodeParentPipeline(nodeId)?.id ?? "";
    const upstreamNodes = this.objectModel.getHighlightObjectIds(
      pipelineId,
      [nodeId],
      "upstream"
    );
    return this.idsToNodes(
      upstreamNodes.nodes[pipelineId].filter((id: string) => id !== nodeId)
    );
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

  // TODO: only validate one node.
  errors(nodeID: string) {
    const node = this.findExecutionNode(nodeID);

    if (node?.type === "execution_node") {
      const nodes = this.getAllPaletteNodes();
      const problems = validate(JSON.stringify(this.getPipelineFlow()), nodes);

      const nodeProblems = [];

      const nodeDef = this.getAllPaletteNodes().find((n) => n.op === node.op);
      if (nodeDef === undefined) {
        return "Node type not found.";
      }
      const componentProperties = nodeDef!.app_data.properties.properties
        ?.component_parameters?.properties;

      for (const p of problems) {
        switch (p.info.type) {
          case "missingProperty":
            if (p.info.nodeID === nodeID) {
              const property = p.info.property;
              const label = componentProperties[property].title;
              nodeProblems.push(`property "${label}" is required`);
            }
            break;
          case "invalidProperty":
            if (p.info.nodeID === nodeID) {
              const property = p.info.property;
              const label = componentProperties[property].title;
              nodeProblems.push(
                `property "${label}" is invalid: ${p.info.message}`
              );
            }
            break;
          case "missingComponent":
            if (p.info.nodeID === nodeID) {
              nodeProblems.push(`component "${p.info.op}" cannot be found`);
            }
            break;
        }
      }

      if (nodeProblems.length > 0) {
        return nodeProblems.join("\n");
      }
    }

    return "";
  }

  getPropertyValue(value: any, key: string, info?: any, label?: string): any {
    if (value?.widget === "inputpath") {
      // Find the node corresponding to the input node
      const upstreamNode = this.findExecutionNode(value.value?.value ?? "");
      const upstreamNodeLabel = upstreamNode?.app_data?.ui_data?.label;
      const upstreamNodeDef = this.getAllPaletteNodes().find(
        (nodeDef) => nodeDef.op === upstreamNode?.op
      );
      if (value.value?.value && value.value.option === "") {
        return {
          label: label,
          value: upstreamNodeLabel,
        };
      }
      const component_parameters =
        upstreamNodeDef?.app_data?.properties?.properties?.component_parameters
          ?.properties ?? {};
      // Add each property with a format of outputpath to the options field
      for (const prop in component_parameters) {
        if (prop === value.value.option) {
          const upstreamNodeOption = component_parameters[prop]?.title;
          return {
            label: label,
            value: upstreamNodeLabel
              ? upstreamNodeOption
                ? `${upstreamNodeLabel}: ${upstreamNodeOption}`
                : upstreamNodeLabel
              : "No value specified.",
          };
        }
      }
      return {
        label: label,
        value: "No value specified.",
      };
    } else if (info?.uihints?.outputpath === true) {
      return {
        label: label,
        value: "This is an output of the component.",
      };
    } else if (value?.widget === "file") {
      return {
        label: label,
        value: `Input file: ${value.value}`,
      };
    } else if (value?.widget) {
      return this.getPropertyValue(
        value.value,
        key,
        info?.oneOf?.find((def: any) => {
          return def.properties?.widget?.default === value.widget;
        })?.properties?.value,
        label
      );
    } else if (info?.enum !== undefined) {
      // If no enum value is set show pipeline default value
      return {
        label: label,
        value:
          info?.data?.labels?.[value] ??
          value ??
          info?.uihints?.["ui:placeholder"],
      };
    } else if (info?.type === "array") {
      // Merge pipeline defaults prop array with node prop array
      const pipelineDefaultValue: any[] = this.getPipelineFlow()?.pipelines?.[0]
        .app_data?.properties?.pipeline_defaults?.[key];
      return {
        label: label,
        value: value
          ?.map((i: any) => {
            if (typeof i === "object") {
              let rendered = "";
              for (const key in i) {
                rendered += `${key}: ${i[key]}\n`;
              }
              return rendered;
            } else {
              return i;
            }
          })
          ?.concat(
            pipelineDefaultValue
              ?.filter((item) => !value.includes(item))
              ?.map((i) => {
                if (typeof i === "object") {
                  let rendered = "(pipeline default)";
                  for (const key in i) {
                    rendered += `\n${key}: ${i[key]}`;
                  }
                  return rendered;
                } else {
                  return i + " (pipeline default)";
                }
              }) ?? []
          ),
      };
    } else {
      return {
        label: label,
        value: value,
      };
    }
  }

  properties(nodeID: string) {
    let node = this.findExecutionNode(nodeID);

    if (node !== undefined) {
      const { op, app_data } = node;
      const nodeDef = this.getAllPaletteNodes().find((n) => n.op === op);

      const info =
        (nodeDef?.app_data.properties?.properties as any)?.component_parameters
          ?.properties ?? {};

      const properties = [];
      for (const prop in info) {
        if (info[prop].type === "null") {
          continue;
        }
        properties.push(
          this.getPropertyValue(
            app_data?.component_parameters?.[prop],
            prop,
            info[prop],
            info[prop].title
          )
        );
      }
      return properties;
    }

    return [];
  }

  updateProperties(nodeID: string, data: { [key: string]: any }) {
    const pipeline = this.findNodeParentPipeline(nodeID);
    if (pipeline !== undefined) {
      const app_data = prefixedToNested(data);
      for (const [key, val] of Object.entries(
        app_data.component_parameters ?? {}
      )) {
        if (val === undefined || val === null) {
          delete app_data.component_parameters[key];
        }
      }
      this.setNodeProperties(nodeID, { app_data }, pipeline.id);
      if (data.label !== data.ui_data?.label) {
        const node = this.getNode(nodeID, pipeline.id);
        if (node.type === "execution_node") {
          const nodeDef = this.getAllPaletteNodes().find(
            (n) => n.op === node.op
          );
          if (nodeDef) {
            const newLabel = this.getLabelForNode(node, nodeDef);
            this.setNodeLabel(nodeID, newLabel, pipeline.id);
          }
        }
      }
    }
  }
}

export default PipelineController;
export { nestedToPrefixed, prefixedToNested } from "./utils";
