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

declare module "@elyra/canvas" {
  interface TipPaletteItemEvent {
    nodeTemplate: any;
  }

  interface TipPaletteCategory {
    category: any;
  }

  interface TipNode {
    pipelineId: string;
    node: any;
  }

  interface TipPort {
    pipelineId: string;
    node: any;
    port: any;
  }

  interface TipLink {
    pipelineId: string;
    link: any;
  }

  type TipEvent =
    | TipPaletteItemEvent
    | TipPaletteCategory
    | TipNode
    | TipPort
    | TipLink;

  interface CanvasEditEvent {
    editType: string;
    editSource?: "canvas" | "contextmenu";
    pipelineId?: string;
    [key: string]: any;
  }

  type ClickType = "DOUBLE_CLICK" | "SINGLE_CLICK_CONTEXTMENU" | "SINGLE_CLICK";

  type CanvasClickEvent =
    | {
        clickType: ClickType;
        objectType: "canvas";
        selectedObjectIds: string[];
      }
    | {
        clickType: ClickType;
        objectType: "node" | "link" | "comment";
        selectedObjectIds: string[];
        id: string;
        pipelineId: string;
      };

  type ContextMenu = ContextMenuItem[];

  interface ContextMenuItem {
    action: string;
    label: string;
    menu?: ContextMenuItem[];
    enable?: boolean;
  }

  interface ContextMenuEvent {
    type: string;
    selectedObjectIds: string[];
    targetObject: any;
  }

  interface CanvasSelectionEvent {
    selectedNodes: NodeTypeDef[];
  }

  interface CommonCanvasProps {
    canvasController: CanvasController;
    contextMenuHandler?: (
      e: ContextMenuEvent,
      defaultMenu: ContextMenu
    ) => void;
    clickActionHandler?: (e: CanvasClickEvent) => void;
    editActionHandler?: (e: CanvasEditEvent) => void;
    selectionChangeHandler?: (e: CanvasSelectionEvent) => void;
    tipHandler?: (tipType: string, e: TipEvent) => void;
    toolbarConfig: any[];
    config: {
      enableInternalObjectModel?: boolean;
      emptyCanvasContent?: any;
      enablePaletteLayout?: "Flyout" | "None" | "Modal";
      enableNodeFormatType?: "Horizontal";
      enableToolbarLayout?: "None" | "Top";
      enableNodeLayout?: {
        bodyPath?: string;
        selectionPath?: string;
        imagePosX?: number;
        imagePosY?: number;
        imageWidth?: number;
        imageHeight?: number;
        labelPosX?: number;
        labelMaxWidth?: number;
      };
    };
    notificationConfig?: {
      enable: boolean;
    };
    contextMenuConfig?: {
      enableCreateSupernodeNonContiguous?: boolean;
      defaultMenuEntries?: {
        saveToPalette?: boolean;
        createSupernode?: boolean;
      };
    };
    keyboardConfig?: {
      actions?: {
        delete?: boolean;
        undo?: boolean;
        redo?: boolean;
        selectAll?: boolean;
        cutToClipboard?: boolean;
        copyToClipboard?: boolean;
        pasteFromClipboard?: boolean;
      };
    };
  }

  function CommonCanvas(props: CommonCanvasProps);

  function CommonProperties(props: any);

  class CanvasController {
    getSupernodeObjReferencing(pipelineId: string): any;
    setLinksStyle(
      linkObjectIds: { [key: string]: string[] },
      newStyle: unknown,
      temporary: boolean
    ): void;
    removeAllStyles(temporary?: boolean): void;
    getPipelineFlow(): PipelineFlowV3;
    setPipelineFlow(pipelineFlow: PipelineFlowV3): void;
    getPrimaryPipelineId(): string;
    getNode(nodeId: string, pipelineId: string): NodeTypeDef;
    getSupernodes(pipelineId: string): SupernodeDef[];
    setPipelineFlowPalette(palette: PaletteV3): void;
    getPaletteNode(op: string): unknown;
    convertNodeTemplate(nodeTemplate: unknown): any;
    editActionHandler(e: CanvasEditEvent): void;
    setObjectsStyle(
      pipelineObjectIds: { [key: string]: string[] },
      newStyle: unknown,
      temporary: boolean
    ): void;
    setNodeDecorations(
      nodeId: string,
      newDecorations: unknown[],
      pipelineId: string
    ): void;
    getLinks(
      pipelineID?: string
    ): { id: string; trgNodeId: string; srcNodeId: string; type: string }[];
    setLinkProperties(
      linkId: string,
      linkProperties: unknown,
      pipelineId?: string
    ): void;
    getNodes(): NodeTypeDef[];
    setNodeProperties(
      nodeId: string,
      properties: unknown,
      pipelineId: string
    ): void;
    setNodeLabel(nodeId: string, newLabel: string, pipelineId: string): void;
  }

  type NodeTypeDef =
    | ExecutionNodeDef
    | SupernodeDef
    | BindingEntryNodeDef
    | BindingExitNodeDef
    | ModelNodeDef;
  type PortsDef = PortDef[];
  type BoundPortsDef = BoundPortDef[];

