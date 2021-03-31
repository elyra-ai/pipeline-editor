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

import {
  CanvasClickEvent,
  CanvasEditEvent,
  CanvasSelectionEvent,
  CommonCanvas,
  ContextMenu,
  ContextMenuEvent,
  NodeTypeDef,
  TipEvent,
  TipNode,
} from "@elyra/canvas";
import { IntlProvider } from "react-intl";
import styled, { useTheme } from "styled-components";

import NodeTooltip from "../NodeTooltip";
import PalettePanel from "../PalettePanel";
import PipelineController from "../PipelineController";
import PropertiesPanel from "../PropertiesPanel";
import SplitPanelLayout from "../SplitPanelLayout";
import TabbedPanelLayout from "../TabbedPanelLayout";
import { InternalThemeProvider } from "../ThemeProvider";
import useBlockEvents from "./useBlockEvents";

interface Props {
  pipeline: any;
  toolbar?: any;
  nodes?: any;
  onAction?: (action: { type: string; payload?: any }) => any;
  onChange?: (pipeline: any) => any;
  onDoubleClickNode?: (e: CanvasClickEvent) => any;
  onError?: (error: Error) => any;
  onFileRequested?: (startPath?: string, multiselect?: boolean) => any;
  readOnly?: boolean;
  children?: React.ReactNode;
  nativeKeyboardActions?: boolean;
}

const READ_ONLY_NODE_SVG_PATH =
  "M 0 0 h 160 a 6 6 0 0 1 6 6 v 28 a 6 6 0 0 1 -6 6 h -160 a 6 6 0 0 1 -6 -6 v -28 a 6 6 0 0 1 6 -6 z";

function isMenuItemEnabled(menu: ContextMenu, action: string) {
  const item = menu.find((m) => {
    if (m.menu === undefined) {
      return m.action === action;
    }
    // If there is a sub menu, search it as well.
    return m.menu.find((mm) => mm.action === action);
  });

  if (item === undefined) {
    return false;
  }

  return item.enable !== false;
}

const Container = styled.div`
  height: 100%;
  color: ${({ theme }) => theme.palette.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeight};
  font-size: ${({ theme }) => theme.typography.fontSize};
`;

function useCloseContextMenu(controller: React.MutableRefObject<any>) {
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      const el = document.getElementById("context-menu-popover");
      // Do nothing if clicking ref's element or descendent elements
      if (el === null || el.contains(e.target as Node)) {
        return;
      }
      controller.current.closeContextMenu();
    }

    function handleFocusChange() {
      if (!document.hasFocus()) {
        controller.current.closeContextMenu();
      }
    }

    document.addEventListener("visibilitychange", handleFocusChange);
    window.addEventListener("blur", handleFocusChange);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("visibilitychange", handleFocusChange);
      window.removeEventListener("blur", handleFocusChange);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [controller]);
}

const Button = styled.div`
  cursor: pointer;
  position: absolute;
  top: 24px;
  left: 28px;
  z-index: 1;
  padding: 10px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize};
  font-weight: ${({ theme }) => theme.typography.fontWeight};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.palette.primary.contrastText};

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.hover};
  }

  &:focus {
    outline: none;
  }
`;

const PipelineEditor = forwardRef(
  (
    {
      pipeline,
      nodes,
      toolbar,
      onAction,
      onChange,
      onDoubleClickNode,
      onError,
      onFileRequested,
      readOnly,
      children,
      nativeKeyboardActions,
    }: Props,
    ref
  ) => {
    const theme = useTheme();
    const controller = useRef(new PipelineController());

    const [supernodeOpen, setSupernodeOpen] = useState(false);

    useEffect(() => {
      const store = controller.current.objectModel.store.store;

      let currentlyOpen: boolean;
      function handleChange() {
        let previouslyOpen = currentlyOpen;
        currentlyOpen = store.getState().breadcrumbs.length > 1;

        if (previouslyOpen !== currentlyOpen) {
          setSupernodeOpen(currentlyOpen);
        }
      }

      const unsubscribe = store.subscribe(handleChange);
      return () => {
        unsubscribe();
      };
    }, []);

    const [currentTab, setCurrentTab] = useState<string | undefined>();
    const [panelOpen, setPanelOpen] = useState(false);

    useCloseContextMenu(controller);

    const blockingRef = useBlockEvents({
      wheel: true,
      contextmenu: readOnly,
    });

    useEffect(() => {
      try {
        controller.current.open(pipeline);
        if (!readOnly) {
          controller.current.setNodes(nodes);
          controller.current.validate({ redColor: theme.palette.error.main });
        } else {
          controller.current.resetStyles();
        }
        // don't call to persist change because it will cause an infinate loop
      } catch (e) {
        onError?.(e);
      }
    }, [nodes, onError, pipeline, readOnly, theme.palette.error.main]);

    useImperativeHandle(
      ref,
      () => ({
        addFile: (item: any) => {
          controller.current.addNode(item);
        },
      }),
      []
    );

    const handleContextMenu = useCallback(
      (e: ContextMenuEvent, defaultMenu: ContextMenu) => {
        const canPaste = isMenuItemEnabled(defaultMenu, "paste");

        const canDisconnect = isMenuItemEnabled(defaultMenu, "disconnectNode");

        const canExpand = isMenuItemEnabled(
          defaultMenu,
          "expandSuperNodeInPlace"
        );

        if (e.type === "canvas") {
          return [
            {
              action: "createComment",
              label: "New Comment",
            },
            {
              divider: true,
            },
            {
              action: "paste",
              label: "Paste",
              enable: canPaste,
            },
          ];
        }

        if (e.selectedObjectIds.length > 1) {
          return [
            {
              action: "createSuperNode",
              label: "Create Supernode",
              // NOTE: There is a bug if you try to create a supernode with only
              // a comment selected. This will disable creating supernodes when
              // the comment is right clicked on even if other nodes are
              // selected, which is allowed. Just too lazy to loop through all
              // selected items to determine if non comments are also selected.
              enable: e.type !== "comment",
            },
            {
              divider: true,
            },
            {
              action: "cut",
              label: "Cut",
            },
            {
              action: "copy",
              label: "Copy",
            },
            {
              divider: true,
            },
            {
              action: "disconnectNode",
              label: "Disconnect",
              enable: canDisconnect,
            },
            {
              action: "deleteSelectedObjects",
              label: "Delete",
            },
          ];
        }

        switch (e.type) {
          case "canvas":
            return [
              {
                action: "createComment",
                label: "New Comment",
              },
              {
                divider: true,
              },
              {
                action: "paste",
                label: "Paste",
                enable: canPaste,
              },
            ];
          case "node":
            if (e.targetObject.type === "execution_node") {
              return [
                {
                  action: "openFile",
                  label: "Open File",
                  // NOTE: This only checks if the string is empty, but we
                  // should verify the file exists.
                  enable:
                    e.targetObject?.app_data?.filename !== undefined &&
                    e.targetObject?.app_data?.filename.trim() !== "",
                },
                {
                  action: "properties",
                  label: "Open Properties",
                },
                {
                  divider: true,
                },
                {
                  action: "createSuperNode",
                  label: "Create Supernode",
                },
                {
                  divider: true,
                },
                {
                  action: "cut",
                  label: "Cut",
                },
                {
                  action: "copy",
                  label: "Copy",
                },
                {
                  divider: true,
                },
                {
                  action: "disconnectNode",
                  label: "Disconnect",
                  enable: canDisconnect,
                },
                {
                  action: "deleteSelectedObjects",
                  label: "Delete",
                },
              ];
            }
            if (e.targetObject.type === "super_node") {
              return [
                {
                  action: canExpand
                    ? "expandSuperNodeInPlace"
                    : "collapseSuperNodeInPlace",
                  label: canExpand ? "Expand Supernode" : "Collapse Supernode",
                },
                {
                  divider: true,
                },
                {
                  action: "createSuperNode",
                  label: "Create Supernode",
                },
                {
                  divider: true,
                },
                {
                  action: "cut",
                  label: "Cut",
                },
                {
                  action: "copy",
                  label: "Copy",
                },
                {
                  divider: true,
                },
                {
                  action: "disconnectNode",
                  label: "Disconnect",
                  enable: canDisconnect,
                },
                {
                  action: "deleteSelectedObjects",
                  label: "Delete",
                },
              ];
            }
            break;
          case "link":
            return [
              {
                action: "deleteLink",
                label: "Delete",
              },
            ];
          case "comment":
            return [
              {
                action: "createSuperNode",
                label: "Create Supernode",
                // NOTE: There is a bug if you try to create a supernode with only
                // a comment selected.
                enable: false,
              },
              {
                divider: true,
              },
              {
                action: "cut",
                label: "Cut",
              },
              {
                action: "copy",
                label: "Copy",
              },
              {
                divider: true,
              },
              {
                action: "disconnectNode",
                label: "Disconnect",
                enable: canDisconnect,
              },
              {
                action: "deleteSelectedObjects",
                label: "Delete",
              },
            ];
        }

        // anything else
        return defaultMenu;
      },
      []
    );

    const handleClickAction = useCallback(
      (e: CanvasClickEvent) => {
        if (e.clickType === "DOUBLE_CLICK" && e.objectType === "node") {
          if (onDoubleClickNode !== undefined) {
            return onDoubleClickNode(e);
          }
          setCurrentTab("properties");
          controller.current.editActionHandler({ editType: "properties" });
        }
      },
      [onDoubleClickNode]
    );

    const [selectedNodes, setSelectedNodes] = useState<NodeTypeDef[]>();
    const handleSelectionChange = useCallback((e: CanvasSelectionEvent) => {
      setSelectedNodes(e.selectedNodes);
    }, []);

    const handleEditAction = useCallback(
      async (e: CanvasEditEvent) => {
        let payload;
        if (e.editType === "openFile") {
          payload = e.targetObject?.app_data?.filename;
        }
        onAction?.({ type: e.editType, payload });

        if (e.editType === "properties") {
          setCurrentTab("properties");
          setPanelOpen(true);
        }

        if (e.editType === "toggleOpenPanel") {
          setPanelOpen((prev) => !prev);
        }

        if (e.editType === "createExternalNode") {
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

        // Catch any events where a save isn't necessary.
        switch (e.editType) {
          case "properties":
          case "openFile":
          case "toggleOpenPanel":
          case "copy": // NOTE: "cut" deletes an item so needs a save.
          case "displaySubPipeline":
          case "displayPreviousPipeline":
            return;
        }

        onChange?.(controller.current.getPipelineFlow());
      },
      [onAction, onChange]
    );

    const handlePropertiesChange = useCallback(
      (nodeID, data) => {
        const pipeline = controller.current.findNodeParentPipeline(nodeID);
        if (pipeline !== undefined) {
          controller.current.setNodeProperties(
            nodeID,
            { app_data: data },
            pipeline.id
          );
          onChange?.(controller.current.getPipelineFlow());
        }
      },
      [onChange]
    );

    const handleTooltip = (tipType: string, e: TipEvent) => {
      function isNodeTipEvent(type: string, _e: TipEvent): _e is TipNode {
        return type === "tipTypeNode";
      }
      if (isNodeTipEvent(tipType, e) && e.node.type === "execution_node") {
        const error = e.node.app_data.invalidNodeError;
        const properties = controller.current.properties(e.node.id);
        return <NodeTooltip error={error} properties={properties} />;
      }
      if (isNodeTipEvent(tipType, e) && e.node.type === "super_node") {
        // TODO: Can we can sub node errors propagated up?
        return "Supernode";
      }
      return null;
    };

    if (readOnly) {
      return (
        <Container className="pipeline-read-only" ref={blockingRef}>
          <IntlProvider locale="en">
            <CommonCanvas
              canvasController={controller.current}
              contextMenuHandler={() => {}}
              editActionHandler={() => {
                controller.current.setPipelineFlow(pipeline);
                controller.current.resetStyles();
              }}
              toolbarConfig={[]}
              config={{
                enableInternalObjectModel: false,
                emptyCanvasContent: children,
                enablePaletteLayout: "None",
                enableNodeFormatType: "Horizontal",
                enableToolbarLayout: "None",
                enableNodeLayout: {
                  bodyPath: READ_ONLY_NODE_SVG_PATH,
                  selectionPath: READ_ONLY_NODE_SVG_PATH,
                  dropShadow: false,
                },
              }}
            />
          </IntlProvider>
        </Container>
      );
    }

    return (
      <Container ref={blockingRef}>
        <IntlProvider locale="en">
          {supernodeOpen === true && (
            <Button
              onClick={() => {
                controller.current.editActionHandler({
                  editType: "displayPreviousPipeline",
                });
              }}
            >
              Return to previous flow
            </Button>
          )}
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
                  enableNodeLayout: {
                    imagePosX: 10 + 2.5,
                    imagePosY: 0,
                    imageWidth: 16,
                    imageHeight: 35,
                    labelPosX: 32 + 2.5,
                    labelMaxWidth: 118 - 5,
                    defaultNodeHeight: 35,
                    inputPortLeftPosY: 17.5,
                    outputPortRightPosY: 17.5,
                    dropShadow: false,
                    labelPosY: 12 - 3,
                  },
                }}
                notificationConfig={{ enable: false }}
                contextMenuConfig={{
                  enableCreateSupernodeNonContiguous: true,
                  defaultMenuEntries: {
                    saveToPalette: false,
                    createSupernode: true,
                  },
                }}
                keyboardConfig={
                  nativeKeyboardActions
                    ? {
                        actions: {
                          undo: false,
                          redo: false,
                          cutToClipboard: false,
                          copyToClipboard: false,
                          pasteFromClipboard: false,
                        },
                      }
                    : undefined
                }
              />
            }
            right={
              <TabbedPanelLayout
                currentTab={currentTab}
                onTabClick={(id) => {
                  setCurrentTab(id);
                  onAction?.({ type: "openPanel" });
                  setPanelOpen(true);
                }}
                tabs={[
                  {
                    id: "properties",
                    label: "Node Properties",
                    icon: theme.overrides?.propertiesIcon,
                    content: (
                      <PropertiesPanel
                        selectedNodes={selectedNodes}
                        nodes={nodes}
                        onFileRequested={onFileRequested}
                        onChange={handlePropertiesChange}
                      />
                    ),
                  },
                  {
                    id: "palette",
                    label: "Palette",
                    icon: theme.overrides?.paletteIcon,
                    content: <PalettePanel nodes={nodes} />,
                  },
                ]}
                collapsed={panelOpen === false}
                showCloseButton={toolbar === undefined}
                onClose={() => {
                  onAction?.({ type: "closePanel" });
                  setPanelOpen(false);
                }}
              />
            }
            mode={
              panelOpen
                ? "open"
                : toolbar === undefined
                ? "collapsed"
                : "closed"
            }
          />
        </IntlProvider>
      </Container>
    );
  }
);

const ThemedPipelineEditor = forwardRef((props: Props, ref) => {
  return (
    <InternalThemeProvider>
      <PipelineEditor {...props} ref={ref} />
    </InternalThemeProvider>
  );
});

export default ThemedPipelineEditor;
