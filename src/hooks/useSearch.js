import { useMemo } from "react";

export const useSearch = (searchQuery, allContent) => {
  const results = useMemo(() => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase();
    const found = [];

    Object.keys(allContent).forEach((key) => {
      if (key === "dashboard") return;
      const category = allContent[key];
      if (!category.data) return;

      category.data.forEach((item) => {
        // Логика для подпапок (Access/Пароли)
        if (category.isSubfolder) {
          item.items.forEach((sub) => {
            if (
              sub.label.toLowerCase().includes(query) ||
              sub.val.toLowerCase().includes(query)
            ) {
              found.push({
                title: sub.label,
                content: sub.val,
                categoryLabel: category.label,
                categoryKey: key,
              });
            }
          });
        }
        // Логика для чеклистов
        else if (category.isChecklist) {
          if (item.day.toLowerCase().includes(query)) {
            found.push({
              title: item.day,
              content: item.tasks.join("\n"),
              categoryLabel: category.label,
              categoryKey: key,
            });
          }
          item.tasks.forEach((t) => {
            if (t.toLowerCase().includes(query)) {
              found.push({
                title: `${item.day}: Задача`,
                content: t,
                categoryLabel: category.label,
                categoryKey: key,
              });
            }
          });
        }
        // Дефолтная логика (Equipment и прочее)
        else {
          if (
            item.title?.toLowerCase().includes(query) ||
            (item.content && item.content.toLowerCase().includes(query))
          ) {
            found.push({
              ...item,
              categoryLabel: category.label,
              categoryKey: key,
            });
          }
        }
      });
    });
    return found;
  }, [searchQuery, allContent]);

  return {
    searchResults: results,
    isSearching: searchQuery.trim().length > 0,
  };
};
