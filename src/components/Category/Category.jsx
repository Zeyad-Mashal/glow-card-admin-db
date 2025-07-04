import React, { useState, useEffect } from "react";
import "./Category.css";
import AllCategories from "../../API/Category/AllCategories";
import CategoryApi from "../../API/Category/CategoryApi";
import EditCategory from "../../API/Category/EditCategory";
import DeleteCategory from "../../API/Category/DeleteCategory";
import { data } from "react-router-dom";

const initForm = { name_ar: "", name_en: "" };

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initForm);
  const [modal, setModal] = useState({ type: null, open: false, id: null });
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = () => {
    AllCategories(setloading, setError, setAllCategories);
  };
  /* ---------- فتح وإغلاق المودالات ---------- */
  const openAdd = () => {
    setForm(initForm);
    setModal({ type: "add", open: true, id: null });
  };
  const openEdit = (cat) => {
    setForm({
      // جرّب كل الاحتمالات، وإذا لم يوجد شيء اجعله نصًا فارغًا
      name_ar: cat.name_ar ?? cat.arName ?? "",
      name_en: cat.name_en ?? cat.enName ?? "",
    });
    setModal({ type: "edit", open: true, id: cat.id ?? cat._id });
  };
  const openDel = (cat) => {
    setModal({ type: "del", open: true, id: cat.id ?? cat._id });
  };
  const closeModal = () => setModal({ type: null, open: false, id: null });

  /* ---------- معالجات النماذج ---------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    // التحقق من وجود قيم
    if (!form.name_ar.trim() || !form.name_en.trim()) return;

    // تجهيز البيانات بالطريقة الصحيحة
    const data = {
      arName: form.name_ar.trim(), // الاسم بالعربية
      enName: form.name_en.trim(), // الاسم بالإنجليزية
    };

    // استدعاء الـ API
    CategoryApi(setloading, setError, data, setModal, getAllCategories);

    // إغلاق المودال
    closeModal();
  };

  const handleUpdate = () => {
    // تأكّد من إدخال بيانات
    if (!form.name_ar.trim() || !form.name_en.trim()) return;

    // جهّز الداتا بالشكل المطلوب للـ API
    const data = {
      arName: form.name_ar.trim(),
      enName: form.name_en.trim(),
    };

    const id = modal.id; // ← الـ id المخزَّن مع فتح المودال

    // تحديث الحالة محلياً (اختياري إذا كنت تجلب القوائم من جديد بعد الـ API)
    setCategories(categories.map((c) => (c.id === id ? { ...c, ...form } : c)));

    // استدعاء خدمة التعديل
    EditCategory(setloading, setError, id, setModal, data, getAllCategories);

    // إغلاق المودال
    closeModal();
  };

  const handleDelete = () => {
    const id = modal.id; // ← الـ id المخزَّن

    // (اختياري) احذف محلياً قبل استدعاء الـ API
    setCategories(categories.filter((c) => c.id !== id));

    // استدعاء خدمة الحذف
    DeleteCategory(setloading, setError, id, setModal, getAllCategories);
  };

  return (
    <div className="category">
      <div className="category_container">
        <h1>التصنيفات</h1>

        {/* زر إضافة */}
        <button className="btn primary" onClick={openAdd}>
          إضافة تصنيف
        </button>

        {/* جدول التصنيفات */}
        <div className="table_wrapper">
          {allCategories.length ? (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>الاسم (عربي)</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {allCategories.map((cat, i) => (
                  <tr key={cat.id}>
                    <td>{i + 1}</td>
                    <td>{cat.name}</td>
                    <td>
                      <button className="btn" onClick={() => openEdit(cat)}>
                        تعديل
                      </button>
                      <button
                        className="btn danger"
                        onClick={() => openDel(cat)}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty">لا توجد تصنيفات بعد.</p>
          )}
        </div>
      </div>

      {/* ---------- المودال الواحد متعدد الأغراض ---------- */}
      {modal.open && (
        <div className="modal_backdrop" onClick={closeModal}>
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            } /* يمنع غلق المودال عند النقر داخله */
          >
            {modal.type === "add" && (
              <>
                <h2>إضافة تصنيف</h2>
                <ModalForm
                  form={form}
                  onChange={handleChange}
                  onSubmit={handleAdd}
                  submitLabel="إضافة"
                  onCancel={closeModal}
                />
              </>
            )}

            {modal.type === "edit" && (
              <>
                <h2>تعديل تصنيف</h2>
                <ModalForm
                  form={form}
                  onChange={handleChange}
                  onSubmit={handleUpdate}
                  submitLabel="حفظ"
                  onCancel={closeModal}
                />
              </>
            )}

            {modal.type === "del" && (
              <>
                <h2>تأكيد الحذف</h2>
                <p>هل أنت متأكد من حذف هذا التصنيف؟ لا يمكن التراجع.</p>
                <div className="actions">
                  <button className="btn danger" onClick={handleDelete}>
                    حذف
                  </button>
                  <button className="btn" onClick={closeModal}>
                    إلغاء
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* نموذج داخل المودال لإعادة الاستخدام */
const ModalForm = ({ form, onChange, onSubmit, submitLabel, onCancel }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
  >
    <label>
      الاسم بالعربية
      <input
        type="text"
        name="name_ar"
        value={form.name_ar}
        onChange={onChange}
        required
      />
    </label>
    <label>
      Name in English
      <input
        type="text"
        name="name_en"
        value={form.name_en}
        onChange={onChange}
        required
      />
    </label>

    <div className="actions">
      <button type="submit" className="btn primary">
        {submitLabel}
      </button>
      <button type="button" className="btn" onClick={onCancel}>
        إلغاء
      </button>
    </div>
  </form>
);

export default Category;
