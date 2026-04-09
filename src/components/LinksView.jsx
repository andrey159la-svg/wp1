import React from "react";
import { Link2, ExternalLink } from "lucide-react";

const LinkCard = ({ link }) => {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      // p-2 и gap-2.5 делают блок узким по вертикали
      className="flex items-center gap-2.5 p-2 rounded-xl transition-all duration-200 group hover:scale-[1.01] border"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      {/* Компактная иконка 16px */}
      <div
        className="p-2 rounded-lg shrink-0 transition-colors duration-200 group-hover:bg-sky-500/20"
        style={{
          background: "rgba(96,165,250,0.07)",
          color: "#60a5fa",
          border: "1px solid rgba(96,165,250,0.12)",
        }}
      >
        {link.icon ? <link.icon size={16} /> : <Link2 size={16} />}
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between gap-2">
          {/* Заголовок 12px — четко и без лишнего места */}
          <span className="text-[12px] font-bold text-white truncate leading-none group-hover:text-sky-400 transition-colors">
            {link.title}
          </span>
          <ExternalLink
            size={10}
            className="text-slate-600 group-hover:text-sky-400 shrink-0 opacity-50 group-hover:opacity-100"
          />
        </div>
        {/* Описание 10px — приглушенное, чтобы не отвлекало */}
        <p className="text-[10px] text-slate-500 mt-0.5 truncate leading-tight font-medium">
          {link.desc || "Перейти"}
        </p>
      </div>
    </a>
  );
};

const LinksView = ({ links }) => {
  return (
    // Добавил 2xl:grid-cols-4 — на больших экранах будет 4 в ряд, станет еще компактнее
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
      {links.map((link, idx) => (
        <LinkCard key={idx} link={link} />
      ))}
    </div>
  );
};

export default LinksView;
