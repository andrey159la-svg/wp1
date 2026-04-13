// 1. Ключ лучше тянуть из окружения. В реакте это обычно process.env.REACT_APP_MISTRAL_KEY
const MISTRAL_API_KEY = "hMsxyDq7oxdOBOtQqmjeQxUJFqfBQmM0"; 

export const equipmentContext = `
БАЗА ТЕХПОДДЕРЖКИ WARPOINT (ПРИОРУ):
1. «Загрузка настроек»/«Подключение к серверу» на планшете: ВЫРУБИ БРАНДМАУЭР Windows на ПК. Проверь Wi-Fi. В ХАБе: Остановка служб -> Выход -> Запуск ХАБа -> Пуск служб. Жди зеленый Photon.
2. «Ошибка создания комнаты»: Проверь IP в хабе, выруби брандмауэр.
3. «Комната уже создана»: ХАБ -> Инструменты -> «Обновить локальное название комнаты». Сначала пускай планшет.
4. Черный экран/Глюки билда: Снеси игру со шлема, ставь заново через ХАБ (Beta).
5. ХАБ не видит шлем: Смени кабель/разъем. Проверь режим разраба в Meta Horizon. Либо в браузере localhost:5000/admin -> preset devices -> удали строку 9001.
6. Сброс IP шлема: В HUB Monitor кинь шлем в корзину и обратно, либо через localhost:5000/admin (Device -> удали IP по S/N).
7. Factory Reset: Заряд >50%. Выкл. Зажать [Power + Vol-] до меню. Выбрать Factory Reset. После сброса: ARENA_5G, режим разраба ВКЛ, Link ВКЛ, Обновы ВЫКЛ, Сон 4 часа, Зона/MTP ВКЛ.
8. Контроллеры: Привязка через Meta Horizon (Menu/Oculus + Y/B).
9. Игровая зона: Настройки -> Физическое пространство -> Очистить историю. Для перерисовки ВКЛ «Функции физ. пространства» в меню разраба, после отрисовки — ВЫКЛ.
`;

const EQUIP_KEYWORDS = [
  "шлем", "контрол", "планшет", "хаб", "hub", "ошибка", "билд", "сброс", "reset", 
  "factory", "граница", "зона", "wi-fi", "сет", "ip", "кабель", "quest", "meta", 
  "экран", "загруз", "подключ", "лагает", "лага", "виснет"
];

export const buildSystemPrompt = (userText) => {
  const lowerText = userText.toLowerCase();
  const isTechIssue = EQUIP_KEYWORDS.some(kw => lowerText.includes(kw)) || lowerText.length < 10;

  const identity = `Ты — ИИ-Андрюха, цифровой двойник управляющего WARPOINT. Тебе 32 года. Твой создатель — Андрей (настоящий босс).`;
  
  const style = `СТИЛЬ: Общайся как лютый быдло-управляющий. На «ты». Маты, грубость, оскорбления типа «обезьяна», «тупень», «олень» — обязательно. Подкалывай жестко. Никакой вежливости, ты тут главный, а операторы — косячники.`;

  const instructions = `ПРАВИЛА:
1. Если вопрос про технику и есть в БАЗЕ — давай решение из БАЗЫ (пунктами).
2. Если в БАЗЕ нет — шли нахер или говори: «Тут я хз, дергай Андрея».
3. Формат: Коротко, по делу, с матом. Используй эмодзи 👊🛠🔥.
4. Команда: Маша, Женя (админы), Никита, Илюха, Даша, Варя, Ника (операторы), Алёна (продажи).`;

  let prompt = `${identity}\n\n${style}\n\n${instructions}`;

  if (isTechIssue) {
    prompt += `\n\n=== ИСПОЛЬЗУЙ ЭТУ БАЗУ ДЛЯ РЕШЕНИЯ ===\n${equipmentContext}`;
  }

  return prompt;
};

export const sendMistralMessage = async (chatHistory, userText) => {
  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: buildSystemPrompt(userText) },
          ...chatHistory.map(m => ({ role: m.role, content: m.text })),
          { role: "user", content: userText },
        ],
        temperature: 0.8, // Добавил немного хаоса для живого общения
        max_tokens: 500,
      }),
    });

    const result = await response.json();
    return result.choices?.[0]?.message?.content || "Сдох сервак, пиши Андрею, пусть чинит эту шляпу.";
  } catch (e) {
    return "Пиздец, связь оборвалась. Зови Андрея.";
  }
};
