import React from "react";
import { Search, X, Terminal, LayoutGrid, Clock } from "lucide-react";

const Header = ({
  currentTime,
  searchQuery,
  setSearchQuery,
  isSearching,
  setIsMobileMenuOpen,
  isMobileMenuOpen,
}) => {
  return (
    <header
      className="flex items-center justify-between gap-3 mb-5 pb-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-3">
        {/* Бургер для мобилы */}
        <button
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <LayoutGrid size={16} />
        </button>

        {/* Логотип и статус */}
        <div className="flex items-center gap-4 group cursor-default">
          {/* Иконка с неоновым эффектом */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110"
            style={{
              background:
                "linear-gradient(135deg, rgba(37, 40, 44, 0.9), rgba(20, 21, 23, 0.9))",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              boxShadow:
                "0 0 15px rgba(59, 130, 246, 0.15), inset 0 0 10px rgba(59, 130, 246, 0.05)",
            }}
          >
            <div className="relative">
              <Terminal size={20} className="text-blue-400 relative z-10" />
              <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 group-hover:opacity-50 transition-opacity"></div>
            </div>
          </div>

          {/* Текстовая часть */}
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter leading-none flex items-center gap-1">
              <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                WARPOINT
              </span>
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                PERM
              </span>
            </h1>

            <div className="flex items-center gap-2 mt-1.5">
              <div className="relative flex h-2 w-2">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></div>
              </div>

              <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">
                Database <span className="text-slate-600 ml-1">v3.0</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Правая часть: Часы и Поиск */}
      <div className="flex items-center gap-4 flex-1 justify-end max-w-xl">
        {/* Часы (скрыты на совсем мелких экранах) */}
        {currentTime && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
            <Clock size={12} className="text-slate-500" />
            <span className="text-[11px] font-mono text-slate-400 tabular-nums">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {/* Поле поиска */}
        <div className="relative flex-1 max-w-xs group">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-slate-400 transition-colors"
          />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-9 pr-8 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 rounded-xl"
            style={{
              background: "rgba(37,40,44,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: "13px",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
