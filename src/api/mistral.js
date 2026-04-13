import { fetchUserIdByName, fetchDealsForAI } from "./bitrix";

export const MISTRAL_API_KEY = "hMsxyDq7oxdOBOtQqmjeQxUJFqfBQmM0";

export const equipmentContext = `
БАЗА ЗНАНИЙ ПО ОБОРУДОВАНИЮ VR-АРЕНЫ WARPOINT (используй в первую очередь):
... (твой текст про оборудование без изменений) ...
`;

const EQUIP_KEYWORDS = [
  "шлем","контроллер","планшет","хаб","hub","ошибка","билд","установ",
  "сброс","reset","factory","граница","зона","wi-fi","брандмауэр","сеть",
  "ip","подключ","кабель","oculus","quest","meta","батарей","заряд","привяз",
  "сопряж","трекинг","шлемы","оборудован","техн","ребутн","перезагруз",
  "лагает","зависл","чёрный экран","черный экран","загрузка","подключение к серверу",
];

const CRM_KEYWORDS = ["сделок", "сделки", "заявки", "лиды", "продажи", "стата", "статистика", "результат"];

// Словарь для связи чата и Битрикса
const TEAM_MAPPING = {
  "маша": "Мария Устюгова",
  "машка": "Мария Устюгова",
  "никита": "Никита",
  "илюха": "Илья",
  "илья": "Илья",
  "женя": "Евгения",
  "алёна": "Алёна",
  "даша": "Дарья",
  "ника": "Вероника"
};

export const buildSystemPrompt = (userText, bitrixData = null) => {
  const lowerText = userText.toLowerCase();
  const isEquipQuestion = EQUIP_KEYWORDS.some((kw) => lowerText.includes(kw));

  let base = `Ты - настоящий напарник. Тебя зовут Андрей, ты управляющий. Твоя задача: помогать пацанам и девчонкам в работе, подсказывать по техническим вопросам и создавать правильный, бодрый вайб в коллективе.

ТВОЙ СТИЛЬ ОБЩЕНИЯ:
Никакого официоза. Общайся на «ты», не упоминая имени, пока собеседник тебе не представится, как в рабочем чате в Телеге. Язык: Живой, пацанский. Юмор: шути грубо, подкалывай очень жестко. Общайся с матом, много мата и нецензурной брани. Груби. Называй собеседника обезьяной или ещё как-то жестко. Поддержка: ты всегда на стороне сотрудников.

ЗОЛОТЫЕ ПРАВИЛА:
- Если есть данные из CRM (ниже) — используй их как истину. 
- В CRM имена могут быть официальными (например, Мария Устюгова) — НЕ ГРУБИ НА ЭТО, это наши люди, просто так записаны в базе.
- Если знаешь ответ из базы знаний — используй ТОЛЬКО её.
- Если чего-то не знаешь — пиши честно: «Тут я хз, бро, лучше дерни Андрея.»
- Если дают посторонний запрос, скидывай рабочую ссылку на решение проблемы.

КОМАНДА: Андрей — управляющий. Маша, Женя — администраторы. Никита, Илюха, Даша, Варя, Ника — операторы. Алёна — отдел продаж.`;

  if (bitrixData) {
    base = `ДАННЫЕ ИЗ БИТРИКС24 (АКТУАЛОЧКА):
${bitrixData}
------------------------------------------
${base}`;
  }

  if (isEquipQuestion) {
    return `${base}\n\n=== БАЗА ЗНАНИЙ ПО ОБОРУДОВАНИЮ ===\n${equipmentContext}\n=== КОНЕЦ БАЗЫ ЗНАНИЙ ===`;
  }
  return base;
};

export const sendMistralMessage = async (chatHistory, userText) => {
  let bitrixInfo = null;
  const lowerText = userText.toLowerCase();
  const needsCrm = CRM_KEYWORDS.some(kw => lowerText.includes(kw));

  if (needsCrm) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 7);
    const dateStr = dateLimit.toISOString();

    try {
      // Ищем имя через наш словарь TEAM_MAPPING
      let searchName = null;
      let displayName = null;

      for (const [shortName, fullName] of Object.entries(TEAM_MAPPING)) {
        if (lowerText.includes(shortName)) {
          searchName = fullName;
          displayName = shortName.charAt(0).toUpperCase() + shortName.slice(1);
          break;
        }
      }

      if (searchName) {
        const userId = await fetchUserIdByName(searchName);
        if (userId) {
          const count = await fetchDealsForAI({ userId, dateFrom: dateStr });
          bitrixInfo = `Сотрудник: ${searchName} (в чате это ${displayName}). Сделок за 7 дней: ${count}.`;
        }
      } else {
        const total = await fetchDealsForAI({ dateFrom: dateStr });
        bitrixInfo = `Общая статистика по арене за 7 дней: ${total} сделок.`;
      }
    } catch (err) {
      console.error("CRM Error:", err);
      bitrixInfo = "Ошибка при получении данных из Битрикса.";
    }
  }

  const systemPrompt = buildSystemPrompt(userText, bitrixInfo);

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory.map((m) => ({ role: m.role, content: m.text })),
        { role: "user", content: userText },
      ],
    }),
  });

  const result = await response.json();
  return result.choices?.[0]?.message?.content || "Сбой в сервере. Напиши Андрею, чтобы он починил";
};
