import React from "react";
import {
  Database,
  RefreshCw,
  Bell,
  ChevronDown,
  HardDrive,
  Bot,
  Zap,
  FileText,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

const Sidebar = ({
  navItems,
  activeTab,
  newLeadsCount,
  isBitrixLoading,
  fetchBitrixLeads,
  isEquipMenuOpen,
  setIsEquipMenuOpen,
  navigateTo,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Bitrix widget */}
      <div
        className="rounded-2xl p-4 relative overflow-hidden backdrop-blur-md shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(37,40,44,0.9), rgba(24,26,29,0.95))",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.2)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Database size={12} className="text-blue-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Bitrix24
            </span>
          </div>
          <button
            onClick={fetchBitrixLeads}
            disabled={isBitrixLoading}
            className={`text-slate-500 hover:text-white transition-all p-1.5 rounded-lg bg-white/5 border border-white/5 ${
              isBitrixLoading ? "animate-spin" : ""
            }`}
          >
            <RefreshCw size={11} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-1">
              Новых заявок:
            </p>
            <div className="flex items-center gap-3">
              <span
                className={`text-4xl font-black tracking-tighter ${
                  newLeadsCount > 0
                    ? "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse"
                    : "text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                }`}
              >
                {newLeadsCount !== null ? newLeadsCount : "--"}
              </span>
              {newLeadsCount > 0 && (
                <a
                  href="https://warpointmsk.bitrix24.ru/crm/deal/kanban/category/37/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 bg-red-500 text-white rounded text-[9px] font-black uppercase animate-bounce shadow-lg shadow-red-500/40"
                >
                  Новые!
                </a>
              )}
            </div>
          </div>
          <Bell
            size={20}
            className={
              newLeadsCount > 0
                ? "text-red-500/50 animate-tada"
                : "text-slate-800"
            }
          />
        </div>

        {/* Декоративный блик сверху */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/5 blur-3xl rounded-full" />
      </div>

      {/* Nav menu */}
      <div
        className="rounded-2xl overflow-hidden backdrop-blur-md"
        style={{
          background: "rgba(37,40,44,0.85)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
            Навигация
          </span>
        </div>

        <div className="p-2 space-y-1">
          {navItems.map((nav) => {
            const isEquip = nav.key === "equipment";
            const isActiveTabInThisParent =
              isEquip && nav.children.some((c) => c.key === activeTab);
            const isActive = activeTab === nav.key;

            if (isEquip) {
              return (
                <div key={nav.key} className="space-y-1">
                  <button
                    onClick={() => setIsEquipMenuOpen(!isEquipMenuOpen)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                      isEquipMenuOpen || isActiveTabInThisParent
                        ? "bg-white/10 text-white shadow-inner"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg bg-white/5 border border-white/5 ${
                        isEquipMenuOpen ? "text-blue-400" : ""
                      }`}
                    >
                      <HardDrive size={14} />
                    </div>
                    <span className="text-[12px] font-bold flex-1 text-left tracking-tight">
                      {nav.label}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-300 opacity-50 ${
                        isEquipMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isEquipMenuOpen && (
                    <div className="pl-10 pr-2 pb-2 space-y-1">
                      {nav.children.map((child) => (
                        <button
                          key={child.key}
                          onClick={() => navigateTo(child.key)}
                          className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all text-left ${
                            activeTab === child.key
                              ? "text-white font-bold"
                              : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                              activeTab === child.key
                                ? `${child.color.replace(
                                    "text-",
                                    "bg-"
                                  )} shadow-[0_0_8px_currentColor]`
                                : "bg-slate-700"
                            }`}
                          />
                          <span className="text-[11px]">{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={nav.key}
                onClick={() => navigateTo(nav.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                  isActive
                    ? "bg-blue-500/10 text-blue-400 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)] border border-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      : "bg-white/5"
                  }`}
                >
                  <nav.icon size={14} />
                </div>
                <span className="text-[12px] font-bold flex-1 text-left tracking-tight">
                  {nav.label}
                </span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,1)] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Секция спец-кнопок */}
        <div className="p-2 pt-0 mt-2 space-y-2 border-t border-white/5 bg-black/10">
          <div className="pt-2">
            <button
              onClick={() => navigateTo("andryuha")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-500 group ${
                activeTab === "andryuha"
                  ? "bg-yellow-500/20 text-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.2)]"
                  : "text-yellow-600/80 hover:bg-yellow-500/10 hover:text-yellow-400"
              }`}
              style={{
                border:
                  activeTab === "andryuha"
                    ? "1px solid rgba(250,204,21,0.4)"
                    : "1px solid rgba(250,204,21,0.1)",
              }}
            >
              <div
                className={`p-1.5 rounded-lg transition-all ${
                  activeTab === "andryuha"
                    ? "bg-yellow-500/30 shadow-[0_0_15px_rgba(250,204,21,0.4)]"
                    : "bg-white/5"
                }`}
              >
                <Bot
                  size={14}
                  className={activeTab === "andryuha" ? "animate-bounce" : ""}
                />
              </div>
              <span className="text-[11px] font-black uppercase tracking-tight flex-1 text-left">
                ИИ Тяночка мяу
              </span>
              <Zap
                size={12}
                className={
                  activeTab === "andryuha"
                    ? "fill-yellow-400 animate-pulse"
                    : ""
                }
              />
            </button>
          </div>

          <button
            onClick={() => navigateTo("invoices")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
              activeTab === "invoices"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
            }`}
          >
            <div
              className={`p-1.5 rounded-lg transition-all ${
                activeTab === "invoices" ? "bg-emerald-500/20" : "bg-white/5"
              }`}
            >
              <FileText size={14} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest flex-1 text-left">
              Работа со счетами
            </span>
            {activeTab === "invoices" && (
              <ChevronRight
                size={12}
                className="text-emerald-500 animate-horizontal-bounce"
              />
            )}
          </button>
        </div>
      </div>

      {/* Warning */}
      <div
        className="rounded-2xl p-4 flex items-start gap-3 transition-all hover:scale-[1.02]"
        style={{
          background:
            "linear-gradient(to right, rgba(239,68,68,0.1), rgba(239,68,68,0.05))",
          border: "1px solid rgba(239,68,68,0.25)",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
        }}
      >
        <div className="p-2 bg-red-500/20 rounded-lg">
          <ShieldAlert size={16} className="text-red-500 shadow-sm" />
        </div>
        <div>
          <p className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">
            ВНИМАНИЕ
          </p>
          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
            При изменении пароля уведоми{" "}
            <span className="text-slate-200">Андрея</span>, иначе будет больно.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
