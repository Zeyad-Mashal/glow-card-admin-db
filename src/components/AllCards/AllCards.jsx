import React, { useState, useEffect } from "react";
import "./AllCards.css";
import AllCardsApi from "../../API/AllCards/AllCardsApi";
import AddCustomCard from "../../API/AllCards/AddCustomCard.api";
import GetProducts from "../../API/AddProduct/GetProducts.api";
import SearchCards from "../../API/AllCards/SearchCards.api";

const AllCards = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allCards, setAllCards] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [cutomId, setCutomId] = useState("");
  const [generalCode, setGeneralCode] = useState("");
  const [code, setCode] = useState("");
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [filterModel, setFilterModel] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    nationalID: "",
    nationality: "",
    type: "Custom",
    email: "",
  });

  useEffect(() => {
    getAllCards();
    getAllProducts();
  }, [page]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddCutomCard = () => {
    const customProduct = allProducts.find(
      (product) => product.type === "Custom"
    );
    if (customProduct) {
      setCutomId(customProduct._id);
      setShowModal(true);
    } else {
      alert("Cutom Not Found");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    AddCustomCard(
      setLoading,
      setError,
      formData,
      setShowModal,
      getAllCards,
      cutomId
    );
  };

  const getAllCards = () => {
    AllCardsApi(
      page,
      typeFilter,
      setLoading,
      setError,
      setAllCards,
      setTotalPages
    );
  };

  const getAllProducts = () => {
    GetProducts(setLoading, setError, setAllProducts);
  };

  const getSearchedData = () => {
    if (generalCode === "" && code === "") {
      getAllCards();
    } else {
      SearchCards(setLoading, setError, setAllCards, generalCode, code);
    }
  };
  const handleFilterSelect = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((item) => item !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
    console.log(selectedFilters);
  };

  const handleFilter = () => {
    setFilterModel(false);
    if (selectedFilters.length == 0) {
      setTypeFilter("");
      AllCardsApi(page, "", setLoading, setError, setAllCards, setTotalPages);
    } else {
      const type = selectedFilters.join(",");
      setTypeFilter(type);
      AllCardsApi(page, type, setLoading, setError, setAllCards, setTotalPages);
    }
  };

  return (
    <div className="cards-page">
      <div className="card_header">
        <button className="add-card-btn" onClick={openAddCutomCard}>
          إضافة بطاقة
        </button>
        <input
          type="text"
          placeholder="بحث بالكود العائلي"
          value={generalCode}
          onChange={(e) => setGeneralCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="بحث بالكود الشخصي"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="search_btn" onClick={getSearchedData}>
          {loading ? "Searching..." : "بحث"}
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>إضافة بطاقة جديدة</h2>
            <form onSubmit={handleSubmit} className="form two-columns-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="الاسم"
                  value={formData.name}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="الرقم"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="date"
                  name="dateOfBirth"
                  placeholder="التاريخ"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">اختر الجنس</option>
                  <option value="Male">ذكر</option>
                  <option value="Female">أنثى</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="address"
                  placeholder="العنوان"
                  value={formData.address}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="nationalID"
                  placeholder="الرقم القومي"
                  value={formData.nationalID}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="nationality"
                  placeholder="الجنسية"
                  value={formData.nationality}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="email"
                  placeholder="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  {loading ? "Loading..." : "حفظ البطاقة"}
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

      {filterModel && (
        <div className="modal_overlay">
          <div className="modal">
            <h2>اختار النوع</h2>
            <div className="modal_overlay">
              <div className="modal">
                <h2>الفلتر</h2>
                <div className="filter_flex">
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes("Annual")}
                        onChange={() => handleFilterSelect("Annual")}
                      />
                      Annual
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes("Newelyed")}
                        onChange={() => handleFilterSelect("Newelyed")}
                      />
                      Newelyed
                    </label>
                  </div>
                </div>
                <div className="filter_flex">
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes("Two-year")}
                        onChange={() => handleFilterSelect("Two-year")}
                      />
                      Two-year
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes("Family")}
                        onChange={() => handleFilterSelect("Family")}
                      />
                      Family
                    </label>
                  </div>
                </div>
                <div className="custom_filter">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes("Custom")}
                      onChange={() => handleFilterSelect("Custom")}
                    />
                    Custom
                  </label>
                </div>
                <div className="modal_buttons">
                  <button onClick={handleFilter}>Filter</button>
                  <button onClick={() => setFilterModel(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div onClick={() => setFilterModel(true)} className="filter_model">
        <button>Filter</button>
      </div>

      <div className="card_list">
        <table className="cards-table">
          <thead>
            <tr>
              <th>النوع</th>
              <th>الباركود</th>
              <th>الكود العائلي</th>
              <th>السعر</th>
              <th>تاريخ التفعيل</th>
              <th>تاريخ الانتهاء</th>
              <th>الاسم</th>
              <th>رقم الهاتف</th>
              <th>الخصم</th>
              <th>العنوان</th>
              <th>رقم الهوية</th>
              <th>الميلاد</th>
              <th>الجنسية</th>
              <th>السن</th>
            </tr>
          </thead>
          <tbody>
            {allCards.map((item, index) => (
              <tr key={index}>
                <td>{item.type}</td>
                <td>{item.code}</td>
                <td>{item.generalCode || "-"}</td>
                <td>{item.totalAmount}</td>
                <td>{item.activationDate}</td>
                <td>{item.expiryDate}</td>
                <td>{item.name}</td>
                <td>{item.phone}</td>
                <td>{item.discount}</td>
                <td>{item.address}</td>
                <td>{item.nationalID}</td>
                <td>{item.dateOfBirth}</td>
                <td>{item.nationality}</td>
                <td>{item.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ أزرار تغيير الصفحة */}
      <div className="paginatoin_container">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="pagination"
        >
          الصفحة السابقة
        </button>

        <span>
          {page}-{totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="pagination"
        >
          الصفحة التالية
        </button>
      </div>
    </div>
  );
};

export default AllCards;
