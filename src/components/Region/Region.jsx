import React, { useState, useEffect } from "react";
import "./Region.css";
import AddRegion from "../../API/Region/AddRegion.api";
import { useParams } from "react-router-dom";
import GetRegion from "../../API/Region/GetRegion.api";
import UpdateRegion from "../../API/Region/UpdateRegion.api";
import DeleteRegion from "../../API/Region/DeleteRegion.api";
const Region = () => {
  const id = useParams().id;
  useEffect(() => {
    getAllRegions();
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [arabicName, setArabicName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [loading, setloading] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allRegions, setAllRegions] = useState([]);
  const [regionId, setRegionId] = useState("");
  const openUpdateModel = (region) => {
    setShowUpdateModal(true);
    setArabicName(region.name.ar);
    setEnglishName(region.name.en);
    setRegionId(region._id);
  };

  const openDeleteModel = (region) => {
    setShowDeleteModal(true);
    setRegionId(region._id);
  };

  const clearData = () => {
    setArabicName("");
    setEnglishName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      arName: arabicName,
      enName: englishName,
    };
    AddRegion(
      setloading,
      setError,
      data,
      setShowModal,
      clearData,
      id,
      getAllRegions
    );
  };

  const getAllRegions = () => {
    GetRegion(setloading, setError, setAllRegions, id);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const data = {
      arName: arabicName,
      enName: englishName,
    };
    UpdateRegion(
      setLoading,
      setError,
      regionId,
      setShowUpdateModal,
      data,
      getAllRegions,
      clearData
    );
  };

  const handleDelete = () => {
    DeleteRegion(
      setLoading,
      setError,
      regionId,
      setShowDeleteModal,
      getAllRegions
    );
  };

  return (
    <div className="region-container">
      <h1 className="title">المناطق</h1>
      <button className="open-modal-btn" onClick={() => setShowModal(true)}>
        + إضافة منطقة
      </button>

      {/* إضافة منطقة */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>إضافة منطقة جديدة</h2>
            <form onSubmit={handleSubmit}>
              <label>الاسم بالعربي</label>
              <input
                type="text"
                value={arabicName}
                onChange={(e) => setArabicName(e.target.value)}
                placeholder="أدخل الاسم بالعربي"
                required
              />

              <label>الاسم بالإنجليزي</label>
              <input
                type="text"
                value={englishName}
                onChange={(e) => setEnglishName(e.target.value)}
                placeholder="Enter name in English"
                required
              />
              {error}
              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  {loading ? "جاري التحميل..." : "حفظ"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="regions_list">
        {allRegions.map((region) => {
          return (
            <div className="region_item">
              <h2>{region.name.ar}</h2>
              <div className="region_item_btn">
                <button
                  className="edit_btn"
                  onClick={() => openUpdateModel(region)}
                >
                  تعديل
                </button>
                <button
                  className="delete_btn"
                  onClick={() => openDeleteModel(region)}
                >
                  حذف
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* تعديل منطقة */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>تعديل المنطقة</h2>
            <form onSubmit={handleUpdate}>
              <label>الاسم بالعربي</label>
              <input
                type="text"
                value={arabicName}
                onChange={(e) => setArabicName(e.target.value)}
                placeholder="أدخل الاسم بالعربي"
                required
              />

              <label>الاسم بالإنجليزي</label>
              <input
                type="text"
                value={englishName}
                onChange={(e) => setEnglishName(e.target.value)}
                placeholder="Enter name in English"
                required
              />

              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  {Loading ? "جاري التحميل..." : "حفظ"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowUpdateModal(false)}
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
          <div className="modal-content">
            <h2>هل تريد حذف هذه المنطقة</h2>
            <p>وبالتالي حذف جميع المؤسسات بداخلها؟</p>
            <div className="modal-buttons">
              <button className="save-btn" onClick={handleDelete}>
                {Loading ? "جاري التحميل..." : "حذف"}
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
    </div>
  );
};

export default Region;
