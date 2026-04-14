import React from "react";
import styles from "./items-grid.module.css";
import ItemsCard from "./ItemCard";
import Loading from "@/components/ui/Loading";
import {
  useItems,
  useSelectedCategory,
  useItemsSort,
  useSort,
  useSearch,
} from "@/context/AppContext";

const ItemsGrid = () => {
  const { items, loadingItems } = useItems(); // отримуємо loadingItems
  const { sort } = useSort();
  const { selectedCategory } = useSelectedCategory();
  const { searchValue } = useSearch();

  // Показуємо індикатор завантаження, поки дані не завантажились
  if (loadingItems) {
    return <Loading />;
  }

  const filteredItems = items
    .filter((item) => !selectedCategory || item.category === selectedCategory)
    .filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );

  const sortItems = (itemsToSort, sortType) => {
    switch (sortType) {
      case "Зростанням ID":
        return itemsToSort.slice().sort((a, b) => a.id.localeCompare(b.id));
      case "Спаданням ID":
        return itemsToSort.slice().sort((a, b) => b.id.localeCompare(a.id));
      case "Назвою (А-Я)":
        return itemsToSort.slice().sort((a, b) => a.title.localeCompare(b.title));
      case "Назвою (Я-А)":
        return itemsToSort.slice().sort((a, b) => b.title.localeCompare(a.title));
      case "Ціною (Мін.)":
        return itemsToSort.slice().sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
      case "Ціною (Макс.)":
        return itemsToSort.slice().sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
      default:
        return itemsToSort;
    }
  };

  const sortedItems = sortItems(filteredItems, sort);

  return (
    <>
      {sortedItems.length > 0 ? (
        <div className={styles._}>
          {sortedItems.map((item) => (
            <ItemsCard item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <div className={styles.error}>
          За запитом&nbsp;<b>"{searchValue}"</b>&nbsp;нічого не знайдено.
        </div>
      )}
    </>
  );
};

export default ItemsGrid;