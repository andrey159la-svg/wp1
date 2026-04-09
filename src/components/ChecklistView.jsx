import React from "react";
import { ChevronDown, CheckCircle2, Circle } from "lucide-react";

const ChecklistView = ({
  days,
  openSection,
  toggleSection,
  completedTasks,
  toggleTask,
  comments = {}, // Принимаем комменты
  updateComment, // Принимаем функцию обновления
}) => {
  return (
    <div className="space-y-2">
      {days.map((item, idx) => (
        <div
          key={idx}
          className="rounded-xl overflow-hidden transition-all"
          style={{
            background:
              openSection === idx
                ? "rgba(255,255,255,0.04)"
                : "rgba(0,0,0,0.2)",
            border:
              openSection === idx
                ? "1px solid rgba(255,255,255,0.12)"
                : "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <button
            onClick={() => toggleSection(idx)}
            className="w-full px-4 py-3 flex items-center justify-between group"
          >
            <span
              className={`text-sm font-semibold ${
                openSection === idx
                  ? "text-teal-400"
                  : "text-slate-400 group-hover:text-slate-200"
              }`}
            >
              {item.day}
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform ${
                openSection === idx
                  ? "rotate-180 text-teal-400"
                  : "text-slate-600"
              }`}
            />
          </button>

          {openSection === idx && (
            <div className="px-4 pb-4 pt-1 space-y-1.5">
              {item.tasks.map((task, tIdx) => {
                const taskId = `${item.day}-${tIdx}`;
                const isCompleted = completedTasks[taskId];
                return (
                  <div key={tIdx} className="flex flex-col gap-1">
                    <div
                      onClick={() => toggleTask(item.day, tIdx)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isCompleted ? "opacity-40" : "hover:border-white/10"
                      }`}
                      style={
                        isCompleted
                          ? {
                              background: "rgba(52,211,153,0.05)",
                              border: "1px solid rgba(52,211,153,0.2)",
                            }
                          : {
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.05)",
                            }
                      }
                    >
                      {isCompleted ? (
                        <CheckCircle2
                          size={14}
                          className="text-teal-400 mt-0.5 shrink-0"
                        />
                      ) : (
                        <Circle
                          size={14}
                          className="text-slate-600 mt-0.5 shrink-0"
                        />
                      )}
                      <span
                        className={`text-sm leading-relaxed ${
                          isCompleted
                            ? "line-through text-slate-500"
                            : "text-slate-300"
                        }`}
                      >
                        {task}
                      </span>
                    </div>

                    {/* ИНПУТ ДЛЯ КОММЕНТАРИЯ */}
                    <input
                      type="text"
                      placeholder="Добавить заметку..."
                      value={comments[taskId] || ""}
                      onChange={(e) => updateComment(taskId, e.target.value)}
                      // Важно: останавливаем всплытие клика, чтобы не срабатывал toggleTask
                      onClick={(e) => e.stopPropagation()}
                      className="ml-8 mr-2 bg-transparent border-b border-white/5 text-[11px] text-teal-200/40 placeholder:text-slate-700 outline-none focus:border-teal-500/30 transition-colors py-1"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChecklistView;
