import React, { useState, useEffect } from "react";
import "./Product.css";
import AddProduct from "../../API/AddProduct/AddProduct.api";
import GetProducts from "../../API/AddProduct/GetProducts.api";
import DeleteProduct from "../../API/AddProduct/DeleteProduct.api";
import UpdateProduct from "../../API/AddProduct/UpdateProduct.api";
const Product = () => {
  useEffect(() => {
    getAllProducts();
  }, []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]); // لتخزين الصور لعرضها
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    priceBefore: "",
    priceAfter: "",
    discount: "",
    descAr: "",
    descEn: "",
    type: "",
  });

  const [allFiles, setAllFiles] = useState([]); // لتخزين الملفات ليتم إرسالها للـ API

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // خزن الصور الأصلية عشان تستخدمها في API
    setAllFiles((prev) => [...prev, ...files]);

    // خزن نسخة URL لعرض الصور عالشاشة
    const fileURLs = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...fileURLs]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (allFiles.length === 0) {
      alert("يرجى رفع الصور");
      return;
    }

    if (
      formData.nameEn === "" ||
      formData.nameAr === "" ||
      formData.descEn === "" ||
      formData.descAr === "" ||
      formData.priceAfter === "" ||
      formData.discount === "" ||
      formData.priceBefore === "" ||
      formData.type === ""
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const data = new FormData();

    allFiles.forEach((file) => {
      data.append("image", file);
    });

    // التأكد من إضافة جميع الحقول المطلوبة للـ FormData
    data.append("enName", formData.nameEn);
    data.append("arName", formData.nameAr);
    data.append("enDescription", formData.descEn);
    data.append("arDescription", formData.descAr);
    data.append("price", formData.priceAfter);
    data.append("discount", formData.discount);
    data.append("originalPrice", formData.priceBefore);
    data.append("type", formData.type);
    // data.append("offers", true);

    AddProduct(setLoading, setError, data, setShowAddModal, getAllProducts);
  };

  const openDelete = (item) => {
    setShowDeleteModal(true);
    setProductId(item._id);
  };

  const handleDelete = () => {
    DeleteProduct(
      setLoading,
      setError,
      productId,
      setShowDeleteModal,
      getAllProducts
    );
  };

  const openEdit = (item) => {
    setShowEditModal(true);

    // تجهيز البيانات في الفورم
    setFormData({
      nameAr: item.name.ar,
      nameEn: item.name.en,
      priceBefore: item.originalPrice,
      priceAfter: item.price,
      discount: item.discount,
      descAr: item.description.ar,
      descEn: item.description.en,
      type: item.type,
    });

    // تجهيز الصور اللي موجودة
    if (item.images && item.images.length > 0) {
      setImages(item.images);
    }
    setAllFiles([]);

    setProductId(item._id);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    if (
      formData.nameEn === "" ||
      formData.nameAr === "" ||
      formData.descEn === "" ||
      formData.descAr === "" ||
      formData.priceAfter === "" ||
      formData.discount === "" ||
      formData.priceBefore === "" ||
      formData.type === ""
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // إذا المستخدم رفع صور جديدة
    if (allFiles.length > 0) {
      allFiles.forEach((file) => {
        data.append("image", file);
      });
    }

    data.append("enName", formData.nameEn);
    data.append("arName", formData.nameAr);
    data.append("enDescription", formData.descEn);
    data.append("arDescription", formData.descAr);
    data.append("price", formData.priceAfter);
    data.append("discount", formData.discount);
    data.append("originalPrice", formData.priceBefore);
    data.append("type", formData.type);

    UpdateProduct(
      setLoading,
      setError,
      productId,
      setShowEditModal,
      data,
      getAllProducts
    );
  };

  const getAllProducts = () => {
    GetProducts(setLoading, setError, setAllProducts);
  };

  return (
    <div className="product-container">
      <button className="add-product-btn" onClick={() => setShowAddModal(true)}>
        إضافة منتج
      </button>

      {/* مودال الإضافة والتعديل */}
      {(showAddModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{showAddModal ? "إضافة منتج" : "تعديل منتج"}</h2>
            <form onSubmit={showAddModal ? handleSubmit : handleUpdateSubmit}>
              <div className="form-group">
                <label>رفع الصور:</label>
                <input type="file" multiple onChange={handleImageChange} />
              </div>

              <div className="image-preview">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img} // استخدم الـ URL الذي تم تخزينه
                    alt={`preview-${index}`}
                  />
                ))}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>الاسم بالعربي:</label>
                  <input
                    type="text"
                    name="nameAr"
                    value={formData.nameAr}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>الاسم بالإنجليزي:</label>
                  <input
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>السعر قبل الخصم:</label>
                  <input
                    type="number"
                    name="priceBefore"
                    value={formData.priceBefore}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>السعر بعد الخصم:</label>
                  <input
                    type="number"
                    name="priceAfter"
                    value={formData.priceAfter}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>نسبة الخصم (%):</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>الوصف بالعربي:</label>
                  <textarea
                    name="descAr"
                    value={formData.descAr}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>الوصف بالإنجليزي:</label>
                  <textarea
                    name="descEn"
                    value={formData.descEn}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="form-group">
                <label>نوع المنتج:</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">اختر النوع</option>
                  <option value="Annual">Annual</option>
                  <option value="Two-Year">Two-Year</option>
                  <option value="Newlywed">Newlywed</option>
                  <option value="Family">Family</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {error && <p className="error">{error}</p>}

              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  {loading ? "جاري التحميل ..." : "حفظ"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال الحذف */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <h3>هل تريد حذف هذا المنتج نهائيًا؟</h3>
            <div className="modal-buttons">
              <button className="delete-btn" onClick={handleDelete}>
                {loading ? "جاري الحذف" : "نعم"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="product_list">
        {loading
          ? "Loading..."
          : allProducts.map((item, index) => {
              return (
                <div className="product_item" key={index}>
                  <img src={item.images[0]} alt="" />
                  <h4>{item.name.ar}</h4>
                  <div className="product_btns">
                    <button onClick={() => openEdit(item)}>تعديل</button>
                    <button onClick={() => openDelete(item)}>حذف</button>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Product;
