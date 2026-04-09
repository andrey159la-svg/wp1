import React from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";

const FolderItem = ({
  folderData,
  isOpen,
  toggle,
  accentColor,
  categoryIcon: CategoryIcon,
}) => {
  const folderName = folderData.folder || "Без названия";
  const items = folderData.items || [];

  // Берем иконку из папки, если нет - из категории, если нет - щит
  const Icon = folderData.icon || CategoryIcon || ShieldCheck;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all mb-2"
      style={{
        background: isOpen
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.01)",
        border: isOpen
          ? `1px solid ${accentColor}66`
          : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <button
        onClick={toggle}
        className="w-full px-4 py-4 flex items-center justify-between group text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{
              background: isOpen
                ? `${accentColor}22`
                : "rgba(255,255,255,0.03)",
            }}
          >
            {/* Вот она, динамическая иконка */}
            <Icon
              size={16}
              style={{ color: isOpen ? accentColor : "#475569" }}
            />
          </div>
          <div>
            <div
              className={`text-sm font-bold tracking-wide ${
                isOpen ? "text-white" : "text-slate-400"
              }`}
            >
              {folderName}
            </div>
            <div className="text-[10px] text-slate-600 uppercase font-bold">
              Записей: {items.length}
            </div>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "text-slate-600"
          }`}
          style={{ color: isOpen ? accentColor : "" }}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          {/* Сюда рендерится контент папки */}
          {folderData.items?.map((item, idx) => (
            <div
              key={idx}
              className="p-2 mb-1 bg-black/20 rounded border border-white/5 text-xs text-slate-400"
            >
              <span className="font-bold text-slate-500 uppercase">
                {item.label}:
              </span>{" "}
              {item.val}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderItem;
