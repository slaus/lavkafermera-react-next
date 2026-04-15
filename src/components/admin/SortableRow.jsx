"use client";
import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./SortableRow.module.css";
import { BiEdit, BiTrash, BiCheck, BiImage, BiShow, BiHide } from "react-icons/bi";
import ModalPortal from "@/components/ui/ModalPortal";
import Overlay from "@/components/others/Overlay";
import Modal from "@/components/ui/Modal";
import { useAlert } from "@/context/AppContext";

export default function SortableRow({ product, onEdit, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showAlert } = useAlert();

  const openModal = () => setIsModalOpen(!isModalOpen);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "#f0f0f0" : "transparent",
  };

  const isVisible = product.visible !== undefined ? product.visible : true;

  return (
    <>
      <tr ref={setNodeRef} style={style}>
        <td className={styles.dragHandle} {...attributes} {...listeners}>⋮⋮</td>
        <td className={`${styles.cell} ${!product.visible ? styles.hide : ""}`}>{product.id}</td>
        <td className={`${styles.cell} ${product.new ? styles.ok : ""} ${!product.visible ? styles.hide : ""}`}>{product.title}</td>
        <td className={`${styles.cell} ${product.new ? styles.ok : ""} ${!product.visible ? styles.hide : ""}`}>{product.price} грн.</td>
        <td className={`${styles.cell} ${product.offerPrice ? styles.action : ""}`}>
          {product.offerPrice ? `${product.offerPrice} грн.` : ""}
        </td>
        <td className={`${styles.cell} ${!product.visible ? styles.hide : ""}`}>{product.new ? <BiCheck className={styles.ok} size={24} /> : ""}</td>
        <td className={styles.cell}>
          {isVisible ? <BiShow className={styles.ok} size={20} /> : <BiHide className={styles.hide} size={20} />}
        </td>
        <td className={`${styles.cell} ${!product.visible ? styles.hide : ""}`}>{product.category}</td>
        <td className={`${styles.cell} ${!product.visible ? styles.hide : ""}`}>
          {product.img && <BiImage className={styles.img} size={24} onClick={() => product.img && openModal()} />}
        </td>
        <td className={styles.cell}>
          <a className={styles.edit} onClick={() => onEdit(product)}><BiEdit size={18} /></a>
          <a className={styles.delete} onClick={async () => {
            await onDelete(product.id).then(() => showAlert("Товар успішно видалено!", "error"));
          }}><BiTrash size={18} /></a>
        </td>
      </tr>

      {isModalOpen && (
        <ModalPortal>
          <Overlay>
            <Modal setIsModalOpen={setIsModalOpen}>
              <img alt={product.title} title={product.title} src={product.img} />
            </Modal>
          </Overlay>
        </ModalPortal>
      )}
    </>
  );
}