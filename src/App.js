import "./styles.css";
import InvoiceGenerator from "./InvoiceGenerator";
import FilesView from "./components/FilesView";
import { Battery } from "lucide-react";
import { useSearch } from "./hooks/useSearch";
import ChecklistView from "./components/ChecklistView";
import LinksView from "./components/LinksView";
import AccessView from "./components/AccessView";
import TabHeader from "./components/TabHeader";
import Header from "./components/Header";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  X,
  Database,
  Terminal,
  LayoutGrid,
  Key,
  CheckCircle2,
  Circle,
  Link2,
  ExternalLink,
  ChevronDown,
  Bot,
} from "lucide-react";

import { BITRIX_WEBHOOK_URL } from "./constants/kanban";
import {
  allContent,
  navItems as buildNavItems,
  bitrixUsers,
} from "./data/content";
import { fetchNewLeadsCount } from "./api/bitrix";

import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import ChatView from "./views/ChatView";
import {
  TerminalItem,
  FolderItem,
  SearchItem,
} from "./components/ContentItems";

const App = () => {
  const [audio] = useState(new Audio("/alert.mp3"));
  const [prevCount, setPrevCount] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [openSection, setOpenSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [businessPass, setBusinessPass] = useState("");
  const [isBusinessUnlocked, setIsBusinessUnlocked] = useState(false);
  const [passError, setPassError] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState(null);
  const [isBitrixLoading, setIsBitrixLoading] = useState(false);
  const [isEquipMenuOpen, setIsEquipMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ─── ЛОГИКА ЧЕК-ЛИСТОВ (Задачи) ──────────────────────────────────────────────
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("wp_perm_tasks");
      const lastReset = localStorage.getItem("wp_perm_last_reset");
      const today = new Date().toDateString();
      if (lastReset !== today) {
        localStorage.setItem("wp_perm_last_reset", today);
        localStorage.removeItem("wp_perm_tasks");
        localStorage.removeItem("wp_perm_comments");
        return {};
      }
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // ─── ЛОГИКА КОММЕНТАРИЕВ ─────────────────────────────────────────────
  const [taskComments, setTaskComments] = useState(() => {
    try {
      const saved = localStorage.getItem("wp_perm_comments");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("wp_perm_tasks", JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem("wp_perm_comments", JSON.stringify(taskComments));
  }, [taskComments]);

  const updateComment = (taskId, text) => {
    setTaskComments((prev) => ({ ...prev, [taskId]: text }));
  };

  // ─── Bitrix polling ─────────────────────────────────────────────────────────
  const fetchBitrixLeads = useCallback(
    async (retryCount = 0) => {
      setIsBitrixLoading(true);
      try {
        const currentTotal = await fetchNewLeadsCount();
        if (prevCount !== null && currentTotal > prevCount) {
          audio.play().catch(() => {});
        }
        setNewLeadsCount(currentTotal);
        setPrevCount(currentTotal);
      } catch {
        if (retryCount < 3)
          setTimeout(
            () => fetchBitrixLeads(retryCount + 1),
            Math.pow(2, retryCount) * 1000
          );
      } finally {
        setIsBitrixLoading(false);
      }
    },
    [prevCount, audio]
  );

  useEffect(() => {
    fetchBitrixLeads();
    const interval = setInterval(fetchBitrixLeads, 10000);
    return () => clearInterval(interval);
  }, [prevCount]);

  // ─── Daily task reset (без ежесекундного обновления времени) ──────────────────
  useEffect(() => {
    const checkReset = () => {
      const now = new Date();
      const lastReset = localStorage.getItem("wp_perm_last_reset");
      const today = now.toDateString();
      if (lastReset && lastReset !== today) {
        setCompletedTasks({});
        setTaskComments({});
        localStorage.setItem("wp_perm_last_reset", today);
        localStorage.removeItem("wp_perm_tasks");
        localStorage.removeItem("wp_perm_comments");
      }
    };

    checkReset();
    const timer = setInterval(checkReset, 60000); // Проверяем раз в минуту, этого за глаза
    return () => clearInterval(timer);
  }, []);

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const toggleSection = (index) =>
    setOpenSection(openSection === index ? null : index);

  const toggleTask = (day, taskIndex) => {
    const key = `${day}-${taskIndex}`;
    setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navigateTo = (key) => {
    setActiveTab(key);
    setOpenSection(null);
    if (key !== "business") setIsBusinessUnlocked(false);
    setIsMobileMenuOpen(false);
  };

  const handlePassSubmit = (e) => {
    e.preventDefault();
    if (businessPass === "0415") {
      setIsBusinessUnlocked(true);
      setPassError(false);
    } else {
      setPassError(true);
      setTimeout(() => setPassError(false), 2000);
    }
  };

  const { searchResults, isSearching } = useSearch(searchQuery, allContent);
  const navItems = buildNavItems(allContent);

  const SidebarContent = () => (
    <Sidebar
      navItems={navItems}
      activeTab={activeTab}
      newLeadsCount={newLeadsCount}
      isBitrixLoading={isBitrixLoading}
      fetchBitrixLeads={fetchBitrixLeads}
      isEquipMenuOpen={isEquipMenuOpen}
      setIsEquipMenuOpen={setIsEquipMenuOpen}
      navigateTo={navigateTo}
    />
  );

  return (
    <div
      className="min-h-screen text-slate-300 selection:bg-slate-500/40 relative overflow-x-hidden"
      style={{
        background: "#13151a",
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(100,116,139,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(100,116,139,0.06) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        ></div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%,rgba(59,130,246,0.05) 0%,transparent 60%)",
          }}
        ></div>
        <div className="absolute inset-x-0 h-0.5 bg-slate-400/10 shadow-[0_0_20px_rgba(148,163,184,0.2)] animate-scan-line"></div>
      </div>

      <div className="max-w-[1800px] min-h-[calc(100vh-120px)] mx-auto px-3 py-4 md:px-5 md:py-6 relative z-10 flex flex-col">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <div
              className="absolute left-0 top-0 bottom-0 w-72 p-4 space-y-3 overflow-y-auto custom-scrollbar"
              style={{
                background: "#13151a",
                borderRight: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Меню
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-500 hover:text-white p-1"
                >
                  <X size={16} />
                </button>
              </div>
              <SidebarContent />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 items-start">
          {!isSearching && (
            <aside className="hidden lg:flex flex-col space-y-3 sticky top-4">
              <SidebarContent />
            </aside>
          )}

          <main
            className={`relative transition-all duration-500 ${
              isSearching ? "lg:col-span-2" : ""
            }`}
          >
            <div
              className="rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[500px]"
              style={{
                background: "rgba(22,24,29,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
              }}
            >
              <TabHeader
                isSearching={isSearching}
                activeTab={activeTab}
                searchQuery={searchQuery}
                allContent={allContent}
              />

              <div className="p-5 overflow-y-auto max-h-[78vh] custom-scrollbar">
                {isSearching ? (
                  <div className="space-y-2">
                    {searchResults?.length > 0 ? (
                      searchResults.map((item, index) => (
                        <SearchItem
                          key={index}
                          item={item}
                          isOpen={openSection === `search-${index}`}
                          toggle={() => toggleSection(`search-${index}`)}
                        />
                      ))
                    ) : (
                      <div className="py-16 text-center opacity-30">
                        <Database size={36} className="mx-auto mb-3" />
                        <p className="text-xs font-bold uppercase tracking-widest">
                          Ничего не найдено
                        </p>
                      </div>
                    )}
                  </div>
                ) : activeTab === "dashboard" ? (
                  <Dashboard />
                ) : activeTab === "batteries" ? (
                  <BatteryMonitor />
                ) : activeTab === "invoices" ? (
                  <InvoiceGenerator />
                ) : activeTab === "andryuha" ? (
                  <ChatView />
                ) : activeTab === "business" && !isBusinessUnlocked ? (
                  <div className="flex items-center justify-center py-16">
                    <div
                      className="w-full max-w-xs p-6 rounded-2xl text-center"
                      style={{
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <Key size={28} className="text-indigo-400 mx-auto mb-4" />
                      <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-5">
                        Доступ управляющего
                      </h3>
                      <form onSubmit={handlePassSubmit} className="space-y-3">
                        <input
                          type="password"
                          placeholder="•••••"
                          value={businessPass}
                          onChange={(e) => setBusinessPass(e.target.value)}
                          className={`w-full py-3 rounded-xl text-center text-2xl tracking-[0.5em] outline-none transition-all text-white ${
                            passError ? "animate-shake" : ""
                          }`}
                          style={{
                            background: "#0d0f10",
                            border: passError
                              ? "1px solid #ef4444"
                              : "1px solid rgba(255,255,255,0.08)",
                          }}
                          autoFocus
                        />
                        <button
                          className="w-full py-3 rounded-xl text-sm font-bold text-white uppercase tracking-widest transition-all hover:brightness-110"
                          style={{
                            background:
                              "linear-gradient(135deg,#4f46e5,#6366f1)",
                          }}
                        >
                          Войти
                        </button>
                      </form>
                    </div>
                  </div>
                ) : activeTab === "checklists" ? (
                  <ChecklistView
                    days={allContent.checklists.data}
                    openSection={openSection}
                    toggleSection={toggleSection}
                    completedTasks={completedTasks}
                    toggleTask={toggleTask}
                    comments={taskComments}
                    updateComment={updateComment}
                  />
                ) : activeTab === "links" ? (
                  <LinksView links={allContent.links.data} />
                ) : activeTab === "files" ? (
  <FilesView folders={allContent.files.data} />
                ) : allContent[activeTab]?.isSubfolder ? (
                  <AccessView
                    activeTab={activeTab}
                    allContent={allContent}
                    bitrixUsers={bitrixUsers}
                    openSection={openSection}
                    toggleSection={toggleSection}
                  />
                ) : (
                  <div className="space-y-2">
                    {allContent[activeTab]?.data.map((item, idx) => (
                      <TerminalItem
                        key={idx}
                        item={item}
                        isOpen={openSection === idx}
                        toggle={() => toggleSection(idx)}
                        colorClass={allContent[activeTab].color}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes scan-line { 0% { top: 0%; opacity: 0; } 50% { opacity: 0.4; } 100% { top: 100%; opacity: 0; } }
        .animate-scan-line { animation: scan-line 8s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.15); border-radius: 10px; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
        .bg-white\\/8 { background-color: rgba(255,255,255,0.08); }
        * { -webkit-tap-highlight-color: transparent; }
      `,
        }}
      />
    </div>
  );
};

export default App;
