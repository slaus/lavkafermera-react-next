import React from "react";
import Button from "@/components/ui/Button";
import styles from "./modal.module.css";
// import { getWspUrl } from "../../helpers";
import { sendTelegramOrder } from "../../helpers";
import { useOrderDetails, useReset } from "@/context/AppContext";

const ModalAlert = ({ setModal }) => {
  const orderData = useOrderDetails();
  const reset = useReset();
  // console.log("Order Details ", orderData);

  const onConfirm = async () => {
    try {
      // const WSP_URL = getWspUrl(orderData);
      // window.open(WSP_URL, "_blank");
      await sendTelegramOrder(orderData);
      // Показуємо повідомлення ТІЛЬКИ після успішної відправки
      alert(
        "Дякуємо за вашу покупку! Наш менеджер обов'язково вам зателефонує найближчим часом.",
      );
      setModal(false);
      reset();
      window.location.href = "/";
    } catch (error) {
      console.error("Помилка при відправленні замовлення:", error);
      alert(
        "Сталася помилка при відправленні замовлення. Будь ласка, спробуйте ще раз або зв'яжіться з нами.",
      );
    }
  };

  return (
    <div className={styles._}>
      <h3 className={styles.header}>Підтверджуєте замовлення?</h3>
      <div className={styles.desc}>
        Ви повинні підтвердити своє замовлення. Непідтверджені замовлення будуть
        проігноровані.
      </div>
      <div className={styles.footer}>
        <Button className={styles.btn} onClick={onConfirm}>
          Так
        </Button>
      </div>
    </div>
  );
};

export default ModalAlert;
