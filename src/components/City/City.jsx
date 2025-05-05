import React, { useState, useEffect } from "react";
import "./City.css";
import CityApi from "../../API/City/CityApi.api";
import GetCities from "../../API/City/GetCities.api";
import DeleteCity from "../../API/City/DeleteCity.api";
import UpdateCity from "../../API/City/UpdateCity.api";
import { Link } from "react-router-dom";
const City = () => {
  useEffect(() => {
    getAllCities();
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [image, setImage] = useState(null);
  const [arabicName, setArabicName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [fileImage, setFileImage] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allCities, setAllCities] = useState([]);
  const [id, setId] = useState(null);

  const openUpdateModel = (city) => {
    setShowUpdateModal(true);
    setArabicName(city.name.ar);
    setEnglishName(city.name.en);
    setImage(city.image);
    setId(city._id);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileImage(file);
      setImage(URL.createObjectURL(file));
    }
    console.log(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = new FormData();
    if (arabicName === "" || englishName === "" || fileImage === null) {
      alert("يرجى ملء جميع الحقول");
      return;
    }
    data.append("image", fileImage);
    data.append("arName", arabicName);
    data.append("enName", englishName);
    CityApi(setLoading, setError, data, setShowModal, clearData);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    let data = new FormData();
    if (arabicName === "" || englishName === "") {
      alert("يرجى ملء جميع الحقول");
      return;
    }
    if (fileImage) {
      data.append("image", fileImage);
    }
    data.append("arName", arabicName);
    data.append("enName", englishName);
    UpdateCity(
      setLoading,
      setError,
      id,
      setShowUpdateModal,
      data,
      getAllCities,
      clearData
    );
  };

  const getAllCities = () => {
    GetCities(setLoading, setError, setAllCities);
  };
  const handleDeleteCity = () => {
    DeleteCity(setLoading, setError, id, setShowDeleteModal, getAllCities);
  };

  const clearData = () => {
    setFileImage();
    setArabicName("");
    setEnglishName("");
    setImage(null);
  };
  return (
    <div className="city-container">
      <h1 className="title">المدن</h1>
      <button className="open-modal-btn" onClick={() => setShowModal(true)}>
        + إضافة مدينة
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>إضافة مدينة جديدة</h2>
            <form onSubmit={handleSubmit}>
              <label>الصورة</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {image && (
                <img src={image} alt="preview" className="preview-img" />
              )}

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
                  {loading ? "Loading..." : "حفظ"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false), clearData();
                  }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="cities_list">
        {allCities.map((city) => {
          return (
            <div className="city_item">
              <Link to={`/region/${city._id}`}>
                <img src={city.image} alt="" />
                <h2>{city.name.ar}</h2>
              </Link>

              <div className="city_item_btn">
                <button
                  className="edit_btn"
                  onClick={() => openUpdateModel(city)}
                >
                  تعديل
                </button>
                <button
                  className="delete_btn"
                  onClick={() => {
                    setShowDeleteModal(true);
                    setId(city._id);
                  }}
                >
                  حذف
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>تعديل مدينة</h2>
            <form onSubmit={handleUpdateSubmit}>
              <label>الصورة</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {image && (
                <img src={image} alt="preview" className="preview-img" />
              )}

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
                  {loading ? "Loading..." : "حفظ"}
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
            <h2>هل تريد حذف هذه المدينة؟</h2>
            <p>وبالتالي حذف جميع المناطق بداخلها؟</p>
            <div className="modal-buttons">
              <button className="save-btn" onClick={handleDeleteCity}>
                {loading ? "Loading..." : "حذف"}
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

export default City;
