import React from "react";
import styles from "@/components/checkout/order-details.module.css";
import {
  useOrderDetails,
  useDelivery,
} from "@/context/AppContext";
import OrderItem from "@/components/checkout/OrderItem";

const OrderDetails = () => {
  const { cartItems, subTotal, withDelivery, shippingCost, packingCost, total } =
    useOrderDetails();
  const { delivery, setDelivery } = useDelivery();
  // console.log("shipping cost " + shippingCost);
  // console.log("with delivery " + withDelivery);
  // console.log(cartItems, subTotal, shippingCost, total);

  return (
    <div className={styles._}>
      <h3 className={styles.title}>Ваше замовлення</h3>
      <div>
        {Object.values(cartItems).map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </div>
      <hr className={styles.hr} />
      <div>
        <div className={styles.item}>
          <p>Підсумок</p>
          <p className={styles.subtotal}>{subTotal} грн.</p>
        </div>
        {!withDelivery ? (
          <div className={styles.item}>
            <p>Адресна доставка по Києву</p>
            <p className={styles.subtotal}>{shippingCost} грн.</p>
          </div>
        ) : (
          <>
            <div className={styles.item}>
              <p>Пакування замовлення</p>
              <p className={styles.subtotal}>{packingCost} грн.</p>
            </div>
            <div className={styles.item}>
              <p>Нова Пошта, згідно тарифам</p>
              <p className={styles.subtotal}><small>від</small> {shippingCost} грн.</p>
            </div>
          </>
        )}
        <div className={styles.item}>
          <p>
            <b>Загальна сума</b>
          </p>
          <p className={styles.total}>{total} грн.</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
