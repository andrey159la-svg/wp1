import { BITRIX_WEBHOOK_URL } from "../constants/kanban";

// Для дашборда — по стадии + дата создания сегодня
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

// Для отчётов и финансов — все сделки в диапазоне
// withFinance=true → запрашиваем OPPORTUNITY (сумма сделки)
export const fetchAllDealsInRange = async (
  dateFrom,
  dateTo,
  withFinance = false
) => {
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

// Новые заявки в стадии NEW
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
// Поиск сотрудника по имени или фамилии
export const fetchUserIdByName = async (nameOrLastName) => {
  // Пробуем найти сначала по имени
  let res = await fetch(`${BITRIX_WEBHOOK_URL}user.get`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      FILTER: { "NAME": nameOrLastName }
    }),
  });
  let data = await res.json();

  // Если по имени пусто, пробуем по фамилии
  if (!data.result || data.result.length === 0) {
    res = await fetch(`${BITRIX_WEBHOOK_URL}user.get`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
      FILTER: { "LAST_NAME": nameOrLastName }
    }),
    });
    data = await res.json();
  }

  // Возвращаем ID первого найденного или null
  return data.result?.[0]?.ID || null;
};