  /**
   * WDP Pipeline Flow Schema
   */
  interface PipelineFlowV3 {
    /**
     * Document type
     */
    doc_type: string;
    /**
     * Pipeline-flow schema version
     */
    version: "3.0";
    /**
     * Refers to the JSON schema used to validate documents of this type
     */
    json_schema?: string;
    /**
     * Preferred authoring application
     */
    open_with_tool?: string;
    /**
     * Document identifier, GUID recommended
     */
    id?: string;
    /**
     * Parameters for the flow document
     */
    parameters?: {
      [k: string]: unknown;
    };
    /**
     * Reference to the primary (main) pipeline flow within the document
     */
    primary_pipeline: string;
    /**
     * Array of pipelines
     */
    pipelines: [PipelineDef, ...PipelineDef[]];
    /**
     * Array of data record schemas used in the document
     */
    schemas?: {
      /**
       * Unique identifier
       */
      id: string;
      /**
       * Name of datarecord
       */
      name?: string;
      /**
       * Refers to the JSON schema used to validate documents of this type
       */
      json_schema?: string;
      /**
       * Always 'struct' for datarecord schema
       */
      type?: string;
      /**
       * Array of field definitions
       */
      fields: {
        /**
         * Field name. Must be unique within the datarecord
         */
        name: string;
        /**
         * Field type. Can be a primitive type (string, integer, double, date, time, timestamp, binary, boolean, array[type], map[type, type]. The type can also be a reference to a struct_type declaration.)
         */
        type: string;
        /**
         * Whether or not one can place null values into the field
         */
        nullable?: boolean;
        /**
         * Additional field metadata
         */
        metadata?: {
          /**
           * Field description
           */
          description?: string;
          /**
           * Field measurement level
           */
          measure?:
            | "range"
            | "discrete"
            | "flag"
            | "set"
            | "ordered-set"
            | "typeless"
            | "collection"
            | "geospatial"
            | "default";
          /**
           * Field role for modeling
           */
          modeling_role?:
            | "input"
            | "target"
            | "both"
            | "none"
            | "partition"
            | "split"
            | "frequency"
            | "record-id";
          /**
           * Maximum length for fields. Length is unlimited when not present
           */
          max_length?: number;
          /**
           * Minimum length for fields
           */
          min_length?: number;
          /**
           * Precision for decimal, time, and timestamp types
           */
          decimal_precision?: number;
          /**
           * Scale for decimal, time, and timestamp types
           */
          decimal_scale?: number;
          /**
           * Array of unique categorical values for the column
           */
          values?: string[];
          /**
           * Minimum and maximum discovered values for scalar data
           */
          range?: {
            /**
             * Lowest value discovered in the data
             */
            min: number;
            /**
             * Highest value discovered in the data
             */
            max: number;
            [k: string]: unknown;
          };
          /**
           * Type of runtime
           */
          runtime_type?: string;
          /**
           * A field is key
           */
          is_key?: boolean;
          /**
           * Signed or Unsigned for number
           */
          is_signed?: boolean;
          /**
           * Item record level
           */
          item_index?: number;
          /**
           * Source field for a target field
           */
          source_field_id?: string;
          [k: string]: unknown;
        };
        /**
         * Object containing app-specific data
         */
        app_data?: {
          [k: string]: unknown;
        };
        [k: string]: unknown;
      }[];
      /**
       * The list of custom struct types to be used as field types
       */
      struct_types?: {
        /**
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` ".".
         */
        [k: string]: {
          /**
           * Array of field definitions
           */
          fields?: {
            /**
             * Field name. Must be unique within the datarecord
             */
            name: string;
            /**
             * Field type. Can be a primitive type (string, integer, double, date, time, timestamp, binary, boolean, array[type], map[type, type]. The type can also be a reference to a struct_type declaration.)
             */
            type: string;
            /**
             * Whether or not one can place null values into the field
             */
            nullable?: boolean;
            /**
             * Additional field metadata
             */
            metadata?: {
              /**
               * Field description
               */
              description?: string;
              /**
               * Field measurement level
               */
              measure?:
                | "range"
                | "discrete"
                | "flag"
                | "set"
                | "ordered-set"
                | "typeless"
                | "collection"
                | "geospatial"
                | "default";
              /**
               * Field role for modeling
               */
              modeling_role?:
                | "input"
                | "target"
                | "both"
                | "none"
                | "partition"
                | "split"
                | "frequency"
                | "record-id";
              /**
               * Maximum length for fields. Length is unlimited when not present
               */
              max_length?: number;
              /**
               * Minimum length for fields
               */
              min_length?: number;
              /**
               * Precision for decimal, time, and timestamp types
               */
              decimal_precision?: number;
              /**
               * Scale for decimal, time, and timestamp types
               */
              decimal_scale?: number;
              /**
               * Array of unique categorical values for the column
               */
              values?: string[];
              /**
               * Minimum and maximum discovered values for scalar data
               */
              range?: {
                /**
                 * Lowest value discovered in the data
                 */
                min: number;
                /**
                 * Highest value discovered in the data
                 */
                max: number;
                [k: string]: unknown;
              };
              /**
               * Type of runtime
               */
              runtime_type?: string;
              /**
               * A field is key
               */
              is_key?: boolean;
              /**
               * Signed or Unsigned for number
               */
              is_signed?: boolean;
              /**
               * Item record level
               */
              item_index?: number;
              /**
               * Source field for a target field
               */
              source_field_id?: string;
              [k: string]: unknown;
            };
            /**
             * Object containing app-specific data
             */
            app_data?: {
              [k: string]: unknown;
            };
            [k: string]: unknown;
          }[];
          [k: string]: unknown;
        };
      };
      [k: string]: unknown;
    }[];
    /**
     * Array of runtime objects referred to in the document
     */
    runtimes?: RuntimeDef[];
    /**
     * Array of parameterized property references
     */
    external_parameters?: {
      /**
       * The name of the parameter.
       */
      name: string;
      /**
       * The description of the parameter.
       */
      description?: string;
      /**
       * The locations of the parameterized properties in the pipeline.
       */
      paths?: string[];
      /**
       * The parameter type.
       */
      type: "string" | "integer" | "object" | "array" | "boolean";
      /**
       * Whether the parameter is required or not
       */
      required?: boolean;
      [k: string]: unknown;
    }[];
    /**
     * Object containing app-specific data
     */
    app_data?: {
      /**
       * Top level UI information
       */
      ui_data?: {
        /**
         * User-defined name
         */
        name?: string;
        /**
         * User-defined description
         */
        description?: string;
        /**
         * CSS class name
         */
        class_name?: string;
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
  }
  /**
   * Definition of a single pipeline flow
   */
  interface PipelineDef {
    /**
     * Unique identifier
     */
    id: string;
    /**
     * Pipeline flow description
     */
    description?: string;
    /**
     * User-readable name
     */
    name?: string;
    /**
     * Reference to the id of the runtime associated with the operations in the current pipeline
     */
    runtime_ref: string;
    /**
     * Array of pipeline nodes
     */
    nodes: NodeTypeDef[];
    /**
     * Parameters for the pipeline
     */
    parameters?: {
      [k: string]: unknown;
    };
    /**
     * Object containing app-specific data
     */
    app_data?: {
      // NOTE: elyra specific.
      version: number;
      /**
       * Pipeline level UI information
       */
      ui_data?: {
        zoom?:
          | number
          | {
              /**
               * Horizontal translation amount. Positive value moves right, negative to the left.
               */
              x: number;
              /**
               * Vertical translation amount. Positive value moves down, negative moves up.
               */
              y: number;
              /**
               * Scale amount. 1.0 is the standard scale amount. Smaller values zoom out. Larger values zoom in.
               */
              k: number;
            };
        /**
         * Array of Comments, optionally associated with nodes
         */
        comments?: {
          /**
           * Comment identifier. Must be unique.
           */
          id: string;
          /**
           * Horizontal comment position
           */
          x_pos: number;
          /**
           * Vertical comment position
           */
          y_pos: number;
          /**
           * Comment width
           */
          width: number;
          /**
           * Comment height
           */
          height: number;
          /**
           * CSS class(es) to apply to the comment
           */
          class_name?: string;
          /**
           * A 'style spec' object containing CSS strings to be applied to the SVG objects of the comment.
           */
          style?:
            | string
            | {
                [k: string]: unknown;
              };
          /**
           * Optional attributes to be added to this element. For example: "attributes": "attr1='value1'; attr2='value2'"
           */
          attributes?: string;
          /**
           * Comment content
           */
          content?: string;
          /**
           * Optional array of associated node id references
           */
          associated_id_refs?: {
            /**
             * Node reference
             */
            node_ref: string;
            /**
             * CSS class name for link styling
             */
            class_name?: string;
            /**
             * A 'style spec' object containing CSS strings to be applied to the SVG objects of the comment link.
             */
            style?:
              | string
              | {
                  [k: string]: unknown;
                };
            [k: string]: unknown;
          }[];
          [k: string]: unknown;
        }[];
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
  }
  /**
   * Definition of a single execution pipeline node
   */
  interface ExecutionNodeDef {
    /**
     * Unique identifier for node within the current pipeline
     */
    id: string;
    /**
     * Execution node description
     */
    description?: string;
    /**
     * Node type - always 'execution_node' for non-model pipeline elements
     */
    type: "execution_node";
    /**
     * Operator type identifier
     */
    op: string;
    inputs?: PortsDef;
    outputs?: PortsDef;
    /**
     * Input parameters for the operator
     */
    parameters?: {
      [k: string]: unknown;
    };
    /**
     * Optional reference to the id of the runtime associated with the current node
     */
    runtime_ref?: string;
    /**
     * Object containing app-specific data
     */
    app_data?: {
      /**
       * object with app-specific UI-information
       */
      ui_data?: {
        /**
         * User-defined label
         */
        label?: string;
        /**
         * User-defined description
         */
        description?: string;
        /**
         * CSS class name
         */
        class_name?: string;
        /**
         * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node.
         */
        style?:
          | string
          | {
              [k: string]: unknown;
            };
        /**
         * Image name (do not embed images inline!)
         */
        image?: string;
        /**
         * x-position
         */
        x_pos?: number;
        /**
         * y-position
         */
        y_pos?: number;
        /**
         * Indicates whether a supernode is shown in expanded state or as a regular node.
         */
        is_expanded?: boolean;
        /**
         * Height of expanded supernode. If not provided an appropriate height is calculated.
         */
        expanded_height?: number;
        /**
         * Width of expanded supernode. If not provided an appropriate width is calculated.
         */
        expanded_width?: number;
        /**
         * additional attributes
         */
        attributes?: string;
        /**
         * Array of non-data node linkage
         */
        associations?: {
          /**
           * Association identifier
           */
          id: string;
          /**
           * Target node id
           */
          node_ref: string;
          /**
           * CSS class name for link styling
           */
          class_name?: string;
          /**
           * A 'style spec' object containing CSS strings to be applied to the SVG objects of the association link.
           */
          style?:
            | string
            | {
                [k: string]: unknown;
              };
          /**
           * Array of decorations used to decorate association links
           */
          decorations?: {
            /**
             * An identifier used to identify the decoration
             */
            id?: string;
            /**
             * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
             */
            hotspot?: boolean;
            /**
             * CSS class name for decoration styling
             */
            class_name?: string;
            /**
             * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
             */
            position?:
              | "topLeft"
              | "topCenter"
              | "topRight"
              | "middleLeft"
              | "middleCenter"
              | "middleRight"
              | "bottomLeft"
              | "bottomCenter"
              | "bottomRight"
              | "source"
              | "middle"
              | "target";
            /**
             * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
             */
            x_pos?: number;
            /**
             * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
             */
            y_pos?: number;
            /**
             * Image displayed at the decoration position. Provide either this or a label.
             */
            image?: string;
            /**
             * Label displayed at the decoration position. Provide either this or an image.
             */
            label?: string;
            [k: string]: unknown;
          }[];
        }[];
        /**
         * An array of messages for the node
         */
        messages?: {
          /**
           * Name of the parameter that has the message
           */
          id_ref: string;
          /**
           * Validation identifier from the fail_message validation section.
           */
          validation_id?: string;
          /**
           * Type of message
           */
          type: "info" | "error" | "warning";
          /**
           * Message string
           */
          text: string;
          [k: string]: unknown;
        }[];
        /**
         * UI only parameter values for the node
         */
        ui_parameters?: {
          [k: string]: unknown;
        };
        /**
         * Array of decorations used to decorate nodes
         */
        decorations?: {
          /**
           * An identifier used to identify the decoration
           */
          id?: string;
          /**
           * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
           */
          hotspot?: boolean;
          /**
           * CSS class name for decoration styling
           */
          class_name?: string;
          /**
           * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
           */
          position?:
            | "topLeft"
            | "topCenter"
            | "topRight"
            | "middleLeft"
            | "middleCenter"
            | "middleRight"
            | "bottomLeft"
            | "bottomCenter"
            | "bottomRight"
            | "source"
            | "middle"
            | "target";
          /**
           * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
           */
          x_pos?: number;
          /**
           * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
           */
          y_pos?: number;
          /**
           * Image displayed at the decoration position. Provide either this or a label.
           */
          image?: string;
          /**
           * Label displayed at the decoration position. Provide either this or an image.
           */
          label?: string;
          [k: string]: unknown;
        }[];
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
  }
  /**
   * Port definition (input/output) on a node
   */
  interface PortDef {
    /**
     * Unique identifier
     */
    id: string;
    /**
     * Optional data record schema reference associated with the port
     */
    schema_ref?: string;
    /**
     * Array of links going into the node. Applies to input ports and exit bindings only.
     */
    links?: LinkDef[];
    /**
     * Parameters for the port
     */
    parameters?: {
      [k: string]: unknown;
    };
    /**
     * Object containing app-specific data
     */
    app_data?: {
      /**
       * Additional UI info for ports
       */
      ui_data?: {
        /**
         * Property to capture how many data assets are allowed for this port, e.g., min: 1, max:1 implies you must supply 1 and only 1; min:0, max:1 implies it is optional and a max of one, min:0, max:-1 means it is optional and you can may have any number of data assets. The default value is 1:1 for inputs and 1:-1 for outputs.
         */
        cardinality?: {
          /**
           * Minimum data sets that are required for this port
           */
          min?: number;
          /**
           * Maximum data sets that are allowed on this port. A negative value indicates unlimited. The default value is 1 for inputs and -1 for outputs.
           */
          max?: number;
        };
        /**
         * CSS class name
         */
        class_name?: string;
        /**
         * A 'style spec' object containing CSS strings to be applied to the SVG objects of the port.
         */
        style?:
          | string
          | {
              [k: string]: unknown;
            };
        /**
         * Port name
         */
        label?: string;
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
  }
  /**
   * Node link definition
   */
  interface LinkDef {
    /**
     * Unique id of this link within the pipelineFlow. If omitted a new link id will be generated.
     */
    id?: string;
    /**
     * id of a node this link connects to
     */
    node_id_ref: string;
    /**
     * optional port id of a node this link connects to
     */
    port_id_ref?: string;
    /**
     * optional link name (used in parameter sets when there are multiple input sources)
     */
    link_name?: string;
    /**
     * Link type attribute
     */
    type_attr?: string;
    /**
     * Link description
     */
    description?: string;
    /**
     * Object containing app-specific data
     */
    app_data?: {
      /**
       * object with app-specific UI-information
       */
      ui_data?: {
        /**
         * CSS class name
         */
        class_name?: string;
        /**
         * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node to node link.
         */
        style?:
          | string
          | {
              [k: string]: unknown;
            };
        /**
         * Array of decorations used to decorate node links
         */
        decorations?: {
          /**
           * An identifier used to identify the decoration
           */
          id?: string;
          /**
           * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
           */
          hotspot?: boolean;
          /**
           * CSS class name for decoration styling
           */
          class_name?: string;
          /**
           * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
           */
          position?:
            | "topLeft"
            | "topCenter"
            | "topRight"
            | "middleLeft"
            | "middleCenter"
            | "middleRight"
            | "bottomLeft"
            | "bottomCenter"
            | "bottomRight"
            | "source"
            | "middle"
            | "target";
          /**
           * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
           */
          x_pos?: number;
          /**
           * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
           */
          y_pos?: number;
          /**
           * Image displayed at the decoration position. Provide either this or a label.
           */
          image?: string;
          /**
           * Label displayed at the decoration position. Provide either this or an image.
           */
          label?: string;
          [k: string]: unknown;
        }[];
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
  }
  /**
   * Definition of a supernode which serves as the entry point for a sub-pipeline
   */
  interface SupernodeDef {
    /**
     * Unique identifier for the supernode within the current pipeline
     */
    id: string;
    /**
     * Supernode description
     */
    description?: string;
    /**
     * Node type - always 'super_node' for supernode elements
     */
    type: "super_node";
    /**
     * Name of the tool which can be used to view or edit the sub-flow for this supernode. The default is 'canvas'
     */
    open_with_tool?: string;
    /**
     * Refers to the sub-flow associated with this supernode
     */
    subflow_ref: {
      /**
       * Reference to an external sub-flow. When not present the sub-flow is assumed to be in the current document. A value of 'app_defined' indicates a sub-flow identifier is present, but the controlling application will serve up the sub-pipeline in the form of a new pipeline-flow document (no sub-flow is present in the document).
       */
      url?: string;
      /**
       * Sub-flow identifier reference
       */
      pipeline_id_ref: string;
      [k: string]: unknown;
    };
    inputs?: BoundPortsDef;
    outputs?: BoundPortsDef;
    /**
     * Input parameters for the supernode
     */
    parameters?: {
      [k: string]: unknown;
    };
    /**
     * Object containing app-specific data
     */
    app_data?: {
      /**
       * object with app-specific UI-information
       */
      ui_data?: {
        /**
         * User-defined label
         */
        label?: string;
        /**
         * User-defined description
         */
        description?: string;
        /**
         * CSS class name
         */
        class_name?: string;
        /**
         * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node.
         */
        style?:
          | string
          | {
              [k: string]: unknown;
            };
        /**
         * Image name (do not embed images inline!)
         */
        image?: string;
        /**
         * x-position
         */
        x_pos?: number;
        /**
         * y-position
         */
        y_pos?: number;
        /**
         * Indicates whether a supernode is shown in expanded state or as a regular node.
         */
        is_expanded?: boolean;
        /**
         * Height of expanded supernode. If not provided an appropriate height is calculated.
         */
        expanded_height?: number;
        /**
         * Width of expanded supernode. If not provided an appropriate width is calculated.
         */
        expanded_width?: number;
        /**
         * additional attributes
         */
        attributes?: string;
        /**
         * Array of non-data node linkage
         */
        associations?: {
          /**
           * Association identifier
           */
          id: string;
          /**
           * Target node id
           */
          node_ref: string;
          /**
           * CSS class name for link styling
           */
          class_name?: string;
          /**
           * A 'style spec' object containing CSS strings to be applied to the SVG objects of the association link.
           */
          style?:
            | string
            | {
                [k: string]: unknown;
              };
          /**
           * Array of decorations used to decorate association links
           */
          decorations?: {
            /**
             * An identifier used to identify the decoration
             */
            id?: string;
            /**
             * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
             */
            hotspot?: boolean;
            /**
             * CSS class name for decoration styling
             */
            class_name?: string;
            /**
             * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
             */
            position?:
              | "topLeft"
              | "topCenter"
              | "topRight"
              | "middleLeft"
              | "middleCenter"
              | "middleRight"
              | "bottomLeft"
              | "bottomCenter"
              | "bottomRight"
              | "source"
              | "middle"
              | "target";
            /**
             * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
             */
            x_pos?: number;
            /**
             * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
             */
            y_pos?: number;
            /**
             * Image displayed at the decoration position. Provide either this or a label.
             */
            image?: string;
            /**
             * Label displayed at the decoration position. Provide either this or an image.
             */
            label?: string;
            [k: string]: unknown;
          }[];
        }[];
        /**
         * An array of messages for the node
         */
        messages?: {
          /**
           * Name of the parameter that has the message
           */
          id_ref: string;
          /**
           * Validation identifier from the fail_message validation section.
           */
          validation_id?: string;
          /**
           * Type of message
           */
          type: "info" | "error" | "warning";
          /**
           * Message string
           */
          text: string;
          [k: string]: unknown;
        }[];
        /**
         * UI only parameter values for the node
         */
        ui_parameters?: {
          [k: string]: unknown;
        };
        /**
         * Array of decorations used to decorate nodes
         */
        decorations?: {
          /**
           * An identifier used to identify the decoration
           */
          id?: string;
          /**
           * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
           */
          hotspot?: boolean;
          /**
           * CSS class name for decoration styling
           */
          class_name?: string;
          /**
           * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
           */
          position?:
            | "topLeft"
            | "topCenter"
            | "topRight"
            | "middleLeft"
            | "middleCenter"
            | "middleRight"
            | "bottomLeft"
            | "bottomCenter"
            | "bottomRight"
            | "source"
            | "middle"
            | "target";
          /**
           * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
           */
          x_pos?: number;
          /**
           * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
           */
          y_pos?: number;
          /**
           * Image displayed at the decoration position. Provide either this or a label.
           */
          image?: string;
          /**
           * Label displayed at the decoration position. Provide either this or an image.
           */
          label?: string;
          [k: string]: unknown;
        }[];
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
  }
  /**
   * Port definition (input/output) on a node with optional pipeline port binding for supernodes
   */
  interface BoundPortDef {
    /**
     * Unique identifier
     */
    id: string;
    /**
     * Optional data record schema associated with the port
     */
    schema_ref?: string;
    /**
     * Array of links going into the node. Applies to input ports and exit bindings only.
     */
    links?: [LinkDef, ...LinkDef[]];
    /**
     * Optional node id binding within the current document.
     */
    subflow_node_ref?: string;
    /**
     * Parameters for the binding port
     */
    parameters?: {
      [k: string]: unknown;
    };
    /**
     * Object containing app-specific data
     */
    app_data?: {
      /**
       * Additional UI info for ports
       */
      ui_data?: {
        /**
         * Property to capture how many data assets are allowed for this port, e.g., min: 1, max:1 implies you must supply 1 and only 1; min:0, max:1 implies it is optional and a max of one, min:0, max:-1 means it is optional and you can may have any number of data assets. The default value is 1:1 for inputs and 1:-1 for outputs.
         */
        cardinality?: {
          /**
           * Minimum data sets that are required for this port
           */
          min?: number;
          /**
           * Maximum data sets that are allowed on this port. A negative value indicates unlimited. The default value is 1 for inputs and -1 for outputs.
           */
          max?: number;
        };
        /**
         * CSS class name
         */
        class_name?: string;
        /**
         * A 'style spec' object containing CSS strings to be applied to the SVG objects of the port.
         */
        style?:
          | string
          | {
              [k: string]: unknown;
            };
        /**
         * Port name
         */
        label?: string;
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
  }
  /**
   * Defines an entry point (source) for a pipeline. Bindings can be concrete: the concrete_binding element is present on the port; or bindings can be abstract: bindings are performed externally via configuration or a wrapper document.
   */
  interface BindingEntryNodeDef {
    /**
     * Unique identifier for the binding within the current pipeline
     */
    id: string;
    /**
     * Binding entry node description
     */
    description?: string;
    /**
     * Node type - always 'binding' for binding elements
     */
    type: "binding";
    outputs?: PortsDef;
    /**
     * Object containing app-specific data
     */
    app_data?: {
      /**
       * object with app-specific UI-information
       */
      ui_data?: {
        /**
         * User-defined label
         */
        label?: string;
        /**
         * User-defined description
         */
        description?: string;
        /**
         * CSS class name
         */
        class_name?: string;
        /**
         * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node.
         */
        style?:
          | string
          | {
              [k: string]: unknown;
            };
        /**
         * Image name (do not embed images inline!)
         */
        image?: string;
        /**
         * x-position
         */
        x_pos?: number;
        /**
         * y-position
         */
        y_pos?: number;
        /**
         * Indicates whether a supernode is shown in expanded state or as a regular node.
         */
        is_expanded?: boolean;
        /**
         * Height of expanded supernode. If not provided an appropriate height is calculated.
         */
        expanded_height?: number;
        /**
         * Width of expanded supernode. If not provided an appropriate width is calculated.
         */
        expanded_width?: number;
        /**
         * additional attributes
         */
        attributes?: string;
        /**
         * Array of non-data node linkage
         */
        associations?: {
          /**
           * Association identifier
           */
          id: string;
          /**
           * Target node id
           */
          node_ref: string;
          /**
           * CSS class name for link styling
           */
          class_name?: string;
          /**
           * A 'style spec' object containing CSS strings to be applied to the SVG objects of the association link.
           */
          style?:
            | string
            | {
                [k: string]: unknown;
              };
          /**
           * Array of decorations used to decorate association links
           */
          decorations?: {
            /**
             * An identifier used to identify the decoration
             */
            id?: string;
            /**
             * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
             */
            hotspot?: boolean;
            /**
             * CSS class name for decoration styling
             */
            class_name?: string;
            /**
             * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
             */
            position?:
              | "topLeft"
              | "topCenter"
              | "topRight"
              | "middleLeft"
              | "middleCenter"
              | "middleRight"
              | "bottomLeft"
              | "bottomCenter"
              | "bottomRight"
              | "source"
              | "middle"
              | "target";
            /**
             * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
             */
            x_pos?: number;
            /**
             * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
             */
            y_pos?: number;
            /**
             * Image displayed at the decoration position. Provide either this or a label.
             */
            image?: string;
            /**
             * Label displayed at the decoration position. Provide either this or an image.
             */
            label?: string;
            [k: string]: unknown;
          }[];
        }[];
        /**
         * An array of messages for the node
         */
        messages?: {
          /**
           * Name of the parameter that has the message
           */
          id_ref: string;
          /**
           * Validation identifier from the fail_message validation section.
           */
          validation_id?: string;
          /**
           * Type of message
           */
          type: "info" | "error" | "warning";
          /**
           * Message string
           */
          text: string;
          [k: string]: unknown;
        }[];
        /**
         * UI only parameter values for the node
         */
        ui_parameters?: {
          [k: string]: unknown;
        };
        /**
         * Array of decorations used to decorate nodes
         */
        decorations?: {
          /**
           * An identifier used to identify the decoration
           */
          id?: string;
          /**
           * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
           */
          hotspot?: boolean;
          /**
           * CSS class name for decoration styling
           */
          class_name?: string;
          /**
           * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
           */
          position?:
            | "topLeft"
            | "topCenter"
            | "topRight"
            | "middleLeft"
            | "middleCenter"
            | "middleRight"
            | "bottomLeft"
            | "bottomCenter"
            | "bottomRight"
            | "source"
            | "middle"
            | "target";
          /**
           * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
           */
          x_pos?: number;
          /**
           * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
           */
          y_pos?: number;
          /**
           * Image displayed at the decoration position. Provide either this or a label.
           */
          image?: string;
          /**
           * Label displayed at the decoration position. Provide either this or an image.
           */
          label?: string;
          [k: string]: unknown;
        }[];
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    /**
     * Details of the connection to use for a pipeline binding node.
     */
    connection?: {
      /**
       * A name tag for disambiguating connections
       */
      name?: string;
      /**
       * Object containing app-specific data
       */
      app_data?: {
        [k: string]: unknown;
      };
      /**
       * A reference to a connection by ID.
       */
      ref: string;
      /**
       * If ref is set, this refers to the ID of the catalog which contains the connection. If neither this attribute nor project_ref are specified, the connection will be assumed to exist in the project or catalog which contains the pipeline.
       */
      catalog_ref?: string;
      /**
       * If ref is set, this refers to the ID of the project which contains the connection. If neither this attribute nor catalog_ref are specified, the connection will be assumed to exist in the project or catalog which contains the pipeline.
       */
      project_ref?: string;
      /**
       * The properties for the connection. The specific properties allowed depend on the type of connection referenced.
       */
      properties?: {
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    /**
     * Details of the data asset contained in a catalog or project to use for a pipeline binding node.
     */
    data_asset?: {
      /**
       * Object containing app-specific data
       */
      app_data?: {
        [k: string]: unknown;
      };
      /**
       * A reference to a data asset by ID.
       */
      ref?: string;
      /**
       * If ref is set, this refers to the ID of the catalog which contains the data asset. If neither this attribute nor project_ref are specified, the data asset will be assumed to exist in the project or catalog which contains the pipeline.
       */
      catalog_ref?: string;
      /**
       * If ref is set, this refers to the ID of the project which contains the data asset. If neither this attribute nor catalog_ref are specified, the data asset will be assumed to exist in the project or catalog which contains the pipeline.
       */
      project_ref?: string;
      /**
       * Properties controlling how the data asset is used.
       */
      properties?: {
        /**
         * The ID of the data asset attachment to use. If not specified and used as a source, the first suitable attachment found will be used. If not specified and used as a target, a new attachment will be created.
         */
        attachment_ref?: string;
        /**
         * Specifies the name of the data asset to read, create or update if ref is unset.
         */
        name?: boolean & string;
        /**
         * When used as a target, whether to update the data asset with the schema when a run completes or not (will be automatically updated if not supplied by caller).
         */
        no_write_schema?: boolean;
        /**
         * When used as a target, whether to update the data asset with the status when a run completes or not (will be automatically updated if not supplied by caller).
         */
        no_write_status?: boolean;
        [k: string]: {
          [k: string]: unknown;
        };
      };
      [k: string]: unknown;
    };
    /**
     * Binding node type identifier
     */
    op?: string;
    /**
     * Parameters for the binding entry node
     */
    parameters?: {
      [k: string]: unknown;
    };
  }
  /**
   * Defines an exit point (sink) for a pipeline. Bindings can be concrete: the concrete_binding element is present on the port; or bindings can be abstract: bindings are performed externally via configuration or a wrapper document.
   */
  interface BindingExitNodeDef {
    /**
     * Unique identifier for the binding within the current pipeline
     */
    id: string;
    /**
     * Binding exit node description
     */
    description?: string;
    /**
     * Node type - always 'binding' for binding elements
     */
    type: "binding";
    inputs?: PortsDef;
    /**
     * Object containing app-specific data
     */
    app_data?: {
      /**
       * object with app-specific UI-information
       */
      ui_data?: {
        /**
         * User-defined label
         */
        label?: string;
        /**
         * User-defined description
         */
        description?: string;
        /**
         * CSS class name
         */
        class_name?: string;
        /**
         * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node.
         */
        style?:
          | string
          | {
              [k: string]: unknown;
            };
        /**
         * Image name (do not embed images inline!)
         */
        image?: string;
        /**
         * x-position
         */
        x_pos?: number;
        /**
         * y-position
         */
        y_pos?: number;
        /**
         * Indicates whether a supernode is shown in expanded state or as a regular node.
         */
        is_expanded?: boolean;
        /**
         * Height of expanded supernode. If not provided an appropriate height is calculated.
         */
        expanded_height?: number;
        /**
         * Width of expanded supernode. If not provided an appropriate width is calculated.
         */
        expanded_width?: number;
        /**
         * additional attributes
         */
        attributes?: string;
        /**
         * Array of non-data node linkage
         */
        associations?: {
          /**
           * Association identifier
           */
          id: string;
          /**
           * Target node id
           */
          node_ref: string;
          /**
           * CSS class name for link styling
           */
          class_name?: string;
          /**
           * A 'style spec' object containing CSS strings to be applied to the SVG objects of the association link.
           */
          style?:
            | string
            | {
                [k: string]: unknown;
              };
          /**
           * Array of decorations used to decorate association links
           */
          decorations?: {
            /**
             * An identifier used to identify the decoration
             */
            id?: string;
            /**
             * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
             */
            hotspot?: boolean;
            /**
             * CSS class name for decoration styling
             */
            class_name?: string;
            /**
             * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
             */
            position?:
              | "topLeft"
              | "topCenter"
              | "topRight"
              | "middleLeft"
              | "middleCenter"
              | "middleRight"
              | "bottomLeft"
              | "bottomCenter"
              | "bottomRight"
              | "source"
              | "middle"
              | "target";
            /**
             * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
             */
            x_pos?: number;
            /**
             * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
             */
            y_pos?: number;
            /**
             * Image displayed at the decoration position. Provide either this or a label.
             */
            image?: string;
            /**
             * Label displayed at the decoration position. Provide either this or an image.
             */
            label?: string;
            [k: string]: unknown;
          }[];
        }[];
        /**
         * An array of messages for the node
         */
        messages?: {
          /**
           * Name of the parameter that has the message
           */
          id_ref: string;
          /**
           * Validation identifier from the fail_message validation section.
           */
          validation_id?: string;
          /**
           * Type of message
           */
          type: "info" | "error" | "warning";
          /**
           * Message string
           */
          text: string;
          [k: string]: unknown;
        }[];
        /**
         * UI only parameter values for the node
         */
        ui_parameters?: {
          [k: string]: unknown;
        };
        /**
         * Array of decorations used to decorate nodes
         */
        decorations?: {
          /**
           * An identifier used to identify the decoration
           */
          id?: string;
          /**
           * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
           */
          hotspot?: boolean;
          /**
           * CSS class name for decoration styling
           */
          class_name?: string;
          /**
           * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
           */
          position?:
            | "topLeft"
            | "topCenter"
            | "topRight"
            | "middleLeft"
            | "middleCenter"
            | "middleRight"
            | "bottomLeft"
            | "bottomCenter"
            | "bottomRight"
            | "source"
            | "middle"
            | "target";
          /**
           * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
           */
          x_pos?: number;
          /**
           * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
           */
          y_pos?: number;
          /**
           * Image displayed at the decoration position. Provide either this or a label.
           */
          image?: string;
          /**
           * Label displayed at the decoration position. Provide either this or an image.
           */
          label?: string;
          [k: string]: unknown;
        }[];
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    /**
     * Details of the connection to use for a pipeline binding node.
     */
    connection?: {
      /**
       * A name tag for disambiguating connections
       */
      name?: string;
      /**
       * Object containing app-specific data
       */
      app_data?: {
        [k: string]: unknown;
      };
      /**
       * A reference to a connection by ID.
       */
      ref: string;
      /**
       * If ref is set, this refers to the ID of the catalog which contains the connection. If neither this attribute nor project_ref are specified, the connection will be assumed to exist in the project or catalog which contains the pipeline.
       */
      catalog_ref?: string;
      /**
       * If ref is set, this refers to the ID of the project which contains the connection. If neither this attribute nor catalog_ref are specified, the connection will be assumed to exist in the project or catalog which contains the pipeline.
       */
      project_ref?: string;
      /**
       * The properties for the connection. The specific properties allowed depend on the type of connection referenced.
       */
      properties?: {
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    /**
     * Details of the data asset contained in a catalog or project to use for a pipeline binding node.
     */
    data_asset?: {
      /**
       * Object containing app-specific data
       */
      app_data?: {
        [k: string]: unknown;
      };
      /**
       * A reference to a data asset by ID.
       */
      ref?: string;
      /**
       * If ref is set, this refers to the ID of the catalog which contains the data asset. If neither this attribute nor project_ref are specified, the data asset will be assumed to exist in the project or catalog which contains the pipeline.
       */
      catalog_ref?: string;
      /**
       * If ref is set, this refers to the ID of the project which contains the data asset. If neither this attribute nor catalog_ref are specified, the data asset will be assumed to exist in the project or catalog which contains the pipeline.
       */
      project_ref?: string;
      /**
       * Properties controlling how the data asset is used.
       */
      properties?: {
        /**
         * The ID of the data asset attachment to use. If not specified and used as a source, the first suitable attachment found will be used. If not specified and used as a target, a new attachment will be created.
         */
        attachment_ref?: string;
        /**
         * Specifies the name of the data asset to read, create or update if ref is unset.
         */
        name?: boolean & string;
        /**
         * When used as a target, whether to update the data asset with the schema when a run completes or not (will be automatically updated if not supplied by caller).
         */
        no_write_schema?: boolean;
        /**
         * When used as a target, whether to update the data asset with the status when a run completes or not (will be automatically updated if not supplied by caller).
         */
        no_write_status?: boolean;
        [k: string]: {
          [k: string]: unknown;
        };
      };
      [k: string]: unknown;
    };
    /**
     * Binding node type identifier
     */
    op?: string;
    /**
     * Parameters for the binding exit node
     */
    parameters?: {
      [k: string]: unknown;
    };
  }
  /**
   * Definition of a single predictive model node
   */
  interface ModelNodeDef {
    /**
     * Unique identifier for the model within the current pipeline
     */
    id: string;
    /**
     * Model node description
     */
    description?: string;
    /**
     * Node type - always 'model_node' for model pipeline elements
     */
    type: "model_node";
    /**
     * Reference to the binary model
     */
    model_ref?: string;
    inputs: PortsDef;
    outputs?: PortsDef;
    /**
     * Node type identifier of modeling node that created this model.
     */
    op?: string;
    /**
     * Input parameters for the operator
     */
    parameters?: {
      [k: string]: unknown;
    };
    /**
     * Reference to the runtime associated with the current node
     */
    runtime_ref?: string;
    /**
     * Object containing app-specific data
     */
    app_data?: {
      /**
       * object with app-specific UI-information
       */
      ui_data?: {
        /**
         * User-defined label
         */
        label?: string;
        /**
         * User-defined description
         */
        description?: string;
        /**
         * CSS class name
         */
        class_name?: string;
        /**
         * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node.
         */
        style?:
          | string
          | {
              [k: string]: unknown;
            };
        /**
         * Image name (do not embed images inline!)
         */
        image?: string;
        /**
         * x-position
         */
        x_pos?: number;
        /**
         * y-position
         */
        y_pos?: number;
        /**
         * Indicates whether a supernode is shown in expanded state or as a regular node.
         */
        is_expanded?: boolean;
        /**
         * Height of expanded supernode. If not provided an appropriate height is calculated.
         */
        expanded_height?: number;
        /**
         * Width of expanded supernode. If not provided an appropriate width is calculated.
         */
        expanded_width?: number;
        /**
         * additional attributes
         */
        attributes?: string;
        /**
         * Array of non-data node linkage
         */
        associations?: {
          /**
           * Association identifier
           */
          id: string;
          /**
           * Target node id
           */
          node_ref: string;
          /**
           * CSS class name for link styling
           */
          class_name?: string;
          /**
           * A 'style spec' object containing CSS strings to be applied to the SVG objects of the association link.
           */
          style?:
            | string
            | {
                [k: string]: unknown;
              };
          /**
           * Array of decorations used to decorate association links
           */
          decorations?: {
            /**
             * An identifier used to identify the decoration
             */
            id?: string;
            /**
             * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
             */
            hotspot?: boolean;
            /**
             * CSS class name for decoration styling
             */
            class_name?: string;
            /**
             * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
             */
            position?:
              | "topLeft"
              | "topCenter"
              | "topRight"
              | "middleLeft"
              | "middleCenter"
              | "middleRight"
              | "bottomLeft"
              | "bottomCenter"
              | "bottomRight"
              | "source"
              | "middle"
              | "target";
            /**
             * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
             */
            x_pos?: number;
            /**
             * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
             */
            y_pos?: number;
            /**
             * Image displayed at the decoration position. Provide either this or a label.
             */
            image?: string;
            /**
             * Label displayed at the decoration position. Provide either this or an image.
             */
            label?: string;
            [k: string]: unknown;
          }[];
        }[];
        /**
         * An array of messages for the node
         */
        messages?: {
          /**
           * Name of the parameter that has the message
           */
          id_ref: string;
          /**
           * Validation identifier from the fail_message validation section.
           */
          validation_id?: string;
          /**
           * Type of message
           */
          type: "info" | "error" | "warning";
          /**
           * Message string
           */
          text: string;
          [k: string]: unknown;
        }[];
        /**
         * UI only parameter values for the node
         */
        ui_parameters?: {
          [k: string]: unknown;
        };
        /**
         * Array of decorations used to decorate nodes
         */
        decorations?: {
          /**
           * An identifier used to identify the decoration
           */
          id?: string;
          /**
           * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
           */
          hotspot?: boolean;
          /**
           * CSS class name for decoration styling
           */
          class_name?: string;
          /**
           * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
           */
          position?:
            | "topLeft"
            | "topCenter"
            | "topRight"
            | "middleLeft"
            | "middleCenter"
            | "middleRight"
            | "bottomLeft"
            | "bottomCenter"
            | "bottomRight"
            | "source"
            | "middle"
            | "target";
          /**
           * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
           */
          x_pos?: number;
          /**
           * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
           */
          y_pos?: number;
          /**
           * Image displayed at the decoration position. Provide either this or a label.
           */
          image?: string;
          /**
           * Label displayed at the decoration position. Provide either this or an image.
           */
          label?: string;
          [k: string]: unknown;
        }[];
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
  }
  /**
   * Runtime associated with the operations in the current pipeline
   */
  interface RuntimeDef {
    /**
     * Unique internal runtime identifier
     */
    id: string;
    /**
     * The runtime name
     */
    name: string;
    /**
     * The runtime version. When not present the latest version is assumed
     */
    version?: string;
    /**
     * Object containing app-specific data
     */
    app_data?: {
      /**
       * Runtime information
       */
      ui_data?: {
        [k: string]: unknown;
      };
      [k: string]: unknown;
    };
    [k: string]: unknown;
  }

  interface PaletteV3 {
    /**
     * Palette schema version
     */
    version?: "3.0";
    /**
     * Array of palette categories
     */
    categories?: CategoryDef[];
  }
  /**
   * Palette Category
   */
  interface CategoryDef {
    /**
     * ID of the category
     */
    id: string;
    /**
     * Category label
     */
    label: string;
    /**
     * Category description
     */
    description?: string;
    /**
     * When set to a non-empty string and node_types is empty, is used to indicate that no nodes exist
     */
    empty_text?: string;
    /**
     * When set to a non-empty string, causes a loading indicator to appear with this text as a label
     */
    loading_text?: string;
    /**
     * Encoded image or image reference for the category
     */
    image?: string;
    /**
     * Array of pipeline node types
     */
    node_types?: (
      | {
          /**
           * Unique identifier for node within the current pipeline
           */
          id: string;
          /**
           * Execution node description
           */
          description?: string;
          /**
           * Node type - always 'execution_node' for non-model pipeline elements
           */
          type: "execution_node";
          /**
           * Operator type identifier
           */
          op: string;
          inputs?: {
            /**
             * Unique identifier
             */
            id: string;
            /**
             * Optional data record schema reference associated with the port
             */
            schema_ref?: string;
            /**
             * Array of links going into the node. Applies to input ports and exit bindings only.
             */
            links?: {
              /**
               * Unique id of this link within the pipelineFlow. If omitted a new link id will be generated.
               */
              id?: string;
              /**
               * id of a node this link connects to
               */
              node_id_ref: string;
              /**
               * optional port id of a node this link connects to
               */
              port_id_ref?: string;
              /**
               * optional link name (used in parameter sets when there are multiple input sources)
               */
              link_name?: string;
              /**
               * Link type attribute
               */
              type_attr?: string;
              /**
               * Link description
               */
              description?: string;
              /**
               * Object containing app-specific data
               */
              app_data?: {
                /**
                 * object with app-specific UI-information
                 */
                ui_data?: {
                  /**
                   * CSS class name
                   */
                  class_name?: string;
                  /**
                   * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node to node link.
                   */
                  style?:
                    | string
                    | {
                        [k: string]: unknown;
                      };
                  /**
                   * Array of decorations used to decorate node links
                   */
                  decorations?: {
                    /**
                     * An identifier used to identify the decoration
                     */
                    id?: string;
                    /**
                     * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                     */
                    hotspot?: boolean;
                    /**
                     * CSS class name for decoration styling
                     */
                    class_name?: string;
                    /**
                     * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                     */
                    position?:
                      | "topLeft"
                      | "topCenter"
                      | "topRight"
                      | "middleLeft"
                      | "middleCenter"
                      | "middleRight"
                      | "bottomLeft"
                      | "bottomCenter"
                      | "bottomRight"
                      | "source"
                      | "middle"
                      | "target";
                    /**
                     * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                     */
                    x_pos?: number;
                    /**
                     * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                     */
                    y_pos?: number;
                    /**
                     * Image displayed at the decoration position. Provide either this or a label.
                     */
                    image?: string;
                    /**
                     * Label displayed at the decoration position. Provide either this or an image.
                     */
                    label?: string;
                    [k: string]: unknown;
                  }[];
                  [k: string]: unknown;
                };
                [k: string]: unknown;
              };
            }[];
            /**
             * Parameters for the port
             */
            parameters?: {
              [k: string]: unknown;
            };
            /**
             * Object containing app-specific data
             */
            app_data?: {
              /**
               * Additional UI info for ports
               */
              ui_data?: {
                /**
                 * Property to capture how many data assets are allowed for this port, e.g., min: 1, max:1 implies you must supply 1 and only 1; min:0, max:1 implies it is optional and a max of one, min:0, max:-1 means it is optional and you can may have any number of data assets. The default value is 1:1 for inputs and 1:-1 for outputs.
                 */
                cardinality?: {
                  /**
                   * Minimum data sets that are required for this port
                   */
                  min?: number;
                  /**
                   * Maximum data sets that are allowed on this port. A negative value indicates unlimited. The default value is 1 for inputs and -1 for outputs.
                   */
                  max?: number;
                };
                /**
                 * CSS class name
                 */
                class_name?: string;
                /**
                 * A 'style spec' object containing CSS strings to be applied to the SVG objects of the port.
                 */
                style?:
                  | string
                  | {
                      [k: string]: unknown;
                    };
                /**
                 * Port name
                 */
                label?: string;
                [k: string]: unknown;
              };
              [k: string]: unknown;
            };
          }[];
          outputs?: {
            /**
             * Unique identifier
             */
            id: string;
            /**
             * Optional data record schema reference associated with the port
             */
            schema_ref?: string;
            /**
             * Array of links going into the node. Applies to input ports and exit bindings only.
             */
            links?: {
              /**
               * Unique id of this link within the pipelineFlow. If omitted a new link id will be generated.
               */
              id?: string;
              /**
               * id of a node this link connects to
               */
              node_id_ref: string;
              /**
               * optional port id of a node this link connects to
               */
              port_id_ref?: string;
              /**
               * optional link name (used in parameter sets when there are multiple input sources)
               */
              link_name?: string;
              /**
               * Link type attribute
               */
              type_attr?: string;
              /**
               * Link description
               */
              description?: string;
              /**
               * Object containing app-specific data
               */
              app_data?: {
                /**
                 * object with app-specific UI-information
                 */
                ui_data?: {
                  /**
                   * CSS class name
                   */
                  class_name?: string;
                  /**
                   * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node to node link.
                   */
                  style?:
                    | string
                    | {
                        [k: string]: unknown;
                      };
                  /**
                   * Array of decorations used to decorate node links
                   */
                  decorations?: {
                    /**
                     * An identifier used to identify the decoration
                     */
                    id?: string;
                    /**
                     * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                     */
                    hotspot?: boolean;
                    /**
                     * CSS class name for decoration styling
                     */
                    class_name?: string;
                    /**
                     * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                     */
                    position?:
                      | "topLeft"
                      | "topCenter"
                      | "topRight"
                      | "middleLeft"
                      | "middleCenter"
                      | "middleRight"
                      | "bottomLeft"
                      | "bottomCenter"
                      | "bottomRight"
                      | "source"
                      | "middle"
                      | "target";
                    /**
                     * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                     */
                    x_pos?: number;
                    /**
                     * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                     */
                    y_pos?: number;
                    /**
                     * Image displayed at the decoration position. Provide either this or a label.
                     */
                    image?: string;
                    /**
                     * Label displayed at the decoration position. Provide either this or an image.
                     */
                    label?: string;
                    [k: string]: unknown;
                  }[];
                  [k: string]: unknown;
                };
                [k: string]: unknown;
              };
            }[];
            /**
             * Parameters for the port
             */
            parameters?: {
              [k: string]: unknown;
            };
            /**
             * Object containing app-specific data
             */
            app_data?: {
              /**
               * Additional UI info for ports
               */
              ui_data?: {
                /**
                 * Property to capture how many data assets are allowed for this port, e.g., min: 1, max:1 implies you must supply 1 and only 1; min:0, max:1 implies it is optional and a max of one, min:0, max:-1 means it is optional and you can may have any number of data assets. The default value is 1:1 for inputs and 1:-1 for outputs.
                 */
                cardinality?: {
                  /**
                   * Minimum data sets that are required for this port
                   */
                  min?: number;
                  /**
                   * Maximum data sets that are allowed on this port. A negative value indicates unlimited. The default value is 1 for inputs and -1 for outputs.
                   */
                  max?: number;
                };
                /**
                 * CSS class name
                 */
                class_name?: string;
                /**
                 * A 'style spec' object containing CSS strings to be applied to the SVG objects of the port.
                 */
                style?:
                  | string
                  | {
                      [k: string]: unknown;
                    };
                /**
                 * Port name
                 */
                label?: string;
                [k: string]: unknown;
              };
              [k: string]: unknown;
            };
          }[];
          /**
           * Input parameters for the operator
           */
          parameters?: {
            [k: string]: unknown;
          };
          /**
           * Optional reference to the id of the runtime associated with the current node
           */
          runtime_ref?: string;
          /**
           * Object containing app-specific data
           */
          app_data?: {
            /**
             * object with app-specific UI-information
             */
            ui_data?: {
              /**
               * User-defined label
               */
              label?: string;
              /**
               * User-defined description
               */
              description?: string;
              /**
               * CSS class name
               */
              class_name?: string;
              /**
               * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node.
               */
              style?:
                | string
                | {
                    [k: string]: unknown;
                  };
              /**
               * Image name (do not embed images inline!)
               */
              image?: string;
              /**
               * x-position
               */
              x_pos?: number;
              /**
               * y-position
               */
              y_pos?: number;
              /**
               * Indicates whether a supernode is shown in expanded state or as a regular node.
               */
              is_expanded?: boolean;
              /**
               * Height of expanded supernode. If not provided an appropriate height is calculated.
               */
              expanded_height?: number;
              /**
               * Width of expanded supernode. If not provided an appropriate width is calculated.
               */
              expanded_width?: number;
              /**
               * additional attributes
               */
              attributes?: string;
              /**
               * Array of non-data node linkage
               */
              associations?: {
                /**
                 * Association identifier
                 */
                id: string;
                /**
                 * Target node id
                 */
                node_ref: string;
                /**
                 * CSS class name for link styling
                 */
                class_name?: string;
                /**
                 * A 'style spec' object containing CSS strings to be applied to the SVG objects of the association link.
                 */
                style?:
                  | string
                  | {
                      [k: string]: unknown;
                    };
                /**
                 * Array of decorations used to decorate association links
                 */
                decorations?: {
                  /**
                   * An identifier used to identify the decoration
                   */
                  id?: string;
                  /**
                   * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                   */
                  hotspot?: boolean;
                  /**
                   * CSS class name for decoration styling
                   */
                  class_name?: string;
                  /**
                   * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                   */
                  position?:
                    | "topLeft"
                    | "topCenter"
                    | "topRight"
                    | "middleLeft"
                    | "middleCenter"
                    | "middleRight"
                    | "bottomLeft"
                    | "bottomCenter"
                    | "bottomRight"
                    | "source"
                    | "middle"
                    | "target";
                  /**
                   * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                   */
                  x_pos?: number;
                  /**
                   * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                   */
                  y_pos?: number;
                  /**
                   * Image displayed at the decoration position. Provide either this or a label.
                   */
                  image?: string;
                  /**
                   * Label displayed at the decoration position. Provide either this or an image.
                   */
                  label?: string;
                  [k: string]: unknown;
                }[];
              }[];
              /**
               * An array of messages for the node
               */
              messages?: {
                /**
                 * Name of the parameter that has the message
                 */
                id_ref: string;
                /**
                 * Validation identifier from the fail_message validation section.
                 */
                validation_id?: string;
                /**
                 * Type of message
                 */
                type: "info" | "error" | "warning";
                /**
                 * Message string
                 */
                text: string;
                [k: string]: unknown;
              }[];
              /**
               * UI only parameter values for the node
               */
              ui_parameters?: {
                [k: string]: unknown;
              };
              /**
               * Array of decorations used to decorate nodes
               */
              decorations?: {
                /**
                 * An identifier used to identify the decoration
                 */
                id?: string;
                /**
                 * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                 */
                hotspot?: boolean;
                /**
                 * CSS class name for decoration styling
                 */
                class_name?: string;
                /**
                 * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                 */
                position?:
                  | "topLeft"
                  | "topCenter"
                  | "topRight"
                  | "middleLeft"
                  | "middleCenter"
                  | "middleRight"
                  | "bottomLeft"
                  | "bottomCenter"
                  | "bottomRight"
                  | "source"
                  | "middle"
                  | "target";
                /**
                 * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                 */
                x_pos?: number;
                /**
                 * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                 */
                y_pos?: number;
                /**
                 * Image displayed at the decoration position. Provide either this or a label.
                 */
                image?: string;
                /**
                 * Label displayed at the decoration position. Provide either this or an image.
                 */
                label?: string;
                [k: string]: unknown;
              }[];
              [k: string]: unknown;
            };
            [k: string]: unknown;
          };
        }
      | {
          /**
           * Unique identifier for the supernode within the current pipeline
           */
          id: string;
          /**
           * Supernode description
           */
          description?: string;
          /**
           * Node type - always 'super_node' for supernode elements
           */
          type: "super_node";
          /**
           * Name of the tool which can be used to view or edit the sub-flow for this supernode. The default is 'canvas'
           */
          open_with_tool?: string;
          /**
           * Refers to the sub-flow associated with this supernode
           */
          subflow_ref: {
            /**
             * Reference to an external sub-flow. When not present the sub-flow is assumed to be in the current document. A value of 'app_defined' indicates a sub-flow identifier is present, but the controlling application will serve up the sub-pipeline in the form of a new pipeline-flow document (no sub-flow is present in the document).
             */
            url?: string;
            /**
             * Sub-flow identifier reference
             */
            pipeline_id_ref: string;
            [k: string]: unknown;
          };
          inputs?: {
            /**
             * Unique identifier
             */
            id: string;
            /**
             * Optional data record schema associated with the port
             */
            schema_ref?: string;
            /**
             * Array of links going into the node. Applies to input ports and exit bindings only.
             */
            links?: [
              {
                /**
                 * Unique id of this link within the pipelineFlow. If omitted a new link id will be generated.
                 */
                id?: string;
                /**
                 * id of a node this link connects to
                 */
                node_id_ref: string;
                /**
                 * optional port id of a node this link connects to
                 */
                port_id_ref?: string;
                /**
                 * optional link name (used in parameter sets when there are multiple input sources)
                 */
                link_name?: string;
                /**
                 * Link type attribute
                 */
                type_attr?: string;
                /**
                 * Link description
                 */
                description?: string;
                /**
                 * Object containing app-specific data
                 */
                app_data?: {
                  /**
                   * object with app-specific UI-information
                   */
                  ui_data?: {
                    /**
                     * CSS class name
                     */
                    class_name?: string;
                    /**
                     * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node to node link.
                     */
                    style?:
                      | string
                      | {
                          [k: string]: unknown;
                        };
                    /**
                     * Array of decorations used to decorate node links
                     */
                    decorations?: {
                      /**
                       * An identifier used to identify the decoration
                       */
                      id?: string;
                      /**
                       * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                       */
                      hotspot?: boolean;
                      /**
                       * CSS class name for decoration styling
                       */
                      class_name?: string;
                      /**
                       * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                       */
                      position?:
                        | "topLeft"
                        | "topCenter"
                        | "topRight"
                        | "middleLeft"
                        | "middleCenter"
                        | "middleRight"
                        | "bottomLeft"
                        | "bottomCenter"
                        | "bottomRight"
                        | "source"
                        | "middle"
                        | "target";
                      /**
                       * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                       */
                      x_pos?: number;
                      /**
                       * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                       */
                      y_pos?: number;
                      /**
                       * Image displayed at the decoration position. Provide either this or a label.
                       */
                      image?: string;
                      /**
                       * Label displayed at the decoration position. Provide either this or an image.
                       */
                      label?: string;
                      [k: string]: unknown;
                    }[];
                    [k: string]: unknown;
                  };
                  [k: string]: unknown;
                };
              },
              ...{
                /**
                 * Unique id of this link within the pipelineFlow. If omitted a new link id will be generated.
                 */
                id?: string;
                /**
                 * id of a node this link connects to
                 */
                node_id_ref: string;
                /**
                 * optional port id of a node this link connects to
                 */
                port_id_ref?: string;
                /**
                 * optional link name (used in parameter sets when there are multiple input sources)
                 */
                link_name?: string;
                /**
                 * Link type attribute
                 */
                type_attr?: string;
                /**
                 * Link description
                 */
                description?: string;
                /**
                 * Object containing app-specific data
                 */
                app_data?: {
                  /**
                   * object with app-specific UI-information
                   */
                  ui_data?: {
                    /**
                     * CSS class name
                     */
                    class_name?: string;
                    /**
                     * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node to node link.
                     */
                    style?:
                      | string
                      | {
                          [k: string]: unknown;
                        };
                    /**
                     * Array of decorations used to decorate node links
                     */
                    decorations?: {
                      /**
                       * An identifier used to identify the decoration
                       */
                      id?: string;
                      /**
                       * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                       */
                      hotspot?: boolean;
                      /**
                       * CSS class name for decoration styling
                       */
                      class_name?: string;
                      /**
                       * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                       */
                      position?:
                        | "topLeft"
                        | "topCenter"
                        | "topRight"
                        | "middleLeft"
                        | "middleCenter"
                        | "middleRight"
                        | "bottomLeft"
                        | "bottomCenter"
                        | "bottomRight"
                        | "source"
                        | "middle"
                        | "target";
                      /**
                       * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                       */
                      x_pos?: number;
                      /**
                       * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                       */
                      y_pos?: number;
                      /**
                       * Image displayed at the decoration position. Provide either this or a label.
                       */
                      image?: string;
                      /**
                       * Label displayed at the decoration position. Provide either this or an image.
                       */
                      label?: string;
                      [k: string]: unknown;
                    }[];
                    [k: string]: unknown;
                  };
                  [k: string]: unknown;
                };
              }[]
            ];
            /**
             * Optional node id binding within the current document.
             */
            subflow_node_ref?: string;
            /**
             * Parameters for the binding port
             */
            parameters?: {
              [k: string]: unknown;
            };
            /**
             * Object containing app-specific data
             */
            app_data?: {
              /**
               * Additional UI info for ports
               */
              ui_data?: {
                /**
                 * Property to capture how many data assets are allowed for this port, e.g., min: 1, max:1 implies you must supply 1 and only 1; min:0, max:1 implies it is optional and a max of one, min:0, max:-1 means it is optional and you can may have any number of data assets. The default value is 1:1 for inputs and 1:-1 for outputs.
                 */
                cardinality?: {
                  /**
                   * Minimum data sets that are required for this port
                   */
                  min?: number;
                  /**
                   * Maximum data sets that are allowed on this port. A negative value indicates unlimited. The default value is 1 for inputs and -1 for outputs.
                   */
                  max?: number;
                };
                /**
                 * CSS class name
                 */
                class_name?: string;
                /**
                 * A 'style spec' object containing CSS strings to be applied to the SVG objects of the port.
                 */
                style?:
                  | string
                  | {
                      [k: string]: unknown;
                    };
                /**
                 * Port name
                 */
                label?: string;
                [k: string]: unknown;
              };
              [k: string]: unknown;
            };
          }[];
          outputs?: {
            /**
             * Unique identifier
             */
            id: string;
            /**
             * Optional data record schema associated with the port
             */
            schema_ref?: string;
            /**
             * Array of links going into the node. Applies to input ports and exit bindings only.
             */
            links?: [
              {
                /**
                 * Unique id of this link within the pipelineFlow. If omitted a new link id will be generated.
                 */
                id?: string;
                /**
                 * id of a node this link connects to
                 */
                node_id_ref: string;
                /**
                 * optional port id of a node this link connects to
                 */
                port_id_ref?: string;
                /**
                 * optional link name (used in parameter sets when there are multiple input sources)
                 */
                link_name?: string;
                /**
                 * Link type attribute
                 */
                type_attr?: string;
                /**
                 * Link description
                 */
                description?: string;
                /**
                 * Object containing app-specific data
                 */
                app_data?: {
                  /**
                   * object with app-specific UI-information
                   */
                  ui_data?: {
                    /**
                     * CSS class name
                     */
                    class_name?: string;
                    /**
                     * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node to node link.
                     */
                    style?:
                      | string
                      | {
                          [k: string]: unknown;
                        };
                    /**
                     * Array of decorations used to decorate node links
                     */
                    decorations?: {
                      /**
                       * An identifier used to identify the decoration
                       */
                      id?: string;
                      /**
                       * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                       */
                      hotspot?: boolean;
                      /**
                       * CSS class name for decoration styling
                       */
                      class_name?: string;
                      /**
                       * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                       */
                      position?:
                        | "topLeft"
                        | "topCenter"
                        | "topRight"
                        | "middleLeft"
                        | "middleCenter"
                        | "middleRight"
                        | "bottomLeft"
                        | "bottomCenter"
                        | "bottomRight"
                        | "source"
                        | "middle"
                        | "target";
                      /**
                       * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                       */
                      x_pos?: number;
                      /**
                       * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                       */
                      y_pos?: number;
                      /**
                       * Image displayed at the decoration position. Provide either this or a label.
                       */
                      image?: string;
                      /**
                       * Label displayed at the decoration position. Provide either this or an image.
                       */
                      label?: string;
                      [k: string]: unknown;
                    }[];
                    [k: string]: unknown;
                  };
                  [k: string]: unknown;
                };
              },
              ...{
                /**
                 * Unique id of this link within the pipelineFlow. If omitted a new link id will be generated.
                 */
                id?: string;
                /**
                 * id of a node this link connects to
                 */
                node_id_ref: string;
                /**
                 * optional port id of a node this link connects to
                 */
                port_id_ref?: string;
                /**
                 * optional link name (used in parameter sets when there are multiple input sources)
                 */
                link_name?: string;
                /**
                 * Link type attribute
                 */
                type_attr?: string;
                /**
                 * Link description
                 */
                description?: string;
                /**
                 * Object containing app-specific data
                 */
                app_data?: {
                  /**
                   * object with app-specific UI-information
                   */
                  ui_data?: {
                    /**
                     * CSS class name
                     */
                    class_name?: string;
                    /**
                     * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node to node link.
                     */
                    style?:
                      | string
                      | {
                          [k: string]: unknown;
                        };
                    /**
                     * Array of decorations used to decorate node links
                     */
                    decorations?: {
                      /**
                       * An identifier used to identify the decoration
                       */
                      id?: string;
                      /**
                       * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                       */
                      hotspot?: boolean;
                      /**
                       * CSS class name for decoration styling
                       */
                      class_name?: string;
                      /**
                       * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                       */
                      position?:
                        | "topLeft"
                        | "topCenter"
                        | "topRight"
                        | "middleLeft"
                        | "middleCenter"
                        | "middleRight"
                        | "bottomLeft"
                        | "bottomCenter"
                        | "bottomRight"
                        | "source"
                        | "middle"
                        | "target";
                      /**
                       * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                       */
                      x_pos?: number;
                      /**
                       * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                       */
                      y_pos?: number;
                      /**
                       * Image displayed at the decoration position. Provide either this or a label.
                       */
                      image?: string;
                      /**
                       * Label displayed at the decoration position. Provide either this or an image.
                       */
                      label?: string;
                      [k: string]: unknown;
                    }[];
                    [k: string]: unknown;
                  };
                  [k: string]: unknown;
                };
              }[]
            ];
            /**
             * Optional node id binding within the current document.
             */
            subflow_node_ref?: string;
            /**
             * Parameters for the binding port
             */
            parameters?: {
              [k: string]: unknown;
            };
            /**
             * Object containing app-specific data
             */
            app_data?: {
              /**
               * Additional UI info for ports
               */
              ui_data?: {
                /**
                 * Property to capture how many data assets are allowed for this port, e.g., min: 1, max:1 implies you must supply 1 and only 1; min:0, max:1 implies it is optional and a max of one, min:0, max:-1 means it is optional and you can may have any number of data assets. The default value is 1:1 for inputs and 1:-1 for outputs.
                 */
                cardinality?: {
                  /**
                   * Minimum data sets that are required for this port
                   */
                  min?: number;
                  /**
                   * Maximum data sets that are allowed on this port. A negative value indicates unlimited. The default value is 1 for inputs and -1 for outputs.
                   */
                  max?: number;
                };
                /**
                 * CSS class name
                 */
                class_name?: string;
                /**
                 * A 'style spec' object containing CSS strings to be applied to the SVG objects of the port.
                 */
                style?:
                  | string
                  | {
                      [k: string]: unknown;
                    };
                /**
                 * Port name
                 */
                label?: string;
                [k: string]: unknown;
              };
              [k: string]: unknown;
            };
          }[];
          /**
           * Input parameters for the supernode
           */
          parameters?: {
            [k: string]: unknown;
          };
          /**
           * Object containing app-specific data
           */
          app_data?: {
            /**
             * object with app-specific UI-information
             */
            ui_data?: {
              /**
               * User-defined label
               */
              label?: string;
              /**
               * User-defined description
               */
              description?: string;
              /**
               * CSS class name
               */
              class_name?: string;
              /**
               * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node.
               */
              style?:
                | string
                | {
                    [k: string]: unknown;
                  };
              /**
               * Image name (do not embed images inline!)
               */
              image?: string;
              /**
               * x-position
               */
              x_pos?: number;
              /**
               * y-position
               */
              y_pos?: number;
              /**
               * Indicates whether a supernode is shown in expanded state or as a regular node.
               */
              is_expanded?: boolean;
              /**
               * Height of expanded supernode. If not provided an appropriate height is calculated.
               */
              expanded_height?: number;
              /**
               * Width of expanded supernode. If not provided an appropriate width is calculated.
               */
              expanded_width?: number;
              /**
               * additional attributes
               */
              attributes?: string;
              /**
               * Array of non-data node linkage
               */
              associations?: {
                /**
                 * Association identifier
                 */
                id: string;
                /**
                 * Target node id
                 */
                node_ref: string;
                /**
                 * CSS class name for link styling
                 */
                class_name?: string;
                /**
                 * A 'style spec' object containing CSS strings to be applied to the SVG objects of the association link.
                 */
                style?:
                  | string
                  | {
                      [k: string]: unknown;
                    };
                /**
                 * Array of decorations used to decorate association links
                 */
                decorations?: {
                  /**
                   * An identifier used to identify the decoration
                   */
                  id?: string;
                  /**
                   * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                   */
                  hotspot?: boolean;
                  /**
                   * CSS class name for decoration styling
                   */
                  class_name?: string;
                  /**
                   * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                   */
                  position?:
                    | "topLeft"
                    | "topCenter"
                    | "topRight"
                    | "middleLeft"
                    | "middleCenter"
                    | "middleRight"
                    | "bottomLeft"
                    | "bottomCenter"
                    | "bottomRight"
                    | "source"
                    | "middle"
                    | "target";
                  /**
                   * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                   */
                  x_pos?: number;
                  /**
                   * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                   */
                  y_pos?: number;
                  /**
                   * Image displayed at the decoration position. Provide either this or a label.
                   */
                  image?: string;
                  /**
                   * Label displayed at the decoration position. Provide either this or an image.
                   */
                  label?: string;
                  [k: string]: unknown;
                }[];
              }[];
              /**
               * An array of messages for the node
               */
              messages?: {
                /**
                 * Name of the parameter that has the message
                 */
                id_ref: string;
                /**
                 * Validation identifier from the fail_message validation section.
                 */
                validation_id?: string;
                /**
                 * Type of message
                 */
                type: "info" | "error" | "warning";
                /**
                 * Message string
                 */
                text: string;
                [k: string]: unknown;
              }[];
              /**
               * UI only parameter values for the node
               */
              ui_parameters?: {
                [k: string]: unknown;
              };
              /**
               * Array of decorations used to decorate nodes
               */
              decorations?: {
                /**
                 * An identifier used to identify the decoration
                 */
                id?: string;
                /**
                 * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                 */
                hotspot?: boolean;
                /**
                 * CSS class name for decoration styling
                 */
                class_name?: string;
                /**
                 * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                 */
                position?:
                  | "topLeft"
                  | "topCenter"
                  | "topRight"
                  | "middleLeft"
                  | "middleCenter"
                  | "middleRight"
                  | "bottomLeft"
                  | "bottomCenter"
                  | "bottomRight"
                  | "source"
                  | "middle"
                  | "target";
                /**
                 * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                 */
                x_pos?: number;
                /**
                 * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                 */
                y_pos?: number;
                /**
                 * Image displayed at the decoration position. Provide either this or a label.
                 */
                image?: string;
                /**
                 * Label displayed at the decoration position. Provide either this or an image.
                 */
                label?: string;
                [k: string]: unknown;
              }[];
              [k: string]: unknown;
            };
            [k: string]: unknown;
          };
        }
      | {
          /**
           * Unique identifier for the binding within the current pipeline
           */
          id: string;
          /**
           * Binding entry node description
           */
          description?: string;
          /**
           * Node type - always 'binding' for binding elements
           */
          type: "binding";
          outputs?: {
            /**
             * Unique identifier
             */
            id: string;
            /**
             * Optional data record schema reference associated with the port
             */
            schema_ref?: string;
            /**
             * Array of links going into the node. Applies to input ports and exit bindings only.
             */
            links?: {
              /**
               * Unique id of this link within the pipelineFlow. If omitted a new link id will be generated.
               */
              id?: string;
              /**
               * id of a node this link connects to
               */
              node_id_ref: string;
              /**
               * optional port id of a node this link connects to
               */
              port_id_ref?: string;
              /**
               * optional link name (used in parameter sets when there are multiple input sources)
               */
              link_name?: string;
              /**
               * Link type attribute
               */
              type_attr?: string;
              /**
               * Link description
               */
              description?: string;
              /**
               * Object containing app-specific data
               */
              app_data?: {
                /**
                 * object with app-specific UI-information
                 */
                ui_data?: {
                  /**
                   * CSS class name
                   */
                  class_name?: string;
                  /**
                   * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node to node link.
                   */
                  style?:
                    | string
                    | {
                        [k: string]: unknown;
                      };
                  /**
                   * Array of decorations used to decorate node links
                   */
                  decorations?: {
                    /**
                     * An identifier used to identify the decoration
                     */
                    id?: string;
                    /**
                     * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                     */
                    hotspot?: boolean;
                    /**
                     * CSS class name for decoration styling
                     */
                    class_name?: string;
                    /**
                     * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                     */
                    position?:
                      | "topLeft"
                      | "topCenter"
                      | "topRight"
                      | "middleLeft"
                      | "middleCenter"
                      | "middleRight"
                      | "bottomLeft"
                      | "bottomCenter"
                      | "bottomRight"
                      | "source"
                      | "middle"
                      | "target";
                    /**
                     * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                     */
                    x_pos?: number;
                    /**
                     * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                     */
                    y_pos?: number;
                    /**
                     * Image displayed at the decoration position. Provide either this or a label.
                     */
                    image?: string;
                    /**
                     * Label displayed at the decoration position. Provide either this or an image.
                     */
                    label?: string;
                    [k: string]: unknown;
                  }[];
                  [k: string]: unknown;
                };
                [k: string]: unknown;
              };
            }[];
            /**
             * Parameters for the port
             */
            parameters?: {
              [k: string]: unknown;
            };
            /**
             * Object containing app-specific data
             */
            app_data?: {
              /**
               * Additional UI info for ports
               */
              ui_data?: {
                /**
                 * Property to capture how many data assets are allowed for this port, e.g., min: 1, max:1 implies you must supply 1 and only 1; min:0, max:1 implies it is optional and a max of one, min:0, max:-1 means it is optional and you can may have any number of data assets. The default value is 1:1 for inputs and 1:-1 for outputs.
                 */
                cardinality?: {
                  /**
                   * Minimum data sets that are required for this port
                   */
                  min?: number;
                  /**
                   * Maximum data sets that are allowed on this port. A negative value indicates unlimited. The default value is 1 for inputs and -1 for outputs.
                   */
                  max?: number;
                };
                /**
                 * CSS class name
                 */
                class_name?: string;
                /**
                 * A 'style spec' object containing CSS strings to be applied to the SVG objects of the port.
                 */
                style?:
                  | string
                  | {
                      [k: string]: unknown;
                    };
                /**
                 * Port name
                 */
                label?: string;
                [k: string]: unknown;
              };
              [k: string]: unknown;
            };
          }[];
          /**
           * Object containing app-specific data
           */
          app_data?: {
            /**
             * object with app-specific UI-information
             */
            ui_data?: {
              /**
               * User-defined label
               */
              label?: string;
              /**
               * User-defined description
               */
              description?: string;
              /**
               * CSS class name
               */
              class_name?: string;
              /**
               * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node.
               */
              style?:
                | string
                | {
                    [k: string]: unknown;
                  };
              /**
               * Image name (do not embed images inline!)
               */
              image?: string;
              /**
               * x-position
               */
              x_pos?: number;
              /**
               * y-position
               */
              y_pos?: number;
              /**
               * Indicates whether a supernode is shown in expanded state or as a regular node.
               */
              is_expanded?: boolean;
              /**
               * Height of expanded supernode. If not provided an appropriate height is calculated.
               */
              expanded_height?: number;
              /**
               * Width of expanded supernode. If not provided an appropriate width is calculated.
               */
              expanded_width?: number;
              /**
               * additional attributes
               */
              attributes?: string;
              /**
               * Array of non-data node linkage
               */
              associations?: {
                /**
                 * Association identifier
                 */
                id: string;
                /**
                 * Target node id
                 */
                node_ref: string;
                /**
                 * CSS class name for link styling
                 */
                class_name?: string;
                /**
                 * A 'style spec' object containing CSS strings to be applied to the SVG objects of the association link.
                 */
                style?:
                  | string
                  | {
                      [k: string]: unknown;
                    };
                /**
                 * Array of decorations used to decorate association links
                 */
                decorations?: {
                  /**
                   * An identifier used to identify the decoration
                   */
                  id?: string;
                  /**
                   * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                   */
                  hotspot?: boolean;
                  /**
                   * CSS class name for decoration styling
                   */
                  class_name?: string;
                  /**
                   * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                   */
                  position?:
                    | "topLeft"
                    | "topCenter"
                    | "topRight"
                    | "middleLeft"
                    | "middleCenter"
                    | "middleRight"
                    | "bottomLeft"
                    | "bottomCenter"
                    | "bottomRight"
                    | "source"
                    | "middle"
                    | "target";
                  /**
                   * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                   */
                  x_pos?: number;
                  /**
                   * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                   */
                  y_pos?: number;
                  /**
                   * Image displayed at the decoration position. Provide either this or a label.
                   */
                  image?: string;
                  /**
                   * Label displayed at the decoration position. Provide either this or an image.
                   */
                  label?: string;
                  [k: string]: unknown;
                }[];
              }[];
              /**
               * An array of messages for the node
               */
              messages?: {
                /**
                 * Name of the parameter that has the message
                 */
                id_ref: string;
                /**
                 * Validation identifier from the fail_message validation section.
                 */
                validation_id?: string;
                /**
                 * Type of message
                 */
                type: "info" | "error" | "warning";
                /**
                 * Message string
                 */
                text: string;
                [k: string]: unknown;
              }[];
              /**
               * UI only parameter values for the node
               */
              ui_parameters?: {
                [k: string]: unknown;
              };
              /**
               * Array of decorations used to decorate nodes
               */
              decorations?: {
                /**
                 * An identifier used to identify the decoration
                 */
                id?: string;
                /**
                 * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                 */
                hotspot?: boolean;
                /**
                 * CSS class name for decoration styling
                 */
                class_name?: string;
                /**
                 * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                 */
                position?:
                  | "topLeft"
                  | "topCenter"
                  | "topRight"
                  | "middleLeft"
                  | "middleCenter"
                  | "middleRight"
                  | "bottomLeft"
                  | "bottomCenter"
                  | "bottomRight"
                  | "source"
                  | "middle"
                  | "target";
                /**
                 * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                 */
                x_pos?: number;
                /**
                 * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                 */
                y_pos?: number;
                /**
                 * Image displayed at the decoration position. Provide either this or a label.
                 */
                image?: string;
                /**
                 * Label displayed at the decoration position. Provide either this or an image.
                 */
                label?: string;
                [k: string]: unknown;
              }[];
              [k: string]: unknown;
            };
            [k: string]: unknown;
          };
          /**
           * Details of the connection to use for a pipeline binding node.
           */
          connection?: {
            /**
             * A name tag for disambiguating connections
             */
            name?: string;
            /**
             * Object containing app-specific data
             */
            app_data?: {
              [k: string]: unknown;
            };
            /**
             * A reference to a connection by ID.
             */
            ref: string;
            /**
             * If ref is set, this refers to the ID of the catalog which contains the connection. If neither this attribute nor project_ref are specified, the connection will be assumed to exist in the project or catalog which contains the pipeline.
             */
            catalog_ref?: string;
            /**
             * If ref is set, this refers to the ID of the project which contains the connection. If neither this attribute nor catalog_ref are specified, the connection will be assumed to exist in the project or catalog which contains the pipeline.
             */
            project_ref?: string;
            /**
             * The properties for the connection. The specific properties allowed depend on the type of connection referenced.
             */
            properties?: {
              [k: string]: unknown;
            };
            [k: string]: unknown;
          };
          /**
           * Details of the data asset contained in a catalog or project to use for a pipeline binding node.
           */
          data_asset?: {
            /**
             * Object containing app-specific data
             */
            app_data?: {
              [k: string]: unknown;
            };
            /**
             * A reference to a data asset by ID.
             */
            ref?: string;
            /**
             * If ref is set, this refers to the ID of the catalog which contains the data asset. If neither this attribute nor project_ref are specified, the data asset will be assumed to exist in the project or catalog which contains the pipeline.
             */
            catalog_ref?: string;
            /**
             * If ref is set, this refers to the ID of the project which contains the data asset. If neither this attribute nor catalog_ref are specified, the data asset will be assumed to exist in the project or catalog which contains the pipeline.
             */
            project_ref?: string;
            /**
             * Properties controlling how the data asset is used.
             */
            properties?: {
              /**
               * The ID of the data asset attachment to use. If not specified and used as a source, the first suitable attachment found will be used. If not specified and used as a target, a new attachment will be created.
               */
              attachment_ref?: string;
              /**
               * Specifies the name of the data asset to read, create or update if ref is unset.
               */
              name?: boolean & string;
              /**
               * When used as a target, whether to update the data asset with the schema when a run completes or not (will be automatically updated if not supplied by caller).
               */
              no_write_schema?: boolean;
              /**
               * When used as a target, whether to update the data asset with the status when a run completes or not (will be automatically updated if not supplied by caller).
               */
              no_write_status?: boolean;
              [k: string]: {
                [k: string]: unknown;
              };
            };
            [k: string]: unknown;
          };
          /**
           * Binding node type identifier
           */
          op?: string;
          /**
           * Parameters for the binding entry node
           */
          parameters?: {
            [k: string]: unknown;
          };
        }
      | {
          /**
           * Unique identifier for the binding within the current pipeline
           */
          id: string;
          /**
           * Binding exit node description
           */
          description?: string;
          /**
           * Node type - always 'binding' for binding elements
           */
          type: "binding";
          inputs?: {
            /**
             * Unique identifier
             */
            id: string;
            /**
             * Optional data record schema reference associated with the port
             */
            schema_ref?: string;
            /**
             * Array of links going into the node. Applies to input ports and exit bindings only.
             */
            links?: {
              /**
               * Unique id of this link within the pipelineFlow. If omitted a new link id will be generated.
               */
              id?: string;
              /**
               * id of a node this link connects to
               */
              node_id_ref: string;
              /**
               * optional port id of a node this link connects to
               */
              port_id_ref?: string;
              /**
               * optional link name (used in parameter sets when there are multiple input sources)
               */
              link_name?: string;
              /**
               * Link type attribute
               */
              type_attr?: string;
              /**
               * Link description
               */
              description?: string;
              /**
               * Object containing app-specific data
               */
              app_data?: {
                /**
                 * object with app-specific UI-information
                 */
                ui_data?: {
                  /**
                   * CSS class name
                   */
                  class_name?: string;
                  /**
                   * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node to node link.
                   */
                  style?:
                    | string
                    | {
                        [k: string]: unknown;
                      };
                  /**
                   * Array of decorations used to decorate node links
                   */
                  decorations?: {
                    /**
                     * An identifier used to identify the decoration
                     */
                    id?: string;
                    /**
                     * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                     */
                    hotspot?: boolean;
                    /**
                     * CSS class name for decoration styling
                     */
                    class_name?: string;
                    /**
                     * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                     */
                    position?:
                      | "topLeft"
                      | "topCenter"
                      | "topRight"
                      | "middleLeft"
                      | "middleCenter"
                      | "middleRight"
                      | "bottomLeft"
                      | "bottomCenter"
                      | "bottomRight"
                      | "source"
                      | "middle"
                      | "target";
                    /**
                     * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                     */
                    x_pos?: number;
                    /**
                     * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                     */
                    y_pos?: number;
                    /**
                     * Image displayed at the decoration position. Provide either this or a label.
                     */
                    image?: string;
                    /**
                     * Label displayed at the decoration position. Provide either this or an image.
                     */
                    label?: string;
                    [k: string]: unknown;
                  }[];
                  [k: string]: unknown;
                };
                [k: string]: unknown;
              };
            }[];
            /**
             * Parameters for the port
             */
            parameters?: {
              [k: string]: unknown;
            };
            /**
             * Object containing app-specific data
             */
            app_data?: {
              /**
               * Additional UI info for ports
               */
              ui_data?: {
                /**
                 * Property to capture how many data assets are allowed for this port, e.g., min: 1, max:1 implies you must supply 1 and only 1; min:0, max:1 implies it is optional and a max of one, min:0, max:-1 means it is optional and you can may have any number of data assets. The default value is 1:1 for inputs and 1:-1 for outputs.
                 */
                cardinality?: {
                  /**
                   * Minimum data sets that are required for this port
                   */
                  min?: number;
                  /**
                   * Maximum data sets that are allowed on this port. A negative value indicates unlimited. The default value is 1 for inputs and -1 for outputs.
                   */
                  max?: number;
                };
                /**
                 * CSS class name
                 */
                class_name?: string;
                /**
                 * A 'style spec' object containing CSS strings to be applied to the SVG objects of the port.
                 */
                style?:
                  | string
                  | {
                      [k: string]: unknown;
                    };
                /**
                 * Port name
                 */
                label?: string;
                [k: string]: unknown;
              };
              [k: string]: unknown;
            };
          }[];
          /**
           * Object containing app-specific data
           */
          app_data?: {
            /**
             * object with app-specific UI-information
             */
            ui_data?: {
              /**
               * User-defined label
               */
              label?: string;
              /**
               * User-defined description
               */
              description?: string;
              /**
               * CSS class name
               */
              class_name?: string;
              /**
               * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node.
               */
              style?:
                | string
                | {
                    [k: string]: unknown;
                  };
              /**
               * Image name (do not embed images inline!)
               */
              image?: string;
              /**
               * x-position
               */
              x_pos?: number;
              /**
               * y-position
               */
              y_pos?: number;
              /**
               * Indicates whether a supernode is shown in expanded state or as a regular node.
               */
              is_expanded?: boolean;
              /**
               * Height of expanded supernode. If not provided an appropriate height is calculated.
               */
              expanded_height?: number;
              /**
               * Width of expanded supernode. If not provided an appropriate width is calculated.
               */
              expanded_width?: number;
              /**
               * additional attributes
               */
              attributes?: string;
              /**
               * Array of non-data node linkage
               */
              associations?: {
                /**
                 * Association identifier
                 */
                id: string;
                /**
                 * Target node id
                 */
                node_ref: string;
                /**
                 * CSS class name for link styling
                 */
                class_name?: string;
                /**
                 * A 'style spec' object containing CSS strings to be applied to the SVG objects of the association link.
                 */
                style?:
                  | string
                  | {
                      [k: string]: unknown;
                    };
                /**
                 * Array of decorations used to decorate association links
                 */
                decorations?: {
                  /**
                   * An identifier used to identify the decoration
                   */
                  id?: string;
                  /**
                   * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                   */
                  hotspot?: boolean;
                  /**
                   * CSS class name for decoration styling
                   */
                  class_name?: string;
                  /**
                   * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                   */
                  position?:
                    | "topLeft"
                    | "topCenter"
                    | "topRight"
                    | "middleLeft"
                    | "middleCenter"
                    | "middleRight"
                    | "bottomLeft"
                    | "bottomCenter"
                    | "bottomRight"
                    | "source"
                    | "middle"
                    | "target";
                  /**
                   * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                   */
                  x_pos?: number;
                  /**
                   * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                   */
                  y_pos?: number;
                  /**
                   * Image displayed at the decoration position. Provide either this or a label.
                   */
                  image?: string;
                  /**
                   * Label displayed at the decoration position. Provide either this or an image.
                   */
                  label?: string;
                  [k: string]: unknown;
                }[];
              }[];
              /**
               * An array of messages for the node
               */
              messages?: {
                /**
                 * Name of the parameter that has the message
                 */
                id_ref: string;
                /**
                 * Validation identifier from the fail_message validation section.
                 */
                validation_id?: string;
                /**
                 * Type of message
                 */
                type: "info" | "error" | "warning";
                /**
                 * Message string
                 */
                text: string;
                [k: string]: unknown;
              }[];
              /**
               * UI only parameter values for the node
               */
              ui_parameters?: {
                [k: string]: unknown;
              };
              /**
               * Array of decorations used to decorate nodes
               */
              decorations?: {
                /**
                 * An identifier used to identify the decoration
                 */
                id?: string;
                /**
                 * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                 */
                hotspot?: boolean;
                /**
                 * CSS class name for decoration styling
                 */
                class_name?: string;
                /**
                 * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                 */
                position?:
                  | "topLeft"
                  | "topCenter"
                  | "topRight"
                  | "middleLeft"
                  | "middleCenter"
                  | "middleRight"
                  | "bottomLeft"
                  | "bottomCenter"
                  | "bottomRight"
                  | "source"
                  | "middle"
                  | "target";
                /**
                 * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                 */
                x_pos?: number;
                /**
                 * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                 */
                y_pos?: number;
                /**
                 * Image displayed at the decoration position. Provide either this or a label.
                 */
                image?: string;
                /**
                 * Label displayed at the decoration position. Provide either this or an image.
                 */
                label?: string;
                [k: string]: unknown;
              }[];
              [k: string]: unknown;
            };
            [k: string]: unknown;
          };
          /**
           * Details of the connection to use for a pipeline binding node.
           */
          connection?: {
            /**
             * A name tag for disambiguating connections
             */
            name?: string;
            /**
             * Object containing app-specific data
             */
            app_data?: {
              [k: string]: unknown;
            };
            /**
             * A reference to a connection by ID.
             */
            ref: string;
            /**
             * If ref is set, this refers to the ID of the catalog which contains the connection. If neither this attribute nor project_ref are specified, the connection will be assumed to exist in the project or catalog which contains the pipeline.
             */
            catalog_ref?: string;
            /**
             * If ref is set, this refers to the ID of the project which contains the connection. If neither this attribute nor catalog_ref are specified, the connection will be assumed to exist in the project or catalog which contains the pipeline.
             */
            project_ref?: string;
            /**
             * The properties for the connection. The specific properties allowed depend on the type of connection referenced.
             */
            properties?: {
              [k: string]: unknown;
            };
            [k: string]: unknown;
          };
          /**
           * Details of the data asset contained in a catalog or project to use for a pipeline binding node.
           */
          data_asset?: {
            /**
             * Object containing app-specific data
             */
            app_data?: {
              [k: string]: unknown;
            };
            /**
             * A reference to a data asset by ID.
             */
            ref?: string;
            /**
             * If ref is set, this refers to the ID of the catalog which contains the data asset. If neither this attribute nor project_ref are specified, the data asset will be assumed to exist in the project or catalog which contains the pipeline.
             */
            catalog_ref?: string;
            /**
             * If ref is set, this refers to the ID of the project which contains the data asset. If neither this attribute nor catalog_ref are specified, the data asset will be assumed to exist in the project or catalog which contains the pipeline.
             */
            project_ref?: string;
            /**
             * Properties controlling how the data asset is used.
             */
            properties?: {
              /**
               * The ID of the data asset attachment to use. If not specified and used as a source, the first suitable attachment found will be used. If not specified and used as a target, a new attachment will be created.
               */
              attachment_ref?: string;
              /**
               * Specifies the name of the data asset to read, create or update if ref is unset.
               */
              name?: boolean & string;
              /**
               * When used as a target, whether to update the data asset with the schema when a run completes or not (will be automatically updated if not supplied by caller).
               */
              no_write_schema?: boolean;
              /**
               * When used as a target, whether to update the data asset with the status when a run completes or not (will be automatically updated if not supplied by caller).
               */
              no_write_status?: boolean;
              [k: string]: {
                [k: string]: unknown;
              };
            };
            [k: string]: unknown;
          };
          /**
           * Binding node type identifier
           */
          op?: string;
          /**
           * Parameters for the binding exit node
           */
          parameters?: {
            [k: string]: unknown;
          };
        }
      | {
          /**
           * Unique identifier for the model within the current pipeline
           */
          id: string;
          /**
           * Model node description
           */
          description?: string;
          /**
           * Node type - always 'model_node' for model pipeline elements
           */
          type: "model_node";
          /**
           * Reference to the binary model
           */
          model_ref?: string;
          inputs: {
            /**
             * Unique identifier
             */
            id: string;
            /**
             * Optional data record schema reference associated with the port
             */
            schema_ref?: string;
            /**
             * Array of links going into the node. Applies to input ports and exit bindings only.
             */
            links?: {
              /**
               * Unique id of this link within the pipelineFlow. If omitted a new link id will be generated.
               */
              id?: string;
              /**
               * id of a node this link connects to
               */
              node_id_ref: string;
              /**
               * optional port id of a node this link connects to
               */
              port_id_ref?: string;
              /**
               * optional link name (used in parameter sets when there are multiple input sources)
               */
              link_name?: string;
              /**
               * Link type attribute
               */
              type_attr?: string;
              /**
               * Link description
               */
              description?: string;
              /**
               * Object containing app-specific data
               */
              app_data?: {
                /**
                 * object with app-specific UI-information
                 */
                ui_data?: {
                  /**
                   * CSS class name
                   */
                  class_name?: string;
                  /**
                   * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node to node link.
                   */
                  style?:
                    | string
                    | {
                        [k: string]: unknown;
                      };
                  /**
                   * Array of decorations used to decorate node links
                   */
                  decorations?: {
                    /**
                     * An identifier used to identify the decoration
                     */
                    id?: string;
                    /**
                     * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                     */
                    hotspot?: boolean;
                    /**
                     * CSS class name for decoration styling
                     */
                    class_name?: string;
                    /**
                     * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                     */
                    position?:
                      | "topLeft"
                      | "topCenter"
                      | "topRight"
                      | "middleLeft"
                      | "middleCenter"
                      | "middleRight"
                      | "bottomLeft"
                      | "bottomCenter"
                      | "bottomRight"
                      | "source"
                      | "middle"
                      | "target";
                    /**
                     * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                     */
                    x_pos?: number;
                    /**
                     * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                     */
                    y_pos?: number;
                    /**
                     * Image displayed at the decoration position. Provide either this or a label.
                     */
                    image?: string;
                    /**
                     * Label displayed at the decoration position. Provide either this or an image.
                     */
                    label?: string;
                    [k: string]: unknown;
                  }[];
                  [k: string]: unknown;
                };
                [k: string]: unknown;
              };
            }[];
            /**
             * Parameters for the port
             */
            parameters?: {
              [k: string]: unknown;
            };
            /**
             * Object containing app-specific data
             */
            app_data?: {
              /**
               * Additional UI info for ports
               */
              ui_data?: {
                /**
                 * Property to capture how many data assets are allowed for this port, e.g., min: 1, max:1 implies you must supply 1 and only 1; min:0, max:1 implies it is optional and a max of one, min:0, max:-1 means it is optional and you can may have any number of data assets. The default value is 1:1 for inputs and 1:-1 for outputs.
                 */
                cardinality?: {
                  /**
                   * Minimum data sets that are required for this port
                   */
                  min?: number;
                  /**
                   * Maximum data sets that are allowed on this port. A negative value indicates unlimited. The default value is 1 for inputs and -1 for outputs.
                   */
                  max?: number;
                };
                /**
                 * CSS class name
                 */
                class_name?: string;
                /**
                 * A 'style spec' object containing CSS strings to be applied to the SVG objects of the port.
                 */
                style?:
                  | string
                  | {
                      [k: string]: unknown;
                    };
                /**
                 * Port name
                 */
                label?: string;
                [k: string]: unknown;
              };
              [k: string]: unknown;
            };
          }[];
          outputs?: {
            /**
             * Unique identifier
             */
            id: string;
            /**
             * Optional data record schema reference associated with the port
             */
            schema_ref?: string;
            /**
             * Array of links going into the node. Applies to input ports and exit bindings only.
             */
            links?: {
              /**
               * Unique id of this link within the pipelineFlow. If omitted a new link id will be generated.
               */
              id?: string;
              /**
               * id of a node this link connects to
               */
              node_id_ref: string;
              /**
               * optional port id of a node this link connects to
               */
              port_id_ref?: string;
              /**
               * optional link name (used in parameter sets when there are multiple input sources)
               */
              link_name?: string;
              /**
               * Link type attribute
               */
              type_attr?: string;
              /**
               * Link description
               */
              description?: string;
              /**
               * Object containing app-specific data
               */
              app_data?: {
                /**
                 * object with app-specific UI-information
                 */
                ui_data?: {
                  /**
                   * CSS class name
                   */
                  class_name?: string;
                  /**
                   * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node to node link.
                   */
                  style?:
                    | string
                    | {
                        [k: string]: unknown;
                      };
                  /**
                   * Array of decorations used to decorate node links
                   */
                  decorations?: {
                    /**
                     * An identifier used to identify the decoration
                     */
                    id?: string;
                    /**
                     * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                     */
                    hotspot?: boolean;
                    /**
                     * CSS class name for decoration styling
                     */
                    class_name?: string;
                    /**
                     * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                     */
                    position?:
                      | "topLeft"
                      | "topCenter"
                      | "topRight"
                      | "middleLeft"
                      | "middleCenter"
                      | "middleRight"
                      | "bottomLeft"
                      | "bottomCenter"
                      | "bottomRight"
                      | "source"
                      | "middle"
                      | "target";
                    /**
                     * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                     */
                    x_pos?: number;
                    /**
                     * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                     */
                    y_pos?: number;
                    /**
                     * Image displayed at the decoration position. Provide either this or a label.
                     */
                    image?: string;
                    /**
                     * Label displayed at the decoration position. Provide either this or an image.
                     */
                    label?: string;
                    [k: string]: unknown;
                  }[];
                  [k: string]: unknown;
                };
                [k: string]: unknown;
              };
            }[];
            /**
             * Parameters for the port
             */
            parameters?: {
              [k: string]: unknown;
            };
            /**
             * Object containing app-specific data
             */
            app_data?: {
              /**
               * Additional UI info for ports
               */
              ui_data?: {
                /**
                 * Property to capture how many data assets are allowed for this port, e.g., min: 1, max:1 implies you must supply 1 and only 1; min:0, max:1 implies it is optional and a max of one, min:0, max:-1 means it is optional and you can may have any number of data assets. The default value is 1:1 for inputs and 1:-1 for outputs.
                 */
                cardinality?: {
                  /**
                   * Minimum data sets that are required for this port
                   */
                  min?: number;
                  /**
                   * Maximum data sets that are allowed on this port. A negative value indicates unlimited. The default value is 1 for inputs and -1 for outputs.
                   */
                  max?: number;
                };
                /**
                 * CSS class name
                 */
                class_name?: string;
                /**
                 * A 'style spec' object containing CSS strings to be applied to the SVG objects of the port.
                 */
                style?:
                  | string
                  | {
                      [k: string]: unknown;
                    };
                /**
                 * Port name
                 */
                label?: string;
                [k: string]: unknown;
              };
              [k: string]: unknown;
            };
          }[];
          /**
           * Node type identifier of modeling node that created this model.
           */
          op?: string;
          /**
           * Input parameters for the operator
           */
          parameters?: {
            [k: string]: unknown;
          };
          /**
           * Reference to the runtime associated with the current node
           */
          runtime_ref?: string;
          /**
           * Object containing app-specific data
           */
          app_data?: {
            /**
             * object with app-specific UI-information
             */
            ui_data?: {
              /**
               * User-defined label
               */
              label?: string;
              /**
               * User-defined description
               */
              description?: string;
              /**
               * CSS class name
               */
              class_name?: string;
              /**
               * A 'style spec' object containing CSS strings to be applied to the SVG objects of the node.
               */
              style?:
                | string
                | {
                    [k: string]: unknown;
                  };
              /**
               * Image name (do not embed images inline!)
               */
              image?: string;
              /**
               * x-position
               */
              x_pos?: number;
              /**
               * y-position
               */
              y_pos?: number;
              /**
               * Indicates whether a supernode is shown in expanded state or as a regular node.
               */
              is_expanded?: boolean;
              /**
               * Height of expanded supernode. If not provided an appropriate height is calculated.
               */
              expanded_height?: number;
              /**
               * Width of expanded supernode. If not provided an appropriate width is calculated.
               */
              expanded_width?: number;
              /**
               * additional attributes
               */
              attributes?: string;
              /**
               * Array of non-data node linkage
               */
              associations?: {
                /**
                 * Association identifier
                 */
                id: string;
                /**
                 * Target node id
                 */
                node_ref: string;
                /**
                 * CSS class name for link styling
                 */
                class_name?: string;
                /**
                 * A 'style spec' object containing CSS strings to be applied to the SVG objects of the association link.
                 */
                style?:
                  | string
                  | {
                      [k: string]: unknown;
                    };
                /**
                 * Array of decorations used to decorate association links
                 */
                decorations?: {
                  /**
                   * An identifier used to identify the decoration
                   */
                  id?: string;
                  /**
                   * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                   */
                  hotspot?: boolean;
                  /**
                   * CSS class name for decoration styling
                   */
                  class_name?: string;
                  /**
                   * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                   */
                  position?:
                    | "topLeft"
                    | "topCenter"
                    | "topRight"
                    | "middleLeft"
                    | "middleCenter"
                    | "middleRight"
                    | "bottomLeft"
                    | "bottomCenter"
                    | "bottomRight"
                    | "source"
                    | "middle"
                    | "target";
                  /**
                   * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                   */
                  x_pos?: number;
                  /**
                   * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                   */
                  y_pos?: number;
                  /**
                   * Image displayed at the decoration position. Provide either this or a label.
                   */
                  image?: string;
                  /**
                   * Label displayed at the decoration position. Provide either this or an image.
                   */
                  label?: string;
                  [k: string]: unknown;
                }[];
              }[];
              /**
               * An array of messages for the node
               */
              messages?: {
                /**
                 * Name of the parameter that has the message
                 */
                id_ref: string;
                /**
                 * Validation identifier from the fail_message validation section.
                 */
                validation_id?: string;
                /**
                 * Type of message
                 */
                type: "info" | "error" | "warning";
                /**
                 * Message string
                 */
                text: string;
                [k: string]: unknown;
              }[];
              /**
               * UI only parameter values for the node
               */
              ui_parameters?: {
                [k: string]: unknown;
              };
              /**
               * Array of decorations used to decorate nodes
               */
              decorations?: {
                /**
                 * An identifier used to identify the decoration
                 */
                id?: string;
                /**
                 * Indicates whether the decorator is a hotspot or not. ie does it send an event to consuming app. when clicked
                 */
                hotspot?: boolean;
                /**
                 * CSS class name for decoration styling
                 */
                class_name?: string;
                /**
                 * Indicates an anchor point on the node or link from which the decoration will be displayed. If x_pos and y_pos are not provided the decoration is displayed with a default offset from this position.
                 */
                position?:
                  | "topLeft"
                  | "topCenter"
                  | "topRight"
                  | "middleLeft"
                  | "middleCenter"
                  | "middleRight"
                  | "bottomLeft"
                  | "bottomCenter"
                  | "bottomRight"
                  | "source"
                  | "middle"
                  | "target";
                /**
                 * X position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                 */
                x_pos?: number;
                /**
                 * Y position of the decorator relative to the node's position field. If position is not provided it is relative to the 'topLeft' position
                 */
                y_pos?: number;
                /**
                 * Image displayed at the decoration position. Provide either this or a label.
                 */
                image?: string;
                /**
                 * Label displayed at the decoration position. Provide either this or an image.
                 */
                label?: string;
                [k: string]: unknown;
              }[];
              [k: string]: unknown;
            };
            [k: string]: unknown;
          };
        }
    )[];
  }

  interface PropertyDefinitions {
    titleDefinition?: {
      title?: string;
      /**
       * True if the title can be edited. False if the title should be readonly.
       */
      editable?: boolean;
      [k: string]: unknown;
    };
    /**
     * Current parameter set upon input. Keys are parameter names, values are their values.
     */
    current_parameters?: {
      [k: string]: unknown;
    };
    /**
     * Current UI only parameter set upon input. Keys are parameter names, values are their values.
     */
    current_ui_parameters?: {
      [k: string]: unknown;
    };
    parameters?: {
      id: string;
      type: "string" | "array[string]" | "boolean";
      enum?: any[];
      required?: boolean;
    }[];
    complex_types?: unknown;
    uihints?: {
      id: string;
      parameter_info: {
        parameter_ref: string;
        label: {
          default: string;
        };
        control?: "readonly" | "oneofselect";
        place_holder_text?: {
          default: string;
        };
      }[];
      action_info: any[];
      group_info: any[];
    };
    conditions?: unknown;
    dataset_metadata?:
      | {
          [k: string]: unknown;
        }
      | unknown[];
    /**
     * Map of string resources.
     */
    resources?: {
      [k: string]: unknown;
    };
    [k: string]: unknown;
  }
}
