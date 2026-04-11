"use client";
import { useState, useEffect } from "react";
import styles from "./ProductForm.module.css";
import Button from "@/components/ui/Button";
import { useAlert } from '@/context/AppContext';
import {
  BiSave,
  BiTrash,
  BiIdCard,
  BiRename,
  BiMoney,
  BiCategory,
  BiPackage,
  BiMoneyWithdraw,
} from "react-icons/bi";
import SliderCheckbox from "@/components/ui/SliderCheckbox";

export default function ProductForm({
  editingId,
  formData,
  setFormData,
  onSave,
  onCancel,
  uploading,
  onImageUpload,
}) {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(formData.new);
  const [submitted, setSubmitted] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    setChecked(formData.new);
  }, [formData.new]);

  const toggleChecked = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    setFormData({ ...formData, new: newChecked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    let hasError = false;

    if (editingId === "new" && (!formData.id || formData.id.trim() === "")) hasError = true;
    if (!formData.title || formData.title.trim() === "") hasError = true;
    if (formData.price === undefined || formData.price === "" || formData.price <= 0) hasError = true;
    if (!formData.category || formData.category.trim() === "") hasError = true;
    if (formData.offerPrice && formData.price && formData.offerPrice > formData.price) hasError = true;

    if (hasError) return;

    setLoading(true);
    await onSave();
    showAlert(
      editingId === "new" ? "Товар успішно додано!" : "Товар успішно оновлено!",
      "success"
    );
    setLoading(false);
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (submitted && (field === 'id' || field === 'title' || field === 'price' || field === 'category')) {}
  };

  return (
    <form onSubmit={handleSubmit} className={styles._}>
      <h2 className={styles.title}>
        {editingId === "new" ? "Додати новий товар" : "Редагування товару"}
      </h2>

      <div className={styles.checkbox}>
        <div className={styles.label}>Новинка?</div>
        <SliderCheckbox checked={checked} toggleChecked={toggleChecked} />
      </div>
      
      <div className={`${styles.group} ${submitted && editingId === "new" && (!formData.id || formData.id.trim() === "") ? styles.err : ""}`}>
        <div className={`${styles.icon} ${editingId !== "new" ? styles.gray : ""}`}>
          <BiIdCard size={20} />
        </div>
        <input
          type="text"
          name="id"
          placeholder="ID товару (унікальний)"
          className={styles.input}
          value={formData.id}
          onChange={(e) => handleFieldChange("id", e.target.value)}
          disabled={editingId !== "new"}
        />
        {submitted && editingId === "new" && (!formData.id || formData.id.trim() === "") && (
          <p className={styles.error}>ID обов'язковий</p>
        )}
      </div>

      <div className={`${styles.group} ${submitted && (!formData.title || formData.title.trim() === "") ? styles.err : ""}`}>
        <div className={styles.icon}>
          <BiRename size={20} />
        </div>
        <input
          type="text"
          name="title"
          placeholder="Назва товару"
          className={styles.input}
          value={formData.title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
        />
        {submitted && (!formData.title || formData.title.trim() === "") && (
          <p className={styles.error}>Назва обов'язкова</p>
        )}
      </div>

      <div className={`${styles.group} ${submitted && (formData.price === undefined || formData.price === "" || formData.price <= 0) ? styles.err : ""}`}>
        <div className={styles.icon}>
          <BiMoney size={20} />
        </div>
        <input
          type="number"
          name="price"
          placeholder="Ціна (грн.)"
          className={styles.input}
          value={formData.price === 0 ? "" : formData.price}
          onChange={(e) => {
            const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
            handleFieldChange("price", val);
          }}
        />
        {submitted && (formData.price === undefined || formData.price === "" || formData.price <= 0) && (
          <p className={styles.error}>Напишіть ціну товару</p>
        )}
      </div>

      <div className={`${styles.group} ${(formData.offerPrice && formData.price && formData.offerPrice > formData.price) ? styles.err : ""}`}>
        <div className={styles.icon}>
          <BiMoneyWithdraw size={20} />
        </div>
        <input
          type="number"
          name="offerPrice"
          placeholder="Акційна ціна (грн.) – залиште порожнім, якщо немає"
          className={styles.input}
          value={formData.offerPrice || ""}
          onChange={(e) => {
            const rawValue = e.target.value;
            if (rawValue === "") {
              handleFieldChange("offerPrice", "");
              return;
            }
            const val = parseFloat(rawValue);
            if (isNaN(val)) {
              handleFieldChange("offerPrice", "");
            } else {
              handleFieldChange("offerPrice", val);
            }
          }}
        />
        {formData.offerPrice && formData.price && formData.offerPrice > formData.price && (
          <p className={styles.error}>Акційна ціна не може перевищувати звичайну!</p>
        )}
      </div>

      {/* <div className={styles.group}>
        <div className={styles.icon}>
          <BiPackage size={20} />
        </div>
        <input
          type="number"
          name="stock"
          placeholder="Кількість на складі"
          className={styles.input}
          value={formData.stock || ""}
          onChange={(e) =>
            handleFieldChange("stock", e.target.valueAsNumber)
          }
        />
      </div> */}

      <div className={`${styles.group} ${submitted && (!formData.category || formData.category.trim() === "") ? styles.err : ""}`}>
        <div className={styles.icon}>
          <BiCategory size={20} />
        </div>
        <input
          type="text"
          name="category"
          placeholder="Категорія (наприклад, Свіже м'ясо)"
          className={styles.input}
          value={formData.category}
          onChange={(e) => handleFieldChange("category", e.target.value)}
        />
        {submitted && (!formData.category || formData.category.trim() === "") && (
          <p className={styles.error}>Категорія обов'язкова</p>
        )}
      </div>

      <div className={styles.group}>
        <div className={styles.download}>
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            disabled={uploading}
            className={styles.fileInput}
          />
          {uploading && <span className={styles.uploading}> Завантаження...</span>}
          {formData.img && (
            <div className={styles.currentImage}>
              <span>{formData.img}</span>
              <Button
                title="Видалити фото"
                type="button"
                onClick={() => handleFieldChange("img", "")}
                className={styles.delete}
              >
                <BiTrash size={18} />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="submit" disabled={loading}>
          <BiSave size={20} /> {loading ? "Збереження..." : "Зберегти"}
        </Button>
        <Button type="button" onClick={onCancel} className={styles.cancel}>
          Скасувати
        </Button>
      </div>
    </form>
  );
}