import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  BarChart2,
  RefreshCw,
  FileBarChart,
  TrendingUp,
  CalendarRange,
  ClipboardCheck,
  X,
  Activity,
  CheckCircle2,
  DollarSign,
  Receipt,
  Percent,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { KANBAN_STAGES } from "../constants/kanban";
import { fetchDealsForStage, fetchAllDealsInRange } from "../api/bitrix";
import { getPermMidnight } from "../utils/time";

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const fmt = (n) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)} млн ₽`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(0)} тыс ₽`
    : `${n.toFixed(0)} ₽`;

// ─── Финансовый блок ────────────────────────────────────────────────────────
// ─── Финансовый блок ────────────────────────────────────────────────────────
const FinanceBlock = ({ loading: globalLoading }) => {
  const [localDeals, setLocalDeals] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  // Фикс часового пояса: переводит дату в строку YYYY-MM-DD без прыжков в прошлое
  const getLocalDateString = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split("T")[0];
  };

  // По дефолту: с 1-го числа текущего месяца (01.04.2026) по сегодня
  const [dates, setDates] = useState({
    from: getLocalDateString(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    ),
    to: getLocalDateString(new Date()),
  });

  // Функция для загрузки данных
  const loadFinanceData = useCallback(async () => {
    setLocalLoading(true);
    try {
      const data = await fetchAllDealsInRange(
        new Date(dates.from).toISOString(),
        new Date(dates.to + "T23:59:59").toISOString(),
        true
      );
      setLocalDeals(data);
    } catch (e) {
      console.error("Finance load error", e);
    } finally {
      setLocalLoading(false);
    }
  }, [dates]);

  useEffect(() => {
    loadFinanceData();
  }, [loadFinanceData]);

  // Считаем статы
  const stats = useMemo(() => {
    if (!localDeals || localDeals.length === 0)
      return { revenue: 0, avgCheck: 0, wonCount: 0, paidCount: 0 };

    const wonDeals = localDeals.filter((d) => d.STAGE_ID === "C37:WON");
    const paidDeals = localDeals.filter((d) => d.STAGE_ID === "C37:UC_EABX1N");

    const sumWon = wonDeals.reduce(
      (acc, d) => acc + parseFloat(d.OPPORTUNITY || 0),
      0
    );
    const sumPaid = paidDeals.reduce(
      (acc, d) => acc + parseFloat(d.OPPORTUNITY || 0),
      0
    );

    return {
      revenue: sumWon + sumPaid,
      avgCheck: wonDeals.length > 0 ? sumWon / wonDeals.length : 0,
      wonCount: wonDeals.length,
      paidCount: paidDeals.length,
    };
  }, [localDeals]);

  const isDefaultRange = useMemo(() => {
    const monthStart = getLocalDateString(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );
    return dates.from === monthStart;
  }, [dates]);

  const cards = [
    {
      label: "Выручка  (успешные + предоплаты)",
      value: fmt(stats.revenue),
      icon: DollarSign,
      color: "#4ade80",
      bg: "rgba(74,222,128,0.12)",
      shadow: "rgba(74,222,128,0.3)",
    },
    {
      label: "Средний чек (успешные)",
      value: fmt(stats.avgCheck),
      icon: Receipt,
      color: "#60a5fa",
      bg: "rgba(96,165,250,0.12)",
      shadow: "rgba(96,165,250,0.3)",
    },
    {
      label: "Внесли предоплату",
      value: stats.paidCount,
      icon: Percent,
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.12)",
      shadow: "rgba(251,191,36,0.3)",
    },
    {
      label: "Успешных сделок",
      value: stats.wonCount,
      icon: CheckCircle2,
      color: "#34d399",
      bg: "rgba(52,211,153,0.12)",
      shadow: "rgba(52,211,153,0.3)",
    },
  ];

  const isLoading = localLoading || globalLoading;

  return (
    <div
      className="rounded-2xl p-5 border border-white/5 shadow-inner"
      style={{ background: "rgba(15,17,22,0.6)" }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <DollarSign size={14} className="text-emerald-400" />
          Финансы · {isDefaultRange ? "текущий месяц" : "диапазон"}
        </h3>

        <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/5 shadow-2xl backdrop-blur-sm">
          <CalendarRange size={14} className="text-blue-400 ml-2" />
          <input
            type="date"
            value={dates.from}
            onChange={(e) =>
              setDates((prev) => ({ ...prev, from: e.target.value }))
            }
            className="bg-transparent text-[10px] text-white outline-none"
          />
          <span className="text-slate-600 text-[10px]">—</span>
          <input
            type="date"
            value={dates.to}
            onChange={(e) =>
              setDates((prev) => ({ ...prev, to: e.target.value }))
            }
            className="bg-transparent text-[10px] text-white outline-none"
          />
          {localLoading && (
            <RefreshCw size={12} className="animate-spin text-blue-400 mx-2" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map(({ label, value, icon: Icon, color, bg, shadow }) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-xl p-4 flex flex-col gap-2 transition-all duration-300 hover:scale-[1.03] group"
            style={{
              // ВОТ ГДЕ МАГИЯ! ТРИ СЛОЯ СТИЛЕЙ:
              // 1. Градиент на фоне (от твоего цвета до почти черного)
              background: `linear-gradient(135deg, ${bg}, rgba(0,0,0,0.4))`,
              // 2. Светящаяся рамка сверху и слева
              borderTop: "1px solid rgba(255,255,255,0.15)",
              borderLeft: "1px solid rgba(255,255,255,0.1)",
              // 3. Внутренняя тень + тень наружу (как вверху)
              boxShadow: `0 10px 20px -5px rgba(0, 0, 0, 0.5), inset 0 0 15px ${shadow}, 0 0 20px rgba(0, 0, 0, 0.1)`,
            }}
          >
            <div className="flex items-center gap-2">
              <Icon size={14} style={{ color }} />
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                {label}
              </span>
            </div>
            <span className="text-2xl font-black text-white leading-none">
              {isLoading ? "..." : value}
            </span>
            {/* Это еще одна "секретная" фишка: скрытый индикатор цвета, который светится */}
            <div
              className="absolute top-0 right-0 w-1 h-full opacity-60 shadow-[0_0_10px_1px_currentColor]"
              style={{ background: color, color: color }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Основной компонент ──────────────────────────────────────────────────────
const Dashboard = () => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [reportModal, setReportModal] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [monthDeals, setMonthDeals] = useState([]);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const midnight = getPermMidnight();
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [stageResults, historyDeals, currentMonthDeals] = await Promise.all(
        [
          Promise.all(
            KANBAN_STAGES.map((s) =>
              fetchDealsForStage(
                s.id,
                midnight.toISOString(),
                now.toISOString()
              )
            )
          ),
          fetchAllDealsInRange(thirtyDaysAgo.toISOString(), now.toISOString()),
          fetchAllDealsInRange(
            firstDayOfMonth.toISOString(),
            now.toISOString(),
            true
          ),
        ]
      );

      const newCounts = {};
      KANBAN_STAGES.forEach((s, i) => {
        newCounts[s.id] = stageResults[i].length;
      });
      setCounts(newCounts);
      setMonthDeals(currentMonthDeals);

      const dailyMap = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dailyMap[
          d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
        ] = 0;
      }
      historyDeals.forEach((deal) => {
        const dateKey = new Date(deal.DATE_CREATE).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "short",
        });
        if (dailyMap[dateKey] !== undefined) dailyMap[dateKey]++;
      });

      setChartData(
        Object.entries(dailyMap).map(([name, value]) => ({ name, value }))
      );
      setLastUpdate(new Date());
    } catch (e) {
      console.error("Dashboard fetch error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    const iv = setInterval(fetchDashboard, 60000);
    return () => clearInterval(iv);
  }, [fetchDashboard]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const generateReport = async (type, fromDate, toDate) => {
    setReportLoading(true);
    setReportData(null);
    try {
      const now = new Date();
      let dateFrom, dateTo, title;

      if (type === "today") {
        dateFrom = getPermMidnight().toISOString();
        dateTo = now.toISOString();
        title = `Отчёт за сегодня (${now.toLocaleDateString("ru-RU")})`;
      } else if (type === "currentmonth") {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFrom = firstDay.toISOString();
        dateTo = now.toISOString();
        title = `Отчёт за ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
      } else if (type === "lastmonth") {
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
          23,
          59,
          59
        );
        dateFrom = firstDay.toISOString();
        dateTo = lastDay.toISOString();
        title = `Отчёт за ${
          MONTHS[firstDay.getMonth()]
        } ${firstDay.getFullYear()}`;
      } else {
        dateFrom = new Date(fromDate).toISOString();
        dateTo = new Date(toDate + "T23:59:59").toISOString();
        title = `Отчёт с ${fromDate} по ${toDate}`;
      }

      const allDeals = await fetchAllDealsInRange(dateFrom, dateTo, true);
      const stageCounts = {};
      const stageSums = {};
      KANBAN_STAGES.forEach((s) => {
        stageCounts[s.id] = 0;
        stageSums[s.id] = 0;
      });
      allDeals.forEach((deal) => {
        if (stageCounts[deal.STAGE_ID] !== undefined) {
          stageCounts[deal.STAGE_ID]++;
          stageSums[deal.STAGE_ID] += parseFloat(deal.OPPORTUNITY || 0);
        }
      });

      const totalRevenue =
        (stageSums["C37:WON"] || 0) + (stageSums["C37:UC_EABX1N"] || 0);
      const wonCount = stageCounts["C37:WON"] || 0;
      const avgCheck = wonCount > 0 ? stageSums["C37:WON"] / wonCount : 0;

      setReportData({
        title,
        stageCounts,
        stageSums,
        total: allDeals.length,
        totalRevenue,
        avgCheck,
        wonCount,
        generated: new Date(),
      });
    } catch (e) {
      console.error("Report error", e);
    } finally {
      setReportLoading(false);
    }
  };

  const totalToday = useMemo(
    () => Object.values(counts).reduce((a, b) => a + b, 0),
    [counts]
  );

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto relative">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl border border-emerald-400/20 font-bold text-sm">
            <CheckCircle2 size={18} />
            Данные успешно скопированы!
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div
              className="p-3 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))",
                borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: `0 10px 20px -5px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.1)`,
              }}
            >
              <Activity size={22} className="text-blue-400" />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-tighter">
              Центр аналитики bitrix
            </h2>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">
              {loading
                ? "Синхронизация..."
                : `Обновлено: ${lastUpdate?.toLocaleTimeString(
                    "ru-RU"
                  )} · Сделок сегодня: ${totalToday}`}
            </p>
          </div>
        </div>
        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-blue-500/20 text-slate-400 transition-all border border-white/5"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Kanban Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {KANBAN_STAGES.map((stage) => (
          <div
            key={stage.id}
            className="group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-[1.03]"
            style={{
              background: `linear-gradient(135deg, ${stage.bg}, rgba(0,0,0,0.4))`,
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span
              className="text-[10px] font-black uppercase tracking-widest opacity-80"
              style={{ color: stage.color }}
            >
              {stage.label}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-white">
                {loading ? "—" : counts[stage.id] ?? 0}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                шт
              </span>
            </div>
            <div
              className="absolute top-0 right-0 w-1 h-full opacity-60"
              style={{ background: stage.color }}
            />
          </div>
        ))}
      </div>

      {/* Финансы */}
      <FinanceBlock loading={loading} />

      {/* График */}
      <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
          <TrendingUp size={14} className="text-emerald-400" /> Кол-во заявок за
          30 дней
        </h3>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#64748b" }}
                minTickGap={20}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Кнопки отчетов */}
      <div className="flex flex-wrap gap-3">
        {[
          {
            type: "today",
            label: "Отчёт за сегодня",
            icon: FileBarChart,
            color: "from-blue-300 to-indigo-900",
          },
          {
            type: "currentmonth",
            label: "Отчёт за текущий месяц",
            icon: BarChart2,
            color: "from-emerald-300 to-teal-900",
          },
          {
            type: "lastmonth",
            label: "Отчёт за прошлый месяц",
            icon: TrendingUp,
            color: "from-violet-300 to-purple-900",
          },
          {
            type: "range",
            label: "Отчёт за период",
            icon: CalendarRange,
            color: "from-sky-300 to-cyan-900",
          },
        ].map(({ type, label, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => {
              setReportModal(type);
              setReportData(null);
              if (type !== "range") generateReport(type);
            }}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-white transition-all bg-gradient-to-br ${color}`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Модалка отчёта */}
      {reportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setReportModal(null)}
        >
          <div className="w-full max-w-lg bg-[#1a1d22] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase tracking-widest">
                Генерация отчёта
              </span>
              <button
                onClick={() => setReportModal(null)}
                className="p-1.5 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              {reportModal === "range" && !reportData && !reportLoading && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={rangeFrom}
                      onChange={(e) => setRangeFrom(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none"
                    />
                    <input
                      type="date"
                      value={rangeTo}
                      onChange={(e) => setRangeTo(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none"
                    />
                  </div>
                  <button
                    onClick={() => generateReport("range", rangeFrom, rangeTo)}
                    disabled={!rangeFrom || !rangeTo}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm"
                  >
                    Сформировать
                  </button>
                </div>
              )}
              {reportLoading && (
                <div className="py-12 flex flex-col items-center gap-4">
                  <RefreshCw size={32} className="animate-spin text-blue-500" />
                  <p className="text-sm text-slate-400">Опрашиваю Битрикс...</p>
                </div>
              )}
              {reportData && !reportLoading && (
                <div className="space-y-5">
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                    <h4 className="text-sm font-bold text-white mb-4">
                      {reportData.title}
                    </h4>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/10">
                        <p className="text-[9px] font-bold text-emerald-500/70 uppercase mb-1">
                          Выручка
                        </p>
                        <p className="text-sm font-black text-emerald-400">
                          {fmt(reportData.totalRevenue)}
                        </p>
                      </div>
                      <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/10">
                        <p className="text-[9px] font-bold text-blue-500/70 uppercase mb-1">
                          Ср. чек
                        </p>
                        <p className="text-sm font-black text-blue-400">
                          {fmt(reportData.avgCheck)}
                        </p>
                      </div>
                      <div className="bg-violet-500/10 rounded-xl p-3 border border-violet-500/10">
                        <p className="text-[9px] font-bold text-violet-500/70 uppercase mb-1">
                          Успешных
                        </p>
                        <p className="text-sm font-black text-violet-400">
                          {reportData.wonCount} шт
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {KANBAN_STAGES.map((s) => (
                        <div
                          key={s.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-slate-400">{s.label}</span>
                          <span
                            className="font-mono font-bold"
                            style={{ color: s.color }}
                          >
                            {reportData.stageCounts[s.id]}
                          </span>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-white/10 flex justify-between items-center text-white">
                        <span className="font-bold">ИТОГО:</span>
                        <span className="text-xl font-black">
                          {reportData.total}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const text =
                        `${reportData.title}\n` +
                        (reportData.totalRevenue > 0
                          ? `Выручка: ${fmt(reportData.totalRevenue)}\n`
                          : "") +
                        KANBAN_STAGES.map(
                          (s) => `${s.label}: ${reportData.stageCounts[s.id]}`
                        ).join("\n") +
                        `\nВсего: ${reportData.total}`;
                      handleCopy(text);
                    }}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                  >
                    <ClipboardCheck size={18} /> Копировать
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
