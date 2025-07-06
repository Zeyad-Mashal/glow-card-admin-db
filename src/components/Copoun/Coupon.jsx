import React, { useState, useEffect } from "react";
import "./Coupon.css";
import CreateCoupon from "../../API/Coupon/CreateCoupon";
import GetCoupons from "../../API/Coupon/GetCoupons";
import EditCoupon from "../../API/Coupon/EditCoupon";
import DeleteCoupon from "../../API/Coupon/DeleteCoupon";
/* شكل الكوبون الابتدائي */
const initForm = {
  coupon: "",
  discount: "",
  startingDate: "",
  expiryDate: "",
};

const Coupon = () => {
  /* الحالة */
  useEffect(() => {
    getAllCoupons();
  }, []);

  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(initForm);
  const [modal, setModal] = useState({ type: null, open: false, id: null });
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const [allCoupons, setAllCoupons] = useState([]);
  /* فتح المودالات */
  const openAdd = () => (
    setForm(initForm), setModal({ type: "add", open: true, id: null })
  );
  const openEdit = (c) => {
    setForm({ ...c });
    setModal({ type: "edit", open: true, id: c._id });
  };
  const openDel = (c) => setModal({ type: "del", open: true, id: c._id });
  const closeModal = () => setModal({ type: null, open: false, id: null });

  /* تغيّر الحقول */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* إضافة كوبون */
  const handleAdd = () => {
    const { coupon, discount, startingDate, expiryDate } = form;

    // تحقُّق أولي
    if (!coupon.trim() || !discount || !startingDate || !expiryDate) return;

    /* الشكل النهائي للكائن المرسل */
    const data = {
      coupon: coupon.trim(), // "cv56Kc"
      discount: Number(discount), // 15
      startingDate, // "2025-07-01"
      expiryDate, // "2025-07-06"
      active: true, // مبدئيًا مفعَّل
    };

    // إضافة محلية سريعة (اختياري)
    setCoupons([...coupons, { ...data, id: Date.now() }]);

    // استدعاء الـ API
    CreateCoupon(setloading, setError, data, setModal, getAllCoupons);
  };

  /* تعديل كوبون */
  const handleUpdate = () => {
    const id = modal.id; // ← الـ id المحفوظ

    // تحقُّق سريع من إدخال القيم
    if (!form.coupon.trim() || !form.discount) return;

    /* الكائن المطلوب للـ API */
    const data = {
      coupon: form.coupon.trim(), // "cv56Kc"
      discount: Number(form.discount), // 15
    };

    // تحدّث الحالة محلياً (اختياري إذا كنت تجلب بعد التعديل)
    setCoupons(coupons.map((c) => (c.id === id ? { ...c, ...data } : c)));

    // استدعاء خدمة التعديل
    EditCoupon(setloading, setError, id, setModal, getAllCoupons, data);

    // إغلاق المودال
    closeModal();
  };

  /* حذف كوبون */
  const handleDelete = () => {
    const id = modal.id;
    setCoupons(coupons.filter((c) => c.id !== id));
    DeleteCoupon(setloading, setError, id, setModal, getAllCoupons);
    closeModal();
  };

  /* تفعيل / إيقاف */
  const toggleActive = (id) => {
    setCoupons(
      coupons.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    // استدعِ API التفعيل هنا: ToggleCouponApi(...)
  };
  const getAllCoupons = () => {
    GetCoupons(setloading, setError, setAllCoupons);
  };
  return (
    <div className="coupon">
      <div className="coupon_container">
        <h1>كوبونات الخصم</h1>

        {/* زر إضافة */}
        <button className="btn primary" onClick={openAdd}>
          إضافة كوبون
        </button>

        {/* جدول الكوبونات */}
        <div className="table_wrapper">
          {allCoupons.length ? (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>الكوبون</th>
                  <th>الخصم %</th>
                  <th>تاريخ البداية</th>
                  <th>تاريخ الانتهاء</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {allCoupons.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td>{c.coupon}</td>
                    <td>{c.discount}</td>
                    <td>{c.startingDate}</td>
                    <td>{c.expiryDate}</td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={c.active}
                          onChange={() => toggleActive(c.id)}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>
                    <td>
                      <button className="btn" onClick={() => openEdit(c)}>
                        تعديل
                      </button>
                      <button className="btn danger" onClick={() => openDel(c)}>
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty">لا توجد كوبونات.</p>
          )}
        </div>
      </div>

      {/* المودال */}
      {modal.open && (
        <div className="modal_backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {modal.type === "add" && (
              <>
                <h2>إضافة كوبون</h2>
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
                <h2>تعديل كوبون</h2>
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
                <p>هل أنت متأكد من حذف هذا الكوبون؟</p>
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

/* نموذج داخل المودال */
const ModalForm = ({ form, onChange, onSubmit, submitLabel, onCancel }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
  >
    <label>
      الكوبون
      <input
        type="text"
        name="coupon"
        value={form.coupon}
        onChange={onChange}
        required
      />
    </label>
    <label>
      نسبة الخصم (%)
      <input
        type="number"
        name="discount"
        min="1"
        max="100"
        value={form.discount}
        onChange={onChange}
        required
      />
    </label>
    <label>
      تاريخ البداية
      <input
        type="date"
        name="startingDate"
        value={form.startingDate}
        onChange={onChange}
        required
      />
    </label>
    <label>
      تاريخ الانتهاء
      <input
        type="date"
        name="expiryDate"
        value={form.expiryDate}
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

export default Coupon;
