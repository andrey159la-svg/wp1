import React from "react";
import { Search, Bot, Terminal } from "lucide-react";

const TabHeader = ({ isSearching, activeTab, searchQuery, allContent }) => {
  // Определяем цвет текста и иконки
  const getThemeClass = () => {
    if (isSearching) return "text-slate-300";
    if (activeTab === "andryuha") return "text-yellow-400";
    return allContent[activeTab]?.color || "text-slate-300";
  };

  const getTitleClass = () => {
    if (isSearching) return "text-white";
    if (activeTab === "andryuha") return "text-yellow-400";
    return allContent[activeTab]?.color || "text-slate-300";
  };

  return (
    <div
      className="px-5 py-3.5 flex items-center justify-between"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`p-1.5 rounded-lg ${getThemeClass()}`}
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {isSearching ? (
            <Search size={14} />
          ) : activeTab === "andryuha" ? (
            <Bot size={14} />
          ) : (
            React.createElement(allContent[activeTab]?.icon || Terminal, {
              size: 14,
            })
          )}
        </div>

        <h2 className={`text-sm font-bold tracking-wide ${getTitleClass()}`}>
          {isSearching
            ? `Поиск: "${searchQuery}"`
            : activeTab === "andryuha"
            ? "Андрюха"
            : allContent[activeTab]?.label}
        </h2>
      </div>

      {activeTab === "dashboard" && !isSearching && (
        <span className="text-[9px] text-slate-500 uppercase tracking-widest">
          Обновление каждые 30 сек
        </span>
      )}
    </div>
  );
};

export default TabHeader;
