import React, { useState, useEffect, useMemo } from "react";
import "./Coupon.css";
import CreateCoupon from "../../API/Coupon/CreateCoupon";
import GetCoupons from "../../API/Coupon/GetCoupons";
import EditCoupon from "../../API/Coupon/EditCoupon";
import DeleteCoupon from "../../API/Coupon/DeleteCoupon";
import GetProducts from "../../API/AddProduct/GetProducts.api";

const initForm = {
  coupon: "",
  discount: "",
  startingDate: "",
  expiryDate: "",
  type: "",
  maxUses: "",
};

const Coupon = () => {
  useEffect(() => {
    getAllCoupons();
  }, []);

  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(initForm);
  const [modal, setModal] = useState({ type: null, open: false, id: null });
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const [allCoupons, setAllCoupons] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    GetProducts(() => {}, setError, setAllProducts);
  }, []);

  const membershipTypesFromApi = useMemo(() => {
    const types = [
      ...new Set((allProducts || []).map((p) => p.type).filter(Boolean)),
    ];
    return types.sort((a, b) => String(a).localeCompare(String(b)));
  }, [allProducts]);

  const openAdd = () => (
    setError(""),
    setForm(initForm),
    setModal({ type: "add", open: true, id: null })
  );

  const openEdit = (c) => {
    setError("");
    const id = c._id ?? c.id;
    setForm({
      coupon: c.coupon ?? "",
      discount: c.discount != null ? String(c.discount) : "",
      startingDate: c.startingDate ?? "",
      expiryDate: c.expiryDate ?? "",
      type: c.type ?? "",
      maxUses: c.maxUses != null ? String(c.maxUses) : "",
    });
    setModal({ type: "edit", open: true, id });
  };

  const openDel = (c) =>
    setModal({ type: "del", open: true, id: c._id ?? c.id });
  const closeModal = () => {
    setError("");
    setModal({ type: null, open: false, id: null });
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    const { coupon, discount, startingDate, expiryDate, type, maxUses } = form;

    const typeTrimmed = String(type ?? "").trim();
    const maxUsesTrimmed = String(maxUses ?? "").trim();

    if (
      !coupon.trim() ||
      !discount ||
      !startingDate ||
      !expiryDate ||
      !typeTrimmed ||
      maxUsesTrimmed === ""
    ) {
      return;
    }

    const maxUsesInt = parseInt(maxUsesTrimmed, 10);
    if (!Number.isFinite(maxUsesInt) || maxUsesInt < 1) return;

    const data = {
      coupon: coupon.trim(),
      discount: Number(discount),
      startingDate,
      expiryDate,
      active: true,
      type: typeTrimmed,
      maxUses: maxUsesInt,
    };

    console.log("[Coupon][add] payload", JSON.stringify(data));

    setCoupons([...coupons, { ...data, id: Date.now() }]);

    CreateCoupon(setloading, setError, data, setModal, getAllCoupons);
  };

  const handleUpdate = () => {
    const id = modal.id;

    if (
      !form.coupon.trim() ||
      !form.discount ||
      !form.startingDate ||
      !form.expiryDate ||
      !form.type ||
      form.maxUses === ""
    ) {
      return;
    }

    const typeTrimmed = String(form.type ?? "").trim();
    const maxUsesTrimmed = String(form.maxUses ?? "").trim();
    const maxUsesInt = parseInt(maxUsesTrimmed, 10);
    if (!Number.isFinite(maxUsesInt) || maxUsesInt < 1) return;

    const data = {
      coupon: form.coupon.trim(),
      discount: Number(form.discount),
      startingDate: form.startingDate,
      expiryDate: form.expiryDate,
      type: typeTrimmed,
      maxUses: maxUsesInt,
    };

    console.log("[Coupon][edit] payload", JSON.stringify(data));

    setCoupons(
      coupons.map((c) =>
        (c._id ?? c.id) === id ? { ...c, ...data } : c
      )
    );

    EditCoupon(setloading, setError, id, setModal, getAllCoupons, data);
  };

  const handleDelete = () => {
    const id = modal.id;
    setCoupons(coupons.filter((c) => (c._id ?? c.id) !== id));
    DeleteCoupon(setloading, setError, id, setModal, getAllCoupons);
  };

  const toggleActive = (id) => {
    setCoupons(
      coupons.map((c) =>
        (c._id ?? c.id) === id ? { ...c, active: !c.active } : c
      )
    );
  };

  const getAllCoupons = () => {
    GetCoupons(setloading, setError, setAllCoupons);
  };

  return (
    <div className="coupon">
      <div className="coupon_container">
        <h1>كوبونات الخصم</h1>

        <button className="btn primary" onClick={openAdd}>
          إضافة كوبون
        </button>

        <div className="table_wrapper">
          {allCoupons.length ? (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>الكوبون</th>
                  <th>الخصم&nbsp;%</th>
                  <th>نوع العضوية</th>
                  <th>عدد الاستخدامات</th>
                  <th>تاريخ البداية</th>
                  <th>تاريخ الانتهاء</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {allCoupons.map((c, i) => {
                  const rowId = c._id ?? c.id;
                  return (
                    <tr key={rowId}>
                      <td>{i + 1}</td>
                      <td>{c.coupon}</td>
                      <td>{c.discount}</td>
                      <td>{c.type ?? "—"}</td>
                      <td>{c.maxUses ?? "—"}</td>
                      <td>{c.startingDate}</td>
                      <td>{c.expiryDate}</td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={Boolean(c.active)}
                            onChange={() => toggleActive(rowId)}
                          />
                          <span className="slider"></span>
                        </label>
                      </td>
                      <td>
                        <button className="btn" onClick={() => openEdit(c)}>
                          تعديل
                        </button>
                        <button
                          className="btn danger"
                          onClick={() => openDel(c)}
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="empty">لا توجد كوبونات.</p>
          )}
        </div>
      </div>

      {modal.open && (
        <div className="modal_backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {modal.type === "add" && (
              <>
                <h2>إضافة كوبون</h2>
                <ModalForm
                  form={form}
                  membershipTypes={membershipTypesFromApi}
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
                  membershipTypes={membershipTypesFromApi}
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
      {error ? <p className="coupon-page-error">{error}</p> : null}
    </div>
  );
};

const ModalForm = ({
  form,
  membershipTypes,
  onChange,
  onSubmit,
  submitLabel,
  onCancel,
}) => (
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
      Membership type <span className="coupon-required-star">*</span>
      <select name="type" value={form.type} onChange={onChange} required>
        <option value="">Select membership type</option>
        <option value="All">All</option>
        {membershipTypes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </label>
    <label>
      Max uses (عدد الاستخدامات){" "}
      <span className="coupon-required-star">*</span>
      <input
        type="number"
        name="maxUses"
        min="1"
        step="1"
        value={form.maxUses}
        onChange={onChange}
        required
        placeholder="e.g. 100"
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
