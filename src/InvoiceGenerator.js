import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Download,
  ClipboardCheck,
  ChevronDown,
} from "lucide-react";
import html2pdf from "html2pdf.js";

const WP_BillingSystem = () => {
  const getFormattedDate = () => {
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];
    const d = new Date();
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} г.`;
  };

  const [docType, setDocType] = useState("invoice"); // 'invoice' или 'act'
  const [showDocMenu, setShowDocMenu] = useState(false);

  const [invoiceData, setInvoiceData] = useState({
    number: "235",
    date: getFormattedDate(),
    buyerName: "",
    contractDetails: "Счет № 235 от 07.04.2026 г.", // Для акта
  });

  const [items, setItems] = useState([
    {
      id: Date.now(),
      name: "Услуги по организации мероприятия на WARPOINT",
      qty: 1,
      unit: "усл",
      price: 2340,
    },
  ]);

  const totalSum = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  const priceToStr = (price) => {
    let rub = Math.floor(price);
    let kop = Math.round((price - rub) * 100);
    return `${rub} руб. ${kop < 10 ? "0" + kop : kop} коп.`;
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("doc-preview");
    const opt = {
      margin: 0,
      filename: `${docType === "invoice" ? "Счет" : "Акт"}_№${
        invoiceData.number
      }.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 p-6 h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-['Inter']">
      {/* ЛЕВАЯ ПАНЕЛЬ УПРАВЛЕНИЯ */}
      <div className="xl:w-[420px] flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-[#1e293b] border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
          {/* СЕЛЕКТОР ТИПА ДОКУМЕНТА */}
          <div className="relative mb-6">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2 block">
              Закрывающий документ
            </label>
            <button
              onClick={() => setShowDocMenu(!showDocMenu)}
              className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 flex items-center justify-between hover:border-cyan-500 transition-all"
            >
              <div className="flex items-center gap-3">
                {docType === "invoice" ? (
                  <FileText className="text-cyan-400" size={20} />
                ) : (
                  <ClipboardCheck className="text-yellow-400" size={20} />
                )}
                <span className="font-bold">
                  {docType === "invoice" ? "ВЫСТАВИТЬ СЧЕТ" : "ВЫСТАВИТЬ АКТ"}
                </span>
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform ${
                  showDocMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDocMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <button
                  onClick={() => {
                    setDocType("invoice");
                    setShowDocMenu(false);
                  }}
                  className="w-full p-4 flex items-center gap-3 hover:bg-cyan-500/10 transition-colors text-left"
                >
                  <FileText size={18} className="text-cyan-400" />
                  <div>
                    <div className="text-sm font-bold">Закрывающий документ</div>
                    <div className="text-[10px] text-slate-500">
                      Закрывающий документ
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setDocType("act");
                    setShowDocMenu(false);
                  }}
                  className="w-full p-4 flex items-center gap-3 hover:bg-yellow-500/10 transition-colors text-left border-t border-slate-800"
                >
                  <ClipboardCheck size={18} className="text-yellow-400" />
                  <div>
                    <div className="text-sm font-bold">
                      Закрывающий документ
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Закрывающий документ
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* ОСНОВНЫЕ ПОЛЯ */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  № Документа
                </label>
                <input
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-sm text-yellow-400 focus:border-yellow-400 outline-none transition-all"
                  value={invoiceData.number}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, number: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Дата
                </label>
                <input
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-sm focus:border-cyan-400 outline-none transition-all"
                  value={invoiceData.date}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Заказчик
              </label>
              <textarea
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-sm h-16 focus:border-cyan-400 outline-none transition-all resize-none"
                placeholder="ООО 'ВАРПОИНТ'..."
                value={invoiceData.buyerName}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, buyerName: e.target.value })
                }
              />
            </div>

            {docType === "act" && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Основание (Счет/Договор)
                </label>
                <input
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-sm focus:border-yellow-400 outline-none transition-all"
                  value={invoiceData.contractDetails}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      contractDetails: e.target.value,
                    })
                  }
                />
              </div>
            )}

            <button
              onClick={handleDownloadPDF}
              className={`w-full mt-4 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg ${
                docType === "invoice"
                  ? "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20"
                  : "bg-yellow-600 hover:bg-yellow-500 shadow-yellow-900/20"
              }`}
            >
              <Download size={18} /> СКАЧАТЬ{" "}
              {docType === "invoice" ? "СЧЕТ (PDF)" : "АКТ (PDF)"}
            </button>
          </div>
        </div>

        {/* УСЛУГИ */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
              Перечень работ / услуг
            </h3>
            <button
              onClick={() =>
                setItems([
                  ...items,
                  { id: Date.now(), name: "", qty: 1, unit: "усл", price: 0 },
                ])
              }
              className="text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-400/10 p-1 rounded-md"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 bg-[#0f172a] rounded-xl border border-slate-800 relative group"
              >
                <button
                  onClick={() =>
                    items.length > 1 &&
                    setItems(items.filter((i) => i.id !== item.id))
                  }
                  className="absolute top-2 right-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={14} />
                </button>
                <input
                  className="w-full bg-transparent border-b border-slate-700 mb-2 text-sm font-medium text-slate-200 focus:border-cyan-500 outline-none"
                  placeholder="Наименование услуги..."
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx].name = e.target.value;
                    setItems(newItems);
                  }}
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    className="bg-[#1e293b] border border-slate-700 rounded p-1 text-xs text-center text-yellow-400"
                    value={item.qty}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[idx].qty = parseFloat(e.target.value) || 0;
                      setItems(newItems);
                    }}
                  />
                  <input
                    className="bg-[#1e293b] border border-slate-700 rounded p-1 text-xs text-center text-slate-400"
                    value={item.unit}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[idx].unit = e.target.value;
                      setItems(newItems);
                    }}
                  />
                  <input
                    type="number"
                    className="bg-[#1e293b] border border-slate-700 rounded p-1 text-xs text-right text-cyan-400"
                    value={item.price}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[idx].price = parseFloat(e.target.value) || 0;
                      setItems(newItems);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ПРЕВЬЮ (ОФИЦИАЛЬНЫЙ СТИЛЬ) */}
      <div className="flex-1 bg-slate-800/50 rounded-3xl p-8 overflow-auto flex justify-center shadow-inner border border-slate-700">
        <div
          id="doc-preview"
          className="bg-white text-black p-[15mm_20mm] shadow-2xl"
          style={{
            width: "210mm",
            minHeight: "297mm",
            boxSizing: "border-box",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {docType === "invoice" ? (
            /* РЕКВИЗИТЫ БАНКА (Только для счета) */
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #000",
                fontSize: "10pt",
                marginBottom: "20px",
              }}
            >
              <tbody>
                <tr>
                  <td
                    colSpan="2"
                    rowSpan="2"
                    style={{
                      border: "1px solid #000",
                      padding: "4px 6px",
                      width: "50%",
                      verticalAlign: "top",
                    }}
                  >
                    Филиал Точка ПАО Банка «ФК Открытие»
                    <br />
                    <span style={{ fontSize: "8pt" }}>Банк получателя</span>
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px 6px",
                      width: "10%",
                    }}
                  >
                    БИК
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px 6px",
                      width: "40%",
                    }}
                  >
                    044525104
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "4px 6px" }}>
                    Р/С
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px 6px" }}>
                    40802810801500392523
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      border: "1px solid #000",
                      padding: "4px 6px",
                    }}
                  >
                    ИНН 02480089963
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px 6px" }}>
                    Корр. счёт
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px 6px" }}>
                    3010181075374525104
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      border: "1px solid #000",
                      padding: "4px 6px",
                    }}
                  >
                    ИП Титова Анна Сергеевна
                    <br />
                    <span style={{ fontSize: "8pt" }}>Получатель</span>
                  </td>
                  <td
                    rowSpan="2"
                    colSpan="2"
                    style={{
                      border: "1px solid #000",
                      padding: "4px 6px",
                      verticalAlign: "top",
                    }}
                  >
                    {/* Пустая ячейка справа от получателя по стандарту */}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            /* ЗАГОЛОВОК АКТА */
            <div
              style={{
                textAlign: "center",
                borderBottom: "2px solid #000",
                paddingBottom: "10px",
                marginBottom: "20px",
              }}
            >
              <h1 style={{ fontSize: "14pt", fontWeight: "bold", margin: 0 }}>
                Акт № {invoiceData.number} от {invoiceData.date} об оказании
                услуг
              </h1>
            </div>
          )}

          {docType === "invoice" && (
            <div
              style={{
                borderBottom: "2px solid #000",
                paddingBottom: "5px",
                marginBottom: "20px",
              }}
            >
              <h1 style={{ fontSize: "14pt", fontWeight: "bold", margin: 0 }}>
                Счет на оплату № {invoiceData.number} от {invoiceData.date}
              </h1>
            </div>
          )}

          {/* ИНФО О СТОРОНАХ */}
          <div
            style={{
              fontSize: "10pt",
              lineHeight: "1.4",
              marginBottom: "20px",
            }}
          >
            <p style={{ margin: "5px 0" }}>
              <strong>
                {docType === "invoice" ? "Поставщик" : "Исполнитель"}:
              </strong>{" "}
              ИП Титова Анна Сергеевна, ИНН 02400589963, 620034, Свердловская
              обл., г Екатеринбург, ул. Черепанова, дом 36, кв 5
            </p>
            <p style={{ margin: "10px 0 5px 0" }}>
              <strong>
                {docType === "invoice" ? "Покупатель" : "Заказчик"}:
              </strong>{" "}
              <span
                style={{
                  textDecoration: docType === "act" ? "underline" : "none",
                }}
              >
                {invoiceData.buyerName || "Заказчик не указан"}
              </span>
            </p>
            {docType === "act" && (
              <p style={{ margin: "5px 0" }}>
                <strong>Основание:</strong> {invoiceData.contractDetails}
              </p>
            )}
          </div>

          {docType === "act" && (
            <p style={{ fontSize: "10pt", marginBottom: "10px" }}>
              Мы, нижеподписавшиеся, Исполнитель и Заказчик, составили настоящий
              Акт о том, что Исполнитказаны следующие услуги:
            </p>
          )}

          {/* ТАБЛИЦА */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    fontSize: "9pt",
                    width: "30px",
                  }}
                >
                  №
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "5px 10px",
                    fontSize: "9pt",
                    textAlign: "left",
                  }}
                >
                  Наименование работ, услуг
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    fontSize: "9pt",
                    width: "50px",
                  }}
                >
                  Кол-во
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    fontSize: "9pt",
                    width: "40px",
                  }}
                >
                  Ед.
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "5px 10px",
                    fontSize: "9pt",
                    width: "80px",
                    textAlign: "right",
                  }}
                >
                  Цена
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "5px 10px",
                    fontSize: "9pt",
                    width: "90px",
                    textAlign: "right",
                  }}
                >
                  Сумма
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id}>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9pt",
                      textAlign: "center",
                    }}
                  >
                    {idx + 1}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px 10px",
                      fontSize: "9pt",
                    }}
                  >
                    {item.name || "..."}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9pt",
                      textAlign: "center",
                    }}
                  >
                    {item.qty}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9pt",
                      textAlign: "center",
                    }}
                  >
                    {item.unit}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px 10px",
                      fontSize: "9pt",
                      textAlign: "right",
                    }}
                  >
                    {item.price.toLocaleString("ru-RU", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px 10px",
                      fontSize: "9pt",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    {(item.qty * item.price).toLocaleString("ru-RU", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ИТОГО */}
          <div
            style={{
              marginTop: "15px",
              textAlign: "right",
              fontSize: "11pt",
              fontWeight: "bold",
            }}
          >
            Итого:{" "}
            {totalSum.toLocaleString("ru-RU", { minimumFractionDigits: 2 })}{" "}
            руб.
            <br />
            <span style={{ fontSize: "9pt", fontWeight: "normal" }}>
              Без налога (НДС)
            </span>
          </div>

          {docType === "invoice" ? (
            <div style={{ marginTop: "20px", fontSize: "10pt" }}>
              Всего наименований {items.length}, на сумму{" "}
              <span style={{ fontWeight: "bold" }}>{priceToStr(totalSum)}</span>
            </div>
          ) : (
            <div
              style={{
                marginTop: "25px",
                fontSize: "10pt",
                borderTop: "1px solid #000",
                paddingTop: "10px",
              }}
            >
              <p>
                Вышеуказанные услуги оказаныолном объеме и в срок. Заказчик
                претензий по объему, качеству и срокам оказания услуг не имеет.
              </p>
            </div>
          )}

          {/* ПОДПИСИ */}
          <div
            style={{
              marginTop: "60px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "45%" }}>
              <p
                style={{
                  fontWeight: "bold",
                  marginBottom: "30px",
                  fontSize: "10pt",
                }}
              >
                {docType === "invoice" ? "Руководитель" : "Исполнитель"}:
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  borderBottom: "1px solid #000",
                }}
              >
                <div style={{ flex: 1, height: "20px" }}></div>
                <div style={{ fontSize: "10pt", paddingLeft: "5px" }}>
                  / Титова А. С. /
                </div>
              </div>
              <div
                style={{
                  fontSize: "7pt",
                  textAlign: "center",
                  marginTop: "2px",


export default WP_BillingSystem;
