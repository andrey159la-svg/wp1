import { BITRIX_WEBHOOK_URL } from "../constants/kanban";

// 1. Для дашборда — по стадии + дата создания сегодня
export const fetchDealsForStage = async (stageId, dateFrom, dateTo) => {
  const filter = {
    CATEGORY_ID: 37,
    STAGE_ID: stageId,
    ">=DATE_CREATE": dateFrom,
    "<=DATE_CREATE": dateTo,
  };
  let all = [];
  let start = 0;
  while (true) {
    const res = await fetch(`${BITRIX_WEBHOOK_URL}crm.deal.list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filter,
        select: ["ID", "STAGE_ID", "DATE_CREATE"],
        start,
      }),
    });
    const data = await res.json();
    all = all.concat(data.result || []);
    if (!data.next) break;
    start = data.next;
  }
  return all;
};

// 2. Для отчётов и финансов — все сделки в диапазоне
export const fetchAllDealsInRange = async (dateFrom, dateTo, withFinance = false) => {
  const filter = {
    CATEGORY_ID: 37,
    ">=DATE_CREATE": dateFrom,
    "<=DATE_CREATE": dateTo,
  };
  const select = withFinance
    ? ["ID", "STAGE_ID", "DATE_CREATE", "OPPORTUNITY", "CURRENCY_ID"]
    : ["ID", "STAGE_ID", "DATE_CREATE"];

  let all = [];
  let start = 0;
  while (true) {
    const res = await fetch(`${BITRIX_WEBHOOK_URL}crm.deal.list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filter, select, start }),
    });
    const data = await res.json();
    all = all.concat(data.result || []);
    if (!data.next) break;
    start = data.next;
  }
  return all;
};

// 3. Новые заявки в стадии NEW
export const fetchNewLeadsCount = async () => {
  const response = await fetch(`${BITRIX_WEBHOOK_URL}crm.deal.list`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filter: { CATEGORY_ID: 37, STAGE_ID: "C37:NEW" },
      select: ["ID"],
    }),
  });
  if (!response.ok) throw new Error("Bitrix error");
  const data = await response.json();
  return data.total || 0;
};

// 4. Поиск сотрудника (теперь ищет по любому совпадению: Маша, Устюгова, Мария — всё найдет)
export const fetchUserIdByName = async (nameOrLastName) => {
  const res = await fetch(`${BITRIX_WEBHOOK_URL}user.get`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      FILTER: { 
        "ACTIVE": "Y", 
        "FIND": nameOrLastName 
      }
    }),
  });
  const data = await res.json();
  return data.result?.[0]?.ID || null;
};

// 5. Универсальный запрос сделок для Андрюхи
export const fetchDealsForAI = async (params) => {
  const { userId, dateFrom } = params;
  const filter = {
    CATEGORY_ID: 37,
    ">=DATE_CREATE": dateFrom,
  };
  if (userId) {
    filter.ASSIGNED_BY_ID = userId;
  }
  const res = await fetch(`${BITRIX_WEBHOOK_URL}crm.deal.list`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filter, select: ["ID"] }),
  });
  const data = await res.json();
  return data.total || 0;
};
