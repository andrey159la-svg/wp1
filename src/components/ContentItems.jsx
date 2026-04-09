import React from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

// ─── TerminalItem ─────────────────────────────────────────────────────────────
export const TerminalItem = ({ item, isOpen, toggle, colorClass }) => (
  <div
    className="rounded-xl transition-all duration-300 overflow-hidden"
    style={{
      background: isOpen ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.2)",
      border: isOpen ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.05)",
    }}
  >
    <button onClick={toggle} className="w-full px-4 py-3.5 flex items-center justify-between text-left group">
      <span className={`text-sm font-semibold ${isOpen ? colorClass : "text-slate-400 group-hover:text-slate-200"}`}>
        {item.title}
      </span>
      {item.url ? (
        <ExternalLink size={13} className={`${colorClass} opacity-80`} />
      ) : (
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180 " + colorClass : "text-slate-600"}`} />
      )}
    </button>
    {isOpen && !item.url && (
      <div className="px-4 pb-4 pt-1">
        <div className="p-3.5 rounded-xl text-sm text-slate-300 leading-relaxed whitespace-pre-wrap" style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.05)", borderLeft: "2px solid rgba(148,163,184,0.2)", fontFamily: "'Inter', sans-serif" }}>
          {item.content}
        </div>
      </div>
    )}
    {item.url && isOpen && (
      <div className="px-4 pb-4">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold hover:brightness-110 transition-all ${colorClass}`} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          Открыть ссылку <ExternalLink size={12} />
        </a>
      </div>
    )}
  </div>
);

// ─── FolderItem ───────────────────────────────────────────────────────────────
export const FolderItem = ({ folder, isOpen, toggle, accentColor }) => (
  <div className="rounded-xl transition-all overflow-hidden" style={{ background: isOpen ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.2)", border: isOpen ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.05)" }}>
    <button onClick={toggle} className="w-full px-4 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className={`w-2 h-2 rounded-full ${isOpen ? accentColor.replace("text-", "bg-") : "bg-slate-700"}`}></div>
        <span className={`text-sm font-semibold ${isOpen ? accentColor : "text-slate-400"}`}>{folder.folder}</span>
      </div>
      <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180 " + accentColor : "text-slate-600"}`} />
    </button>
    {isOpen && (
      <div className="p-4 space-y-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)" }}>
        {folder.items.map((it, i) => (
          <div key={i} className="p-3.5 rounded-xl" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <p className={`text-[10px] font-bold uppercase mb-2 tracking-wider ${accentColor} opacity-70`}>{it.label}</p>
            <p className="text-sm font-mono text-slate-300 whitespace-pre-wrap select-all break-all leading-relaxed">{it.val}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ─── SearchItem ───────────────────────────────────────────────────────────────
export const SearchItem = ({ item, isOpen, toggle }) => (
  <div className="rounded-xl transition-all overflow-hidden" style={{ background: isOpen ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.2)", border: isOpen ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.05)" }}>
    <button onClick={toggle} className="w-full px-4 py-3.5 flex items-center justify-between text-left">
      <div>
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 opacity-60">{item.categoryLabel}</p>
        <p className={`text-sm font-semibold ${isOpen ? "text-white" : "text-slate-300"}`}>{item.title}</p>
      </div>
      <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180 text-slate-300" : "text-slate-600"}`} />
    </button>
    {isOpen && (
      <div className="px-4 pb-4 pt-1">
        <div className="p-3.5 rounded-xl text-sm text-slate-200 whitespace-pre-wrap break-all leading-relaxed" style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.05)" }}>
          {item.content || (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sky-400 underline font-semibold text-sm">
              Открыть ссылку →
            </a>
          )}
        </div>
      </div>
    )}
  </div>
);
