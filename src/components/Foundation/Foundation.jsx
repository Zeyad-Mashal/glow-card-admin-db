import React, { useState, useEffect } from "react";
import "./Foundation.css";
import AddFoundation from "../../API/Foundation/AddFoundation.api";
import GetAllFoundations from "../../API/Foundation/GetAllFoundations.api";
import DeleteFoundations from "../../API/Foundation/DeleteFoundations.api";
import GetCities from "../../API/City/GetCities.api";
import GetRegion from "../../API/Region/GetRegion.api";
import AddLinkRegion from "../../API/Foundation/AddLinkRegion.api";
import RemoveLinkedRegion from "../../API/Foundation/RemoveLinkedRegion.api";
import AllCategories from "../../API/Category/AllCategories";
const Foundation = () => {
  useEffect(() => {
    getAllFoundations();
    getAllCities();
    getAllCategories();
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [linkRegionModal, setLinkRegionModal] = useState(false);
  const [allFoundations, setAllFoundations] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [allRegions, setAllRegions] = useState([]);
  const [regionsFoundation, setRegionsFoundation] = useState([]);
  const [foundationId, setFoundationId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [images, setImages] = useState([]);
  const [arabicName, setArabicName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [arDesc, setArDesc] = useState("");
  const [enDesc, setEnDesc] = useState("");
  const [arSpecial, setArSpecial] = useState("");
  const [enSpecial, setEnSpecial] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityId, setCityId] = useState("");
  // العناوين
  const [arabicAddress, setArabicAddress] = useState("");
  const [englishAddress, setEnglishAddress] = useState("");
  const [googleMapLink, setGoogleMapLink] = useState("");
  const [address, setAddress] = useState([]);

  const [allCategories, setAllCategories] = useState([]);
  const [categoriesIds, setCategoriesIds] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoriesName, setCategoriesName] = useState([]);

  // العروض
  const [arabicOffer, setArabicOffer] = useState("");
  const [englishOffer, setEnglishOffer] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [offers, setOffers] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setAllFiles((prev) => [...prev, ...files]);
    const fileURLs = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...fileURLs]);
  };

  const handleAddAddress = () => {
    if (arabicAddress && englishAddress && googleMapLink) {
      const newAddress = {
        en: englishAddress,
        ar: arabicAddress,
        map: googleMapLink,
      };
      setAddress((prev) => [...prev, newAddress]);
      setArabicAddress("");
      setEnglishAddress("");
      setGoogleMapLink("");
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (categoryName !== "") {
      const categoryId = allCategories.filter(
        (category) => category.name === categoryName
      )[0]._id;
      setCategoriesIds((prev) => [...prev, categoryId]);
      setCategoriesName((prev) => [...prev, categoryName]);
    } else {
      alert("يجب اختيار التصنيف اولا");
    }
  };

  const removeCategoryId = (index) => {
    setCategoriesIds((prev) => prev.filter((_, i) => i !== index));
    setCategoriesName((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteAddress = (index) => {
    setAddress((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddOffer = () => {
    if (arabicOffer && englishOffer && discountRate) {
      const newOffer = {
        en: englishOffer,
        ar: arabicOffer,
        offer: discountRate,
      };
      setOffers((prev) => [...prev, newOffer]);
      setArabicOffer("");
      setEnglishOffer("");
      setDiscountRate("");
    }
  };

  const handleDeleteOffer = (index) => {
    setOffers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (allFiles.length == 0) {
      alert("يرجى رفع الصور");
      return;
    }
    if (
      arabicName == "" ||
      englishName == "" ||
      arDesc == "" ||
      enDesc == "" ||
      arSpecial == "" ||
      enSpecial == "" ||
      email == "" ||
      phone == "" ||
      password == "" ||
      address.length == 0 ||
      offers.length == 0 ||
      cityId == ""
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    let data = new FormData();
    for (let i = 0; i < allFiles.length; i++) {
      data.append("image", allFiles[i]);
    }
    data.append("arName", arabicName);
    data.append("enName", englishName);
    data.append("arDescription", arDesc);
    data.append("enDescription", enDesc);
    data.append("arSpecialty", arSpecial);
    data.append("enSpecialty", enSpecial);
    data.append("email", email);
    data.append("phone", phone);
    data.append("password", password);
    data.append("city", cityId);
    // هنا نضيف العناوين بشكل صحيح
    address.forEach((addr, index) => {
      data.append(`address[${index}][en]`, addr.en);
      data.append(`address[${index}][ar]`, addr.ar);
      data.append(`address[${index}][map]`, addr.map);
    });
    // وهنا نضيف العروض
    offers.forEach((offer, index) => {
      data.append(`offers[${index}][en]`, offer.en);
      data.append(`offers[${index}][ar]`, offer.ar);
      data.append(`offers[${index}][offer]`, offer.offer);
    });
    categoriesIds.forEach((category, index) => {
      data.append(`categories[${index}]`, category);
    });

    AddFoundation(setLoading, setError, data, setShowModal, getAllFoundations);
  };

  const getAllFoundations = () => {
    GetAllFoundations(setLoading, setError, setAllFoundations);
  };

  const getAllCities = () => {
    GetCities(setLoading, setError, setAllCities);
  };
  const getAllCategories = () => {
    AllCategories(setLoading, setError, setAllCategories);
  };

  const openDelete = (foundation) => {
    setFoundationId(foundation._id);
    setShowDeleteModal(true);
    console.log(foundationId);
  };

  const DeleteFoundationApi = () => {
    DeleteFoundations(
      setLoading,
      setError,
      foundationId,
      setShowDeleteModal,
      getAllFoundations
    );
  };

  const openLinkRegions = (foundation) => {
    setFoundationId(foundation._id);
    setLinkRegionModal(true);
    setRegionsFoundation(foundation.regions);
  };

  const getAllRegion = (value) => {
    const cityId = allCities.filter((city) => city.name.ar === value)[0]._id;
    if (cityId) {
      GetRegion(setLoading, setError, setAllRegions, cityId);
    } else {
      alert("City Id Is Not Found..!");
    }
  };

  const getCityId = (value) => {
    const cityId = allCities.filter((city) => city.name.ar === value)[0]._id;
    if (cityId) {
      setCityId(cityId);
    } else {
      alert("City Id Is Not Found..!");
    }
  };

  const getRegionId = (value) => {
    const regionId = allRegions.filter((region) => region.name.ar === value)[0]
      ._id;
    console.log(regionId);

    if (regionId) {
      setRegionId(regionId);
    } else {
      alert("Region Id Is not Found..!");
    }
  };

  const handleAddRegion = () => {
    if (regionId === "") {
      alert("You Must Select The Region..!");
      return;
    }
    AddLinkRegion(
      setLoading,
      setError,
      regionId,
      foundationId,
      getAllFoundations,
      setLinkRegionModal
    );
  };

  const handleRemoveRegion = (regionId) => {
    RemoveLinkedRegion(
      setLoading,
      setError,
      regionId,
      foundationId,
      getAllFoundations,
      setLinkRegionModal
    );
  };

  return (
    <div className="foundation">
      <h1>إضافة المؤسسات</h1>
      <button className="add-btn" onClick={() => setShowModal(true)}>
        + إضافة مؤسسة
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ×
            </button>

            <form>
              <div className="flex-group">
                <div className="form-group">
                  <label>الاسم بالعربي</label>
                  <input
                    type="text"
                    value={arabicName}
                    onChange={(e) => setArabicName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>الاسم بالإنجليزي</label>
                  <input
                    type="text"
                    value={englishName}
                    onChange={(e) => setEnglishName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-group">
                <div className="form-group">
                  <label>الايميل</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>رقم الهاتف</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-group">
                <div className="form-group">
                  <label>الباسورد</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-group">
                <div className="form-group">
                  <label>التصنيفات</label>
                  <select onChange={(e) => setCategoryName(e.target.value)}>
                    {allCategories.map((item, index) => {
                      return (
                        <option value={item.name} key={index}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                  <button onClick={(e) => handleAddCategory(e)}>اضافه</button>
                  <div className="category_items">
                    {categoriesName.map((category, index) => {
                      return (
                        <p key={index}>
                          {category}{" "}
                          <span onClick={() => removeCategoryId(index)}>X</span>
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* إضافة العناوين */}
              <div className="flex-group">
                <div className="form-group">
                  <label>العنوان بالعربي</label>
                  <input
                    type="text"
                    value={arabicAddress}
                    onChange={(e) => setArabicAddress(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>العنوان بالإنجليزي</label>
                  <input
                    type="text"
                    value={englishAddress}
                    onChange={(e) => setEnglishAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>رابط جوجل ماب</label>
                <input
                  type="text"
                  value={googleMapLink}
                  onChange={(e) => setGoogleMapLink(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="add-btn"
                onClick={handleAddAddress}
              >
                + إضافة عنوان
              </button>

              {/* عرض العناوين المدخلة */}
              <div className="address-list">
                {address.map((address, index) => (
                  <div key={index} className="address-item">
                    <p>
                      <strong>العربي:</strong> {address.ar}
                    </p>
                    <p>
                      <strong>الإنجليزي:</strong> {address.en}
                    </p>
                    <p>
                      <strong>رابط:</strong> {address.map}
                    </p>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDeleteAddress(index)}
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>

              {/* إضافة العروض */}
              <div className="flex-group">
                <div className="form-group">
                  <label>العرض بالعربي</label>
                  <input
                    type="text"
                    value={arabicOffer}
                    onChange={(e) => setArabicOffer(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>العرض بالإنجليزي</label>
                  <input
                    type="text"
                    value={englishOffer}
                    onChange={(e) => setEnglishOffer(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>نسبة العرض (%)</label>
                <input
                  type="text"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="add-btn"
                onClick={handleAddOffer}
              >
                + إضافة عرض
              </button>

              {/* عرض العروض المدخلة */}
              <div className="offers-list">
                {offers.map((offer, index) => (
                  <div key={index} className="offer-item">
                    <p>
                      <strong>العرض بالعربي:</strong> {offer.ar}
                    </p>
                    <p>
                      <strong>العرض بالإنجليزي:</strong> {offer.en}
                    </p>
                    <p>
                      <strong>النسبة:</strong> {offer.offer}%
                    </p>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDeleteOffer(index)}
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>

              {/* باقي الفورم */}
              <div className="flex-group">
                <div className="form-group">
                  <label>الوصف بالعربي</label>
                  <textarea
                    value={arDesc}
                    onChange={(e) => setArDesc(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>الوصف بالإنجليزي</label>
                  <textarea
                    value={enDesc}
                    onChange={(e) => setEnDesc(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="flex-group">
                <div className="form-group">
                  <label>التخصصات بالعربي</label>
                  <textarea
                    value={arSpecial}
                    onChange={(e) => setArSpecial(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>التخصصات بالإنجليزي</label>
                  <textarea
                    value={enSpecial}
                    onChange={(e) => setEnSpecial(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="form-group">
                <label>رفع الصور</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="preview-container">
                  {images.map((img, i) => (
                    <img key={i} src={img} className="preview-img" />
                  ))}
                </div>
              </div>

              <select onChange={(e) => getCityId(e.target.value)}>
                <option value="اختر المدينه">اختر المدينه</option>
                {allCities.map((item, index) => {
                  return (
                    <option value={item.name.ar} key={index}>
                      {item.name.ar}
                    </option>
                  );
                })}
              </select>
            </form>
            {error}
            <button className="submit-btn" onClick={handleSubmit}>
              {loading ? "جاري التحميل..." : "إضافة مؤسسة"}
            </button>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="close-btn"
              onClick={() => setShowUpdateModal(false)}
            >
              ×
            </button>

            <form>
              <div className="flex-group">
                <div className="form-group">
                  <label>الاسم بالعربي</label>
                  <input
                    type="text"
                    value={arabicName}
                    onChange={(e) => setArabicName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>الاسم بالإنجليزي</label>
                  <input
                    type="text"
                    value={englishName}
                    onChange={(e) => setEnglishName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-group">
                <div className="form-group">
                  <label>الايميل</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>رقم الهاتف</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-group">
                <div className="form-group">
                  <label>الباسورد</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* إضافة العناوين */}
              <div className="flex-group">
                <div className="form-group">
                  <label>العنوان بالعربي</label>
                  <input
                    type="text"
                    value={arabicAddress}
                    onChange={(e) => setArabicAddress(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>العنوان بالإنجليزي</label>
                  <input
                    type="text"
                    value={englishAddress}
                    onChange={(e) => setEnglishAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>رابط جوجل ماب</label>
                <input
                  type="text"
                  value={googleMapLink}
                  onChange={(e) => setGoogleMapLink(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="add-btn"
                onClick={handleAddAddress}
              >
                + إضافة عنوان
              </button>

              {/* عرض العناوين المدخلة */}
              <div className="address-list">
                {address.map((address, index) => (
                  <div key={index} className="address-item">
                    <p>
                      <strong>العربي:</strong> {address.ar}
                    </p>
                    <p>
                      <strong>الإنجليزي:</strong> {address.en}
                    </p>
                    <p>
                      <strong>رابط:</strong> {address.map}
                    </p>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDeleteAddress(index)}
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>

              {/* إضافة العروض */}
              <div className="flex-group">
                <div className="form-group">
                  <label>العرض بالعربي</label>
                  <input
                    type="text"
                    value={arabicOffer}
                    onChange={(e) => setArabicOffer(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>العرض بالإنجليزي</label>
                  <input
                    type="text"
                    value={englishOffer}
                    onChange={(e) => setEnglishOffer(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>نسبة العرض (%)</label>
                <input
                  type="text"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="add-btn"
                onClick={handleAddOffer}
              >
                + إضافة عرض
              </button>

              {/* عرض العروض المدخلة */}
              <div className="offers-list">
                {offers.map((offer, index) => (
                  <div key={index} className="offer-item">
                    <p>
                      <strong>العرض بالعربي:</strong> {offer.ar}
                    </p>
                    <p>
                      <strong>العرض بالإنجليزي:</strong> {offer.en}
                    </p>
                    <p>
                      <strong>النسبة:</strong> {offer.offer}%
                    </p>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDeleteOffer(index)}
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>

              {/* باقي الفورم */}
              <div className="flex-group">
                <div className="form-group">
                  <label>الوصف بالعربي</label>
                  <textarea
                    value={arDesc}
                    onChange={(e) => setArDesc(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>الوصف بالإنجليزي</label>
                  <textarea
                    value={enDesc}
                    onChange={(e) => setEnDesc(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="flex-group">
                <div className="form-group">
                  <label>التخصصات بالعربي</label>
                  <textarea
                    value={arSpecial}
                    onChange={(e) => setArSpecial(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>التخصصات بالإنجليزي</label>
                  <textarea
                    value={enSpecial}
                    onChange={(e) => setEnSpecial(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="form-group">
                <label>رفع الصور</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="preview-container">
                  {images.map((img, i) => (
                    <img key={i} src={img} className="preview-img" />
                  ))}
                </div>
              </div>
            </form>
            {error}
            <button className="submit-btn" onClick={handleSubmit}>
              {loading ? "جاري التحميل..." : "إضافة مؤسسة"}
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="close-btn"
              onClick={() => setShowDeleteModal(false)}
            >
              ×
            </button>

            {error}
            <div className="foundtion_delete_btn">
              <button className="submit-btn" onClick={DeleteFoundationApi}>
                {loading ? "جاري التحميل..." : "حذف مؤسسة"}
              </button>
              <button
                className="submit-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {linkRegionModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="close-btn"
              onClick={() => setLinkRegionModal(false)}
            >
              ×
            </button>

            {error}
            <div className="foundtion_delete_btn linkRegions">
              <select onChange={(e) => getAllRegion(e.target.value)}>
                {allCities.map((item) => {
                  return <option value={item.name.ar}>{item.name.ar}</option>;
                })}
              </select>
              <select onChange={(e) => getRegionId(e.target.value)}>
                {allRegions.map((item) => {
                  return <option value={item.name.ar}>{item.name.ar}</option>;
                })}
              </select>
              <button onClick={handleAddRegion}>
                {loading ? "Loading..." : "Add Region"}
              </button>
            </div>

            <div className="regions_list">
              {regionsFoundation.map((item) => {
                return (
                  <div className="region_item">
                    <h3>{item.name.ar}</h3>
                    <button onClick={() => handleRemoveRegion(item._id)}>
                      X
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="foundation_list">
        {loading
          ? "Loading..."
          : allFoundations.map((item, index) => {
              return (
                <div className="foundation_item" key={index}>
                  <img src={item.images[0]} alt="" />
                  <h3>{item.name.ar}</h3>
                  <span>{item._id}</span>
                  <div className="foundation_btns">
                    <button onClick={() => setShowUpdateModal(true)}>
                      تعديل
                    </button>
                    <button onClick={() => openDelete(item)}>حذف</button>
                    <button onClick={() => openLinkRegions(item)}>
                      ربط بالمنطقة
                    </button>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Foundation;
