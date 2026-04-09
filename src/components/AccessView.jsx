import React, { useState } from "react";
import { Database, ChevronDown, ShieldCheck, Copy, Check } from "lucide-react";
const parseCredentials = (val) => {
  // Если строка содержит явные метки "Логин:" и "Пароль:"
  if (val.includes("Логин:") && val.includes("Пароль:")) {
    const login = val.split("Пароль:")[0].replace("Логин:", "").trim();
    const pass = val.split("Пароль:")[1].trim();
    return { login, pass };
  }
  // Если это просто почта и пароль через пробел
  const parts = val.trim().split(/\s+/);
  if (parts.length >= 2) {
    return { login: parts[0], pass: parts[1] };
  }
  return { login: val, pass: null };
};

// Универсальный компонент для кликабельного поля
const CopyField = ({ label, value, colorClass, activeBg }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation(); // Чтобы не закрывалась папка при клике
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      onClick={handleCopy}
      className={`group flex items-center justify-between p-2 rounded-lg bg-white/5 border border-transparent transition-all cursor-pointer active:scale-[0.98] ${activeBg}`}
    >
      <div className="flex flex-col min-w-0">
        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">
          {label}
        </span>
        <span
          className={`text-[12px] font-mono font-medium truncate ${colorClass}`}
        >
          {value}
        </span>
      </div>
      <div className="shrink-0 ml-2">
        {copied ? (
          <Check size={14} className="text-green-400" />
        ) : (
          <Copy
            size={14}
            className="text-slate-600 group-hover:text-slate-400 transition-colors"
          />
        )}
      </div>
    </div>
  );
};

const FolderContent = ({ items }) => {
  if (!items || items.length === 0)
    return (
      <div className="p-3 text-xs text-slate-500 italic text-center">
        Пусто, бро
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-3 pt-2">
      {items.map((item, idx) => {
        const creds = parseCredentials(item.val);
        return (
          <div
            key={idx}
            className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-3"
          >
            <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest border-b border-white/5 pb-1.5">
              {item.label}
            </div>
            <div className="grid grid-cols-1 gap-2">
              <CopyField
                label="Логин / Данные"
                value={creds.login}
                colorClass="text-sky-400"
                activeBg="hover:border-sky-500/30 hover:bg-sky-500/5"
              />
              {creds.pass && (
                <CopyField
                  label="Пароль"
                  value={creds.pass}
                  colorClass="text-yellow-500"
                  activeBg="hover:border-yellow-500/30 hover:bg-yellow-500/5"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FolderItem = ({
  folderData,
  isOpen,
  toggle,
  accentColor,
  categoryIcon: CategoryIcon,
}) => {
  const folderName = folderData.folder || "Без названия";
  const items = folderData.items || [];
  const Icon = folderData.icon || CategoryIcon || ShieldCheck;

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all mb-2 border ${
        isOpen ? "bg-white/[0.04]" : "bg-white/[0.01]"
      }`}
      style={{
        borderColor: isOpen ? `${accentColor}66` : "rgba(255,255,255,0.05)",
      }}
    >
      <button
        onClick={toggle}
        className="w-full px-4 py-3 flex items-center justify-between group text-left"
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
            <Icon
              size={16}
              style={{ color: isOpen ? accentColor : "#475569" }}
            />
          </div>
          <div>
            <div
              className={`text-sm font-bold ${
                isOpen ? "text-white" : "text-slate-400"
              }`}
            >
              {folderName}
            </div>
            <div className="text-[9px] text-slate-600 uppercase font-bold">
              Записей: {items.length}
            </div>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform ${
            isOpen ? "rotate-180" : "text-slate-600"
          }`}
          style={{ color: isOpen ? accentColor : "" }}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-1 duration-200">
          <FolderContent items={items} />
        </div>
      )}
    </div>
  );
};

const UserCard = ({ user }) => (
  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-1">
      {user.name}
    </p>
    <div className="grid grid-cols-1 gap-2">
      <CopyField
        label="Логин"
        value={user.login}
        colorClass="text-sky-400"
        activeBg="hover:border-sky-500/30 hover:bg-sky-500/5"
      />
      <CopyField
        label="Пароль"
        value={user.pass}
        colorClass="text-yellow-500"
        activeBg="hover:border-yellow-500/30 hover:bg-yellow-500/5"
      />
    </div>
  </div>
);

const AccessView = ({
  activeTab,
  allContent,
  bitrixUsers,
  openSection,
  toggleSection,
}) => {
  const category = allContent[activeTab];
  if (!category) return null;

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.05]">
        <button
          onClick={() => toggleSection("bitrix")}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Database size={16} className="text-blue-400" />
            </div>
            <span className="text-sm font-bold text-slate-200 uppercase">
              Сотрудники Bitrix
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform text-slate-500 ${
              openSection === "bitrix" ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSection === "bitrix" && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-white/5 bg-black/20">
            {bitrixUsers?.map((u, i) => (
              <UserCard key={i} user={u} />
            ))}
          </div>
        )}
      </div>

      {category.data?.map((folderData, fidx) => (
        <FolderItem
          key={fidx}
          folderData={folderData}
          isOpen={openSection === `folder-${fidx}`}
          toggle={() => toggleSection(`folder-${fidx}`)}
          accentColor={category.color?.replace("text-", "#") || "#eab308"}
        />
      ))}
    </div>
  );
};

export default AccessView;
