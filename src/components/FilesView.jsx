import React, { useState } from "react";
import { Download, FolderOpen, Folder, FileText, Image, Film, File, ChevronDown } from "lucide-react";

// Определяем иконку по расширению файла
const getFileIcon = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return Image;
  if (["mp4", "mov", "avi", "mkv"].includes(ext)) return Film;
  if (["pdf", "doc", "docx", "txt"].includes(ext)) return FileText;
  return File;
};

// Преобразует обычную ссылку Яндекс.Диска в ссылку для скачивания
// Вставляй ссылку вида: https://disk.yandex.ru/d/XXXXXX
// Она автоматически откроется на скачивание
const FilesView = ({ folders }) => {
  const [openFolder, setOpenFolder] = useState(null);

  return (
    <div className="space-y-2">
      {folders.map((folder, idx) => {
        const isOpen = openFolder === idx;
        const FolderIcon = isOpen ? FolderOpen : Folder;

        return (
          <div
            key={idx}
            className="rounded-xl overflow-hidden transition-all"
            style={{
              background: isOpen ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.2)",
              border: isOpen
                ? "1px solid rgba(255,255,255,0.12)"
                : "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Заголовок папки */}
            <button
              onClick={() => setOpenFolder(isOpen ? null : idx)}
              className="w-full px-4 py-3.5 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-1.5 rounded-lg transition-all"
                  style={{
                    background: isOpen
                      ? "rgba(251,191,36,0.15)"
                      : "rgba(255,255,255,0.05)",
                    border: isOpen
                      ? "1px solid rgba(251,191,36,0.3)"
                      : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <FolderIcon
                    size={14}
                    className={isOpen ? "text-yellow-400" : "text-slate-500 group-hover:text-slate-300"}
                  />
                </div>
                <div className="text-left">
                  <p
                    className={`text-sm font-semibold transition-colors ${
                      isOpen
                        ? "text-yellow-400"
                        : "text-slate-300 group-hover:text-white"
                    }`}
                  >
                    {folder.name}
                  </p>
                  {folder.desc && (
                    <p className="text-[10px] text-slate-600 mt-0.5">{folder.desc}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  {folder.files.length} файл{folder.files.length === 1 ? "" : folder.files.length < 5 ? "а" : "ов"}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    isOpen ? "rotate-180 text-yellow-400" : "text-slate-600"
                  }`}
                />
              </div>
            </button>

            {/* Список файлов */}
            {isOpen && (
              <div className="px-4 pb-4 space-y-1.5">
                <div
                  className="h-px w-full mb-3"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                {folder.files.length === 0 ? (
                  <div className="py-6 text-center opacity-30">
                    <Folder size={24} className="mx-auto mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest">
                      Папка пуста
                    </p>
                  </div>
                ) : (
                  folder.files.map((file, fIdx) => {
                    const FileIcon = getFileIcon(file.name);
                    return (
                      <a
                        key={fIdx}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg group transition-all"
                        style={{
                          background: "rgba(0,0,0,0.25)",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(251,191,36,0.07)";
                          e.currentTarget.style.border = "1px solid rgba(251,191,36,0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(0,0,0,0.25)";
                          e.currentTarget.style.border = "1px solid rgba(255,255,255,0.05)";
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileIcon size={13} className="text-slate-500 flex-shrink-0 group-hover:text-yellow-400 transition-colors" />
                          <div className="min-w-0">
                            <p className="text-sm text-slate-300 group-hover:text-white transition-colors truncate">
                              {file.name}
                            </p>
                            {file.desc && (
                              <p className="text-[10px] text-slate-600 truncate">{file.desc}</p>
                            )}
                          </div>
                        </div>
                        <div
                          className="flex-shrink-0 ml-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          style={{
                            background: "rgba(251,191,36,0.15)",
                            border: "1px solid rgba(251,191,36,0.3)",
                          }}
                        >
                          <Download size={11} className="text-yellow-400" />
                        </div>
                      </a>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FilesView;
