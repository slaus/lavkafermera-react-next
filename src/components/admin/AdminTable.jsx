"use client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableRow from "./SortableRow";
import styles from "./AdminTable.module.css";

export default function AdminTable({ products, onEdit, onDelete, onDragEnd }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={products.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <table className={styles._}>
          <thead>
            <tr>
              <th>🟰</th>
              <th>ID</th>
              <th>Назва</th>
              <th>Ціна</th>
              <th>Акція</th>
              <th>Новинка</th>
              <th>Видимість</th>
              {/* <th>Залишок</th> */}
              <th>Категорія</th>
              <th>Фото</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <SortableRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
}