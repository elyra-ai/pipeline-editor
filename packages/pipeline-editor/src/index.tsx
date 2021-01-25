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

import { NodeTooltip } from "./NodeTooltip";
import PipelineController from "./PipelineController";
import PropertiesPanel from "./PropertiesPanel";
import useBlockEvents from "./useBlockEvents";

import "../node_modules/@elyra/canvas/dist/styles/common-canvas.min.css";
import "../style/index.css";

interface Props {
  pipeline: any;
  mode?: "vscode" | "jupyter";
  nodes?: any;
  onAction?: (type: string) => any;
  onChange?: (pipeline: any) => any;
  onError?: () => any;
  onFileRequested?: () => any;
  readOnly?: boolean;
}

const NODE_SVG_PATH =
  "M 0 0 h 160 a 6 6 0 0 1 6 6 v 28 a 6 6 0 0 1 -6 6 h -160 a 6 6 0 0 1 -6 -6 v -28 a 6 6 0 0 1 6 -6 z";

const isNodeTipEvent = (type: string, _e: ITipEvent): _e is ITipNode => {
  return type === "tipTypeNode";
};

const PipelineEditor = forwardRef(
  (
    {
      pipeline,
      nodes,
      mode,
      onAction,
      onChange,
      onError,
      onFileRequested,
      readOnly,
    }: Props,
    ref
  ) => {
    const controller = useRef(new PipelineController());

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
        for (const selectedObject of e.selectedObjectIds) {
          // TODO: open a file or properties or something, to discuss...
        }
      }
    }, []);

    const [selectedNodes, setSelectedNodes] = useState();
    const handleSelectionChange = useCallback((e: any) => {
      setSelectedNodes(e.selectedNodes);
    }, []);

    const handleEditAction = useCallback(
      async (e: ICanvasEditEvent) => {
        switch (e.editType) {
          case "run": {
            onAction?.("run");
            break;
          }
          case "export": {
            onAction?.("export");
            break;
          }
          case "save": {
            onAction?.("save");
            break;
          }
          case "clear": {
            onAction?.("clear");
            break;
          }
          case "openRuntimes": {
            onAction?.("openRuntimes");
            break;
          }
          case "openFile": {
            onAction?.("openFile");
            break;
          }
          case "properties": {
            // common properties
            break;
          }
        }
        // I can't remember if validating now breaks anything?
        controller.current.validate();
        onChange?.(controller.current.getPipelineFlow());
      },
      [onAction, onChange]
    );

    const handlePropertiesChange = useCallback(() => {
      // I can't remember if validating now breaks anything?
      controller.current.validate();
      onChange?.(controller.current.getPipelineFlow());
    }, [onChange]);

    const handleTooltip = (
      tipType: string,
      e: ITipEvent
    ): JSX.Element | null => {
      if (isNodeTipEvent(tipType, e) && e.node.type === "execution_node") {
        const error = e.node.app_data.invalidNodeError;
        const properties = controller.current.properties(e.node.id);
        return <NodeTooltip error={error} properties={properties} />;
      }
      return null;
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

    if (mode === "vscode") {
      return (
        <div style={{ height: "100%" }} ref={blockingRef}>
          <IntlProvider locale="en">
            <CommonCanvas
              contextMenuHandler={handleContextMenu}
              clickActionHandler={handleClickAction}
              editActionHandler={handleEditAction}
              selectionChangeHandler={handleSelectionChange}
              tipHandler={handleTooltip}
              toolbarConfig={[]}
              config={{
                enableInternalObjectModel: true,
                // emptyCanvasContent: <EmptyCanvas />,
                enablePaletteLayout: "None", // 'Flyout', 'None', 'Modal'
                enableNodeFormatType: "Horizontal",
                enableToolbarLayout: "None",
              }}
              notificationConfig={{ enable: false }}
              contextMenuConfig={{
                enableCreateSupernodeNonContiguous: true,
                defaultMenuEntries: {
                  saveToPalette: false,
                  createSupernode: true,
                },
              }}
              canvasController={controller.current}
            />
            <PropertiesPanel
              selectedNodes={selectedNodes}
              nodes={nodes}
              canvasController={controller.current}
              onPropertiesChange={handlePropertiesChange}
            />
          </IntlProvider>
        </div>
      );
    }

    return (
      <div style={{ height: "100%" }} ref={blockingRef}>
        <IntlProvider locale="en">
          <CommonCanvas
            contextMenuHandler={handleContextMenu}
            clickActionHandler={handleClickAction}
            editActionHandler={handleEditAction}
            tipHandler={handleTooltip}
            toolbarConfig={[]}
            config={{
              enableInternalObjectModel: true,
              // emptyCanvasContent: <EmptyCanvas />,
              enablePaletteLayout: "None", // 'Flyout', 'None', 'Modal'
              enableNodeFormatType: "Horizontal",
              enableToolbarLayout: "None",
            }}
            notificationConfig={{ enable: false }}
            contextMenuConfig={{
              enableCreateSupernodeNonContiguous: true,
              defaultMenuEntries: {
                saveToPalette: false,
                createSupernode: true,
              },
            }}
            canvasController={controller.current}
          />
          <PropertiesPanel
            selectedNodes={selectedNodes}
            nodes={nodes}
            canvasController={controller.current}
            onPropertiesChange={handlePropertiesChange}
          />
        </IntlProvider>
      </div>
    );
  }
);

export { PipelineEditor };

export { default as PipelineController } from "./PipelineController";
