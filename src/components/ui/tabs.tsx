import { useState, ReactNode } from "react";

type Tab = { id: string; label: string; content: ReactNode };

type TabsProps = {
  tabs: Tab[];
  defaultTab?: string;
};

const Tabs = ({ tabs, defaultTab }: TabsProps) => {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === active);

  return (
    <div>
      <div className="flex gap-6 border-b border-[#E8F5EC] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors duration-200 border-b-2 -mb-px ${
              active === tab.id
                ? "text-[#2D6A4F] border-[#2D6A4F]"
                : "text-[#7A9A88] border-transparent hover:text-[#4A6357]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{activeTab?.content}</div>
    </div>
  );
};

export default Tabs;
