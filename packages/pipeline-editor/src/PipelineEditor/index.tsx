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

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { CommonCanvas } from "@elyra/canvas";
import { IntlProvider } from "react-intl";

import NodeTooltip from "../NodeTooltip";
import PalettePanel from "../PalettePanel";
import PipelineController from "../PipelineController";
import PropertiesPanel from "../PropertiesPanel";
import SplitPanelLayout from "../SplitPanelLayout";
import TabbedPanelLayout from "../TabbedPanelLayout";
import useBlockEvents from "./useBlockEvents";

interface Props {
  pipeline: any;
  toolbar?: any;
  nodes?: any;
  onAction?: (type: string) => any;
  onChange?: (pipeline: any) => any;
  onError?: () => any;
  onFileRequested?: (startPath?: string, multiselect?: boolean) => any;
  readOnly?: boolean;
  panelOpen?: boolean;
  children?: React.ReactNode;
}

const NODE_SVG_PATH =
  "M 0 0 h 160 a 6 6 0 0 1 6 6 v 28 a 6 6 0 0 1 -6 6 h -160 a 6 6 0 0 1 -6 -6 v -28 a 6 6 0 0 1 6 -6 z";

const PipelineEditor = forwardRef(
  (
    {
      pipeline,
      nodes,
      toolbar,
      onAction,
      onChange,
      onError,
      onFileRequested,
      readOnly,
      panelOpen,
      children,
    }: Props,
    ref
  ) => {
    const controller = useRef(new PipelineController());

    const [currentTab, setCurrentTab] = useState<string | undefined>();

    const blockingRef = useBlockEvents({
      wheel: true,
      contextmenu: readOnly,
    });

    useEffect(() => {
      try {
        controller.current.open(pipeline);
        if (!readOnly) {
          controller.current.setNodes(nodes);
          controller.current.validate();
        } else {
          controller.current.clearErrors();
        }
        // don't call to persist change because it will cause an infinate loop
      } catch {
        onError?.();
      }
    }, [nodes, onChange, onError, pipeline, readOnly]);

    useImperativeHandle(ref, () => ({
      addFile: () => {
        console.log("add file");
      },
    }));

    // TODO: only show "Open Files" if it's a file based node.
    const handleContextMenu = useCallback(
      (e: IContextMenuEvent, defaultMenu: IContextMenu) => {
        // If not a node use default menu
        if (e.type !== "node") {
          return defaultMenu;
        }

        // multiple nodes selected
        if (e.selectedObjectIds.length > 1) {
          return defaultMenu.concat({
            action: "openFile",
            label: "Open Files",
          });
        }

        // single EXECUTION node selected (not super node)
        if (e.targetObject.type === "execution_node") {
          return defaultMenu.concat(
            {
              action: "openFile",
              label: "Open File",
            },
            {
              action: "properties",
              label: "Properties",
            }
          );
        }

        // anything else
        return defaultMenu;
      },
      []
    );

    const handleClickAction = useCallback((e: ICanvasClickEvent) => {
      if (e.clickType === "DOUBLE_CLICK" && e.objectType === "node") {
        // TODO: callback to let parent decide what to do instead.
        setCurrentTab("properties");
        controller.current.editActionHandler({ editType: "properties" });
      }
    }, []);

    const [selectedNodes, setSelectedNodes] = useState();
    const handleSelectionChange = useCallback((e: any) => {
      setSelectedNodes(e.selectedNodes);
    }, []);

    const handleEditAction = useCallback(
      async (e: ICanvasEditEvent) => {
        onAction?.(e.editType);

        if (e.editType === "properties") {
          setCurrentTab("properties");
        }

        if (e.editType === "createExternalNode") {
          console.log(e);
          const nodeTemplate = controller.current.getPaletteNode(e.op);
          if (nodeTemplate) {
            const convertedTemplate = controller.current.convertNodeTemplate(
              nodeTemplate
            );
            const action = {
              editType: "createNode",
              nodeTemplate: convertedTemplate,
              pipelineId: e.pipelineId,
              offsetX: e.offsetX,
              offsetY: e.offsetY,
            };
            controller.current.editActionHandler(action);
          }
        }

        // I can't remember if validating now breaks anything?
        controller.current.validate();
        onChange?.(controller.current.getPipelineFlow());
      },
      [onAction, onChange]
    );

    const handlePropertiesChange = useCallback(
      (nodeID, data) => {
        controller.current.setNodeProperties(
          nodeID,
          { app_data: data },
          controller.current.getPrimaryPipelineId()
        );
        // I can't remember if validating now breaks anything?
        controller.current.validate();
        onChange?.(controller.current.getPipelineFlow());
      },
      [onChange]
    );

    const handleTooltip = (tipType: string, e: ITipEvent) => {
      function isNodeTipEvent(type: string, _e: ITipEvent): _e is ITipNode {
        return type === "tipTypeNode";
      }
      if (isNodeTipEvent(tipType, e) && e.node.type === "execution_node") {
        const error = e.node.app_data.invalidNodeError;
        const properties = controller.current.properties(e.node.id);
        return <NodeTooltip error={error} properties={properties} />;
      }
      return null;
    };

    const propertiesActionHandler = (
      id: string,
      appData: any,
      data: any
    ): any => {
      if (id === "browse_file") {
        let filename = "";
        if (data.index === undefined) {
          filename = data.propertyValue;
        } else if (data.propertyValue !== undefined) {
          filename = data.propertyValue[data.index];
        }
        return onFileRequested?.(filename, data.index !== undefined);
      }
    };

    if (readOnly) {
      return (
        <div
          className="pipeline-read-only"
          style={{ height: "100%" }}
          ref={blockingRef}
        >
          <IntlProvider locale="en">
            <CommonCanvas
              canvasController={controller.current}
              contextMenuHandler={() => {}}
              editActionHandler={() => {
                controller.current.setPipelineFlow(pipeline);
                controller.current.clearErrors();
              }}
              toolbarConfig={[]}
              config={{
                enableInternalObjectModel: false,
                emptyCanvasContent: children,
                enablePaletteLayout: "None",
                enableNodeFormatType: "Horizontal",
                enableToolbarLayout: "None",
                enableNodeLayout: {
                  bodyPath: NODE_SVG_PATH,
                  selectionPath: NODE_SVG_PATH,
                },
              }}
            />
          </IntlProvider>
        </div>
      );
    }

    return (
      <div style={{ height: "100%" }} ref={blockingRef}>
        <IntlProvider locale="en">
          <SplitPanelLayout
            left={
              <CommonCanvas
                canvasController={controller.current}
                contextMenuHandler={handleContextMenu}
                clickActionHandler={handleClickAction}
                editActionHandler={handleEditAction}
                selectionChangeHandler={handleSelectionChange}
                tipHandler={handleTooltip}
                toolbarConfig={toolbar ?? []}
                config={{
                  enableInternalObjectModel: true,
                  emptyCanvasContent: children,
                  enablePaletteLayout: "None", // 'Flyout', 'None', 'Modal'
                  enableNodeFormatType: "Horizontal",
                  enableToolbarLayout: toolbar === undefined ? "None" : "Top",
                }}
                notificationConfig={{ enable: false }}
                contextMenuConfig={{
                  enableCreateSupernodeNonContiguous: true,
                  defaultMenuEntries: {
                    saveToPalette: false,
                    createSupernode: true,
                  },
                }}
              />
            }
            right={
              <TabbedPanelLayout
                currentTab={currentTab}
                onTabClick={(id) => {
                  setCurrentTab(id);
                  onAction?.("openPanel");
                }}
                tabs={[
                  {
                    id: "properties",
                    label: "NODE PROPERTIES",
                    content: (
                      <PropertiesPanel
                        selectedNodes={selectedNodes}
                        nodes={nodes}
                        actionHandler={propertiesActionHandler}
                        onChange={handlePropertiesChange}
                      />
                    ),
                  },
                  {
                    id: "palette",
                    label: "PALETTE",
                    content: <PalettePanel nodes={nodes} />,
                  },
                ]}
                open={panelOpen}
                experimental={toolbar === undefined}
                onClose={() => {
                  onAction?.("closePanel");
                }}
              />
            }
            experimental={toolbar === undefined}
            rightOpen={panelOpen}
          />
        </IntlProvider>
      </div>
    );
  }
);

export default PipelineEditor;
