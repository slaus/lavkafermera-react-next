import React from "react";
import styles from "./cart-item.module.css";
import { IoCloseOutline } from "react-icons/io5";
import CounterBtn from "../ui/CounterBtn";
import { useGoodsInCart, useRefreshCart, useAlert } from "@/context/AppContext";

const CartItem = ({ item }) => {
  const { showAlert } = useAlert();

  const { title, price, img, offerPrice, qty } = item;
  const { goodsInCart, setGoodsInCart } = useGoodsInCart();
  const { refreshCart } = useRefreshCart();
  const itemTotal = (offerPrice ? offerPrice * qty : price * qty).toFixed(2);
  // console.log(goodsInCart);

  const removeItemFromCart = (e) => {
    e.preventDefault();
    showAlert("Товар видалено з кошика!", "error");
    refreshCart({ item, n: 0 });
  };

  return (
    <>
      <div className={styles._}>
        <div className={styles.img}>
          <img alt={title} src={`/images/${img || 'no-photo.jpg'}`} className={styles.pict} />
        </div>
        <div className={styles.block}>
          <p className={styles.title}>{title}</p>
          <p className={styles.price}>Ціна за шт. {offerPrice || price} грн.</p>
          <div className={styles.btns}>
            <CounterBtn type="cart" item={item} />
          </div>
        </div>
        <p className={styles.total}>{itemTotal} грн.</p>
        <button
          className={styles.delete}
          onClick={removeItemFromCart}
        >
          <IoCloseOutline size={20} />
        </button>
      </div>
    </>
  );
};

export default CartItem;
