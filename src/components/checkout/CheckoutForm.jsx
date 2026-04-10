import React, {useState} from "react";
import styles from "@/components/checkout/checkout-form.module.css";
import {
  BiUser,
  BiPhone,
  BiMap,
  BiMapAlt,
  BiAnchor,
  BiMessage,
} from "react-icons/bi";
import SliderCheckbox from "@/components/ui/SliderCheckbox";
import {
  useDelivery,
  useFormState,
  useOrderDetails,
} from "@/context/AppContext";
import { useForm } from "react-hook-form";
import { getFormValidations } from "../../helpers";
import ModalAlert from "@/components/others/ModalAlert";
import Overlay from "@/components/others/Overlay";
import Modal from "@/components/ui/Modal";

const CheckoutForm = () => {
  const { setFormState } = useFormState();
  const { cartItems } = useOrderDetails();
  const { delivery, setDelivery } = useDelivery();
  const [checked, setChecked] = useState(delivery);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });
  const [showModal, setModal] = useState(false);
  const validations = getFormValidations();

  const onSubmit = (formState) => {
    setFormState(formState);
    setModal(true);
  };

  const toggleChecked = () => {
    if (cartItems.length === 0) return;
    setChecked(!checked);
    setDelivery(!delivery);
  };

  return (
    <>
      <div className={styles._}>
        <h3 className={styles.title}>Ваші дані</h3>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.delivery}>
            <div className={styles.label}>Доставка по Україні?</div>
            <SliderCheckbox checked={checked} toggleChecked={toggleChecked} />
          </div>
          <div
            className={`${styles.group} ${errors?.name ? styles.err : ""} ${cartItems.length === 0 ? styles.disabled : ""}`}
          >
            <div className={styles.icon}>
              <BiUser size={20} />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Ваше ім'я та прізвище"
              className={styles.input}
              disabled={cartItems.length === 0}
              {...register("name", validations.name)}
            />
            {errors?.name && (
              <p className={styles.error}>{errors.name.message}</p>
            )}
          </div>
          <div
            className={`${styles.group} ${errors?.phone ? styles.err : ""} ${cartItems.length === 0 ? styles.disabled : ""}`}
          >
            <div className={styles.icon}>
              <BiPhone size={20} />
            </div>
            <input
              type="phone"
              name="phone"
              placeholder="Ваш номер телефону"
              className={styles.input}
              disabled={cartItems.length === 0}
              {...register("phone", validations.phone)}
            />
            {errors?.phone && (
              <p className={styles.error}>{errors.phone.message}</p>
            )}
          </div>
          {delivery && (
            <>
              <div
                className={`${styles.group} ${errors?.address ? styles.err : ""}`}
              >
                <div className={styles.icon}>
                  <BiMap size={20} />
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Склад Нової Пошти"
                  className={styles.input}
                  {...register("address", validations.address)}
                />
                {errors?.address && (
                  <p className={styles.error}>{errors.address.message}</p>
                )}
              </div>
              <div
                className={`${styles.group} ${errors?.city ? styles.err : ""}`}
              >
                <div className={styles.icon}>
                  <BiMapAlt size={20} />
                </div>
                <input
                  type="text"
                  name="city"
                  placeholder="Ваш населений пункт"
                  className={styles.input}
                  {...register("city", validations.city)}
                />
                {errors?.city && (
                  <p className={styles.error}>{errors.city.message}</p>
                )}
              </div>
              <div
                className={`${styles.group} ${errors?.schedule ? styles.err : ""}`}
              >
                <div className={styles.icon}>
                  <BiAnchor size={20} />
                </div>
                <input
                  type="text"
                  name="schedule"
                  placeholder="Область, район"
                  className={styles.input}
                  {...register("schedule", validations.schedule)}
                />
                {errors?.schedule && (
                  <p className={styles.error}>{errors.schedule.message}</p>
                )}
              </div>
            </>
          )}
          <div
            className={
              `${styles.group} ${errors?.comment ? styles.err : ""}` +
              ` ${cartItems.length === 0 ? styles.disabled : ""}`
            }
          >
            <div className={styles.icon}>
              <BiMessage size={20} />
            </div>
            <input
              type="text"
              name="comment"
              placeholder="Додатковий коментар"
              className={styles.input}
              disabled={cartItems.length === 0}
              {...register("comment", validations.comment)}
            />
            {errors?.comment && (
              <p className={styles.error}>{errors.comment.message}</p>
            )}
          </div>
          <button
            type="submit"
            className={styles.confirm}
            disabled={cartItems.length === 0}
          >
            Зробити замовлення
          </button>
        </form>
      </div>
      {showModal && (
        <Overlay>
          <Modal setIsModalOpen={setModal}>
            <ModalAlert showModal={showModal} setModal={setModal} />
          </Modal>
        </Overlay>
      )}
    </>
  );
};

export default CheckoutForm;
