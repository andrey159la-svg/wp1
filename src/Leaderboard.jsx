// components/Leaderboard.jsx
import React, { useState, useEffect } from "react";
import { Trophy, Medal, Crown, Edit2, Save, X, Calendar, Star, Zap } from "lucide-react";

const Leaderboard = () => {
  // Режим редактирования (доступен только для админа, но здесь просто переключатель)
  const [isEditing, setIsEditing] = useState(false);
  const [period, setPeriod] = useState("week"); // "week" или "month"

  // Загрузка данных из localStorage
  const loadData = (periodKey) => {
    const saved = localStorage.getItem(`leaderboard_${periodKey}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch(e) { return defaultData; }
    }
    return defaultData;
  };

  const defaultData = {
    week: [
      { id: 1, name: "XaKeP_228", photo: "https://via.placeholder.com/80?text=1", prize: "Скидка 50% на игру", wins: 12 },
      { id: 2, name: "KillerPro", photo: "https://via.placeholder.com/80?text=2", prize: "Бесплатный час", wins: 9 },
      { id: 3, name: "NoobMaster69", photo: "https://via.placeholder.com/80?text=3", prize: "Фирменный стикер", wins: 7 },
    ],
    month: [
      { id: 1, name: "ProGamer", photo: "https://via.placeholder.com/80?text=1", prize: "VIP на месяц", wins: 45 },
      { id: 2, name: "Fragger", photo: "https://via.placeholder.com/80?text=2", prize: "Скидка 30%", wins: 38 },
      { id: 3, name: "SniperWolf", photo: "https://via.placeholder.com/80?text=3", prize: "Футболка WARPOINT", wins: 31 },
    ]
  };

  const [winners, setWinners] = useState(() => loadData(period));

  useEffect(() => {
    setWinners(loadData(period));
  }, [period]);

  // Сохранение при изменении winners
  useEffect(() => {
    localStorage.setItem(`leaderboard_${period}`, JSON.stringify(winners));
  }, [winners, period]);

  // Обновление данных конкретного места
  const updateWinner = (place, field, value) => {
    setWinners(prev => prev.map(w => 
      w.id === place ? { ...w, [field]: value } : w
    ));
  };

  // Получение иконки и цвета для места
  const getPlaceStyle = (place) => {
    switch(place) {
      case 1: return { icon: Crown, color: "text-yellow-400", bg: "from-yellow-600/20 to-yellow-800/10", border: "border-yellow-500/50" };
      case 2: return { icon: Medal, color: "text-slate-300", bg: "from-slate-500/20 to-slate-700/10", border: "border-slate-400/50" };
      case 3: return { icon: Trophy, color: "text-amber-600", bg: "from-amber-700/20 to-amber-900/10", border: "border-amber-600/50" };
      default: return { icon: Star, color: "text-slate-500", bg: "from-slate-600/20 to-slate-800/10", border: "border-slate-500/30" };
    }
  };

  // Обработчик загрузки фото (преобразование в base64)
  const handlePhotoUpload = (place, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateWinner(place, "photo", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Верхняя панель с выбором периода и кнопкой редактирования */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setPeriod("week")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              period === "week" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Calendar size={14} className="inline mr-1" /> Лучшие за неделю
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              period === "month" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Calendar size={14} className="inline mr-1" /> Лучшие за месяц
          </button>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isEditing 
              ? "bg-emerald-600 text-white" 
              : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {isEditing ? <Save size={14} /> : <Edit2 size={14} />}
          {isEditing ? "Сохранить" : "Редактировать"}
        </button>
      </div>

      {/* Карточки победителей */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {winners.map((winner) => {
          const placeStyle = getPlaceStyle(winner.id);
          const PlaceIcon = placeStyle.icon;
          return (
            <div
              key={winner.id}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 group ${
                isEditing ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900" : ""
              }`}
              style={{
                background: `linear-gradient(135deg, ${placeStyle.bg})`,
                border: `1px solid ${placeStyle.border}`,
                backdropFilter: "blur(8px)",
              }}
            >
              {/* Бейдж места */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
                <PlaceIcon size={14} className={placeStyle.color} />
                <span className="text-xs font-black text-white">#{winner.id}</span>
              </div>

              {/* Фото игрока */}
              <div className="flex justify-center pt-6 pb-2">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white/20 shadow-xl">
                  <img
                    src={winner.photo}
                    alt={winner.name}
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-all">
                      <span className="text-[10px] font-bold text-white">Сменить</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(winner.id, e)}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Никнейм */}
              <div className="text-center mt-2 px-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={winner.name}
                    onChange={(e) => updateWinner(winner.id, "name", e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-1 text-center text-lg font-black text-white outline-none focus:border-blue-500"
                  />
                ) : (
                  <h3 className="text-xl font-black text-white tracking-tight">{winner.name}</h3>
                )}
              </div>

              {/* Приз */}
              <div className="mt-3 px-4 pb-4">
                <div className="bg-black/40 rounded-xl p-2 text-center border border-white/10">
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">ПРИЗ</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={winner.prize}
                      onChange={(e) => updateWinner(winner.id, "prize", e.target.value)}
                      className="w-full bg-transparent text-center text-sm font-bold text-yellow-400 outline-none border-b border-white/20 focus:border-yellow-500"
                    />
                  ) : (
                    <p className="text-sm font-bold text-yellow-400">{winner.prize}</p>
                  )}
                </div>
              </div>

              {/* Доп. статистика (победы) */}
              <div className="px-4 pb-4 flex justify-center items-center gap-1 text-slate-400 text-[10px]">
                <Zap size={10} /> {winner.wins} побед за {period === "week" ? "неделю" : "месяц"}
              </div>

              {/* Декоративные блики */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/5 blur-2xl rounded-full"></div>
            </div>
          );
        })}
      </div>

      {/* Пояснительный блок */}
      <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 text-center text-xs text-slate-400">
        <p className="flex items-center justify-center gap-2">
          <Star size={12} className="text-yellow-500" />
          Рейтинг обновляется автоматически на основе активности в чате игроков WARPOINT Perm.
          {isEditing && " Сейчас включён режим редактирования — измените данные и нажмите «Сохранить»."}
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
