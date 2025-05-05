import React, { useState, useEffect } from "react";
import "./Ads.css";
import AddAds from "../../API/Ads/AddAds.api";
import GetBanners from "../../API/Ads/GetBanners.api";
import DeleteAds from "../../API/Ads/DeleteAds.api";
import UpdateAds from "../../API/Ads/UpdateAds.api";
const Ads = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [adImage, setAdImage] = useState(null);
  const [adLink, setAdLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adsId, setAdsId] = useState("");

  const [allBanners, setAllBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null); // للإعلان اللي هنعدله أو نحذفه

  useEffect(() => {
    getAllBanners();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!adImage || !adLink) {
      alert("يرجى رفع صورة وإدخال رابط الإعلان");
      return;
    }

    const data = new FormData();
    data.append("image", adImage);
    data.append("url", adLink);

    if (showEditModal && selectedBanner) {
      // تعديل
      UpdateAds(
        setLoading,
        setError,
        adsId,
        setShowEditModal,
        data,
        getAllBanners
      );
    } else {
      // إضافة جديد
      AddAds(setLoading, setError, data, setShowModal, getAllBanners);
    }
  };

  const getAllBanners = () => {
    GetBanners(setLoading, setError, setAllBanners);
  };

  const openDelete = (item) => {
    setShowDeleteModal(true);
    setAdsId(item._id);
  };

  const handleDelete = () => {
    DeleteAds(setLoading, setError, adsId, setShowDeleteModal, getAllBanners);
  };

  const openEditModal = (banner) => {
    setSelectedBanner(banner);
    setAdLink(banner.url);
    setAdImage(null); // مش هنحط صورة، المستخدم يرفع صورة جديدة لو عايز
    setShowEditModal(true);
    setAdsId(banner._id);
  };

  const UpdateAdsApi = (e) => {
    e.preventDefault();

    if (!adImage || !adLink) {
      alert("يرجى رفع صورة وإدخال رابط الإعلان");
      return;
    }
    const data = new FormData();
    data.append("image", adImage);
    data.append("url", adLink);
  };

  return (
    <div className="ads-container">
      <button className="add-ad-btn" onClick={() => setShowModal(true)}>
        إضافة إعلان
      </button>

      {/* مودال الإضافة / التعديل */}
      {(showModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{showEditModal ? "تعديل إعلان" : "إضافة إعلان"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>رفع صورة الإعلان:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {(adImage || (showEditModal && selectedBanner?.banner)) && (
                <div className="image-preview">
                  <img
                    src={
                      adImage
                        ? URL.createObjectURL(adImage)
                        : selectedBanner?.banner
                    }
                    alt="معاينة الإعلان"
                  />
                </div>
              )}

              <div className="form-group">
                <label>رابط الإعلان:</label>
                <input
                  type="text"
                  value={adLink}
                  onChange={(e) => setAdLink(e.target.value)}
                  placeholder="أدخل رابط الإعلان"
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  {loading
                    ? "جاري الحفظ..."
                    : showEditModal
                    ? "تعديل الإعلان"
                    : "حفظ الإعلان"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setShowEditModal(false);
                    setSelectedBanner(null);
                  }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال تأكيد الحذف */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <h3>هل تريد حذف هذا الإعلان؟</h3>
            <div className="modal-buttons">
              <button className="delete-btn" onClick={handleDelete}>
                {loading ? "جاري الحذف ..." : "نعم"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedBanner(null);
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* عرض البانرات */}
      <div className="banners_list">
        {loading
          ? "Loading..."
          : allBanners.map((item) => {
              return (
                <div className="banner_item" key={item.id}>
                  <img src={item.banner} alt="" />
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.url}
                  </a>
                  <div className="banner_btns">
                    <button onClick={() => openEditModal(item)}>تعديل</button>
                    <button
                      onClick={() => {
                        openDelete(item);
                      }}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Ads;
