import React, { useState } from "react";

interface Props {
  tabs: Tab[];
  togglePanelOpen: () => void;
}

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

function TabbedPanelLayout({ tabs, togglePanelOpen }: Props) {
  const [currentTab, setCurrentTab] = useState(tabs[0].id);

  return (
    <React.Fragment>
      <div>
        <div className="elyra-pipeline-tabBar">
          {tabs.map((t) => (
            <div
              className={
                "elyra-pipeline-tab" +
                (currentTab === t.id ? " elyra-pipeline-tab-active" : "")
              }
              onClick={() => {
                setCurrentTab(t.id);
              }}
            >
              {t.label}
            </div>
          ))}
        </div>
        <div className="elyra-pipeline-closePanel" onClick={togglePanelOpen}>
          X
        </div>
      </div>
      <div className="elyra-tabContent">
        {tabs.find((t) => t.id === currentTab)?.content}
      </div>
    </React.Fragment>
  );
}

export default TabbedPanelLayout;
