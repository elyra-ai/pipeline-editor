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
        <div style={{ display: "flex" }}>
          {tabs.map((t) => (
            <div
              onClick={() => {
                setCurrentTab(t.id);
              }}
            >
              {t.label}
            </div>
          ))}
        </div>
        <div>
          <div onClick={togglePanelOpen}>X</div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: "35px",
          bottom: 0,
          overflow: "scroll",
          width: "100%",
        }}
      >
        {tabs.find((t) => t.id === currentTab)?.content}
      </div>
    </React.Fragment>
  );
}

export default TabbedPanelLayout;
