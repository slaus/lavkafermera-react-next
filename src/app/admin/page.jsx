"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { arrayMove } from "@dnd-kit/sortable";
import styles from "./page.module.css";
import Header from "@/components/commons/Header";
import Main from "@/components/commons/Main";
import Footer from "@/components/commons/Footer";
import Alert from "@/components/ui/Alert";
import Wrapper from "@/components/commons/Wrapper";
import Loading from "@/components/ui/Loading";
import Modal from "@/components/ui/Modal";
import Overlay from "@/components/others/Overlay";
import AdminTable from "@/components/admin/AdminTable";
import ProductForm from "@/components/admin/ProductForm";
import Button from "@/components/ui/Button";
import { BiPlus } from "react-icons/bi";

function AdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    price: 0,
    offerPrice: "",
    new: false,
    stock: 0,
    img: "",
    category: "",
    visible: true,
  });
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/");
      return;
    }

    fetch(`/api/admin?token=${token}`, { cache: "no-store" })
      .then((res) => {
        console.log("Status:", res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Отримано товарів:", data?.length);
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Помилка завантаження:", err);
        setLoading(false);
      });
  }, [token, router]);

  // Функція-помічник
  const notifyCatalogUpdate = () => {
    const timestamp = Date.now().toString();
    localStorage.setItem("products_last_update", timestamp);
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "products_last_update",
        newValue: timestamp,
      }),
    );
  };

  const refreshProducts = async () => {
    const res = await fetch(`/api/admin?token=${token}`, { cache: "no-store" });
    const data = await res.json();
    setProducts(data);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);
      const newProducts = arrayMove(products, oldIndex, newIndex);
      setProducts(newProducts);
      saveOrder(newProducts);
      await refreshProducts();
      notifyCatalogUpdate();
    }
  };

  const saveOrder = async (orderedProducts) => {
    const res = await fetch(`/api/admin?token=${token}&action=reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: orderedProducts }),
    });
    if (!res.ok) {
      alert("Не вдалося зберегти порядок товарів");
    } else {
      notifyCatalogUpdate();
    }
  };

  const openModalForAdd = () => {
    setEditingId("new");
    setFormData({
      id: "",
      title: "",
      price: 0,
      offerPrice: "",
      new: false,
      stock: 0,
      img: "",
      category: "",
      visible: true,
    });
    setIsModalOpen(true);
  };

  const openModalForEdit = (product) => {
  setEditingId(product.id);
  setFormData({
    ...product,
    offerPrice: product.offerPrice || "",
    new: product.new || false,
    visible: product.visible !== undefined ? product.visible : true,
  });
  setIsModalOpen(true);
};

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити товар?")) return;
    const res = await fetch(`/api/admin?token=${token}&id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
      await refreshProducts();
      notifyCatalogUpdate();
    } else {
      alert("Помилка видалення");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setFormData({ ...formData, img: url });
    } else alert("Помилка завантаження");
    setUploading(false);
  };

  const handleSave = async () => {
    const payload = { ...formData };
    if (payload.offerPrice === "") payload.offerPrice = null;

    if (editingId === "new") {
      const res = await fetch(`/api/admin?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const saved = await res.json();
        setProducts([...products, saved]);
        await refreshProducts();
        notifyCatalogUpdate();
        closeModal();
      } else {
        const err = await res.text();
        alert("Помилка додавання: " + err);
      }
    } else {
      const res = await fetch(`/api/admin?token=${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: editingId }),
      });
      if (res.ok) {
        let updated;
        try {
          updated = await res.json();
          await refreshProducts();
          notifyCatalogUpdate();
        } catch (e) {
          console.error("Помилка парсингу JSON", e);
          alert("Помилка: некоректна відповідь сервера");
          return;
        }
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? updated : p)),
        );
        closeModal();
      } else {
        const errText = await res.text();
        console.error("Помилка оновлення:", errText);
        alert("Помилка оновлення: " + errText);
      }
    }
  };

  return (
    <>
      <h1>Адмінка товарів</h1>
      <Button type="button" onClick={openModalForAdd}>
        <BiPlus size={18} /> Додати товар
      </Button>

      {loading ? (
        <Loading />
      ) : (
        <AdminTable
          products={products}
          onEdit={openModalForEdit}
          onDelete={handleDelete}
          onDragEnd={handleDragEnd}
        />
      )}

      {isModalOpen && (
        <Overlay>
          <Modal setIsModalOpen={setIsModalOpen}>
            <ProductForm
              editingId={editingId}
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              onCancel={closeModal}
              uploading={uploading}
              onImageUpload={handleImageUpload}
            />
          </Modal>
        </Overlay>
      )}
    </>
  );
}

export default function AdminPage() {
  return (
    <>
      <div className={styles._}>
        <Header />
        <Wrapper>
          <Main>
            <Suspense fallback={<Loading />}>
              <AdminContent />
            </Suspense>
          </Main>
        </Wrapper>
      </div>
      <Footer />
      <Alert />
    </>
  );
}
