import React, { useEffect, useMemo, useState } from "react";
import "./AllCards.css";
import AllCardsApi from "../../API/AllCards/AllCardsApi";
import AddCustomCard from "../../API/AllCards/AddCustomCard.api";
import GetProducts from "../../API/AddProduct/GetProducts.api";
import SearchCards from "../../API/AllCards/SearchCards.api";

const createPerson = (gender = "") => ({
  name: "",
  phone: "",
  email: "",
  address: "",
  gender,
  nationalID: "",
  dateOfBirth: "",
  nationality: "",
});

const initialMembersData = {
  father: createPerson("Male"),
  mother: createPerson("Female"),
  child1: createPerson("Male"),
  child2: createPerson("Male"),
};

const roleLabels = {
  father: "بيانات الأب",
  mother: "بيانات الأم",
  child1: "بيانات الابن الأول",
  child2: "بيانات الابن الثاني",
};

const requiredRolesByType = {
  Annual: ["father"],
  "Two-Year": ["father"],
  Newlywed: ["father", "mother"],
  Family: ["father", "mother", "child1", "child2"],
};

const Validator = (formData, type) => {
  const hasAtLeastThreeWords = (value) => {
    if (typeof value !== "string") return false;
    const words = value.trim().split(/\s+/).filter(Boolean);
    return words.length >= 3;
  };

  if (!type) return false;

  if (type === "Annual" || type === "Two-Year") {
    const { father } = formData;
    const {
      name,
      phone,
      email,
      address,
      gender,
      nationalID,
      dateOfBirth,
      nationality,
    } = father || {};
    if (
      !name ||
      !hasAtLeastThreeWords(name) ||
      !phone ||
      !email ||
      !address ||
      !gender ||
      !nationalID ||
      !dateOfBirth ||
      !nationality
    ) {
      return false;
    }
  }

  if (type === "Newlywed") {
    const { father, mother } = formData;
    if (
      !father?.name ||
      !hasAtLeastThreeWords(father.name) ||
      !father.phone ||
      !father.email ||
      !father.address ||
      !father.gender ||
      !father.nationalID ||
      !father.dateOfBirth ||
      !father.nationality
    ) {
      return false;
    }
    if (
      !mother?.name ||
      !hasAtLeastThreeWords(mother.name) ||
      !mother.phone ||
      !mother.email ||
      !mother.address ||
      !mother.gender ||
      !mother.nationalID ||
      !mother.dateOfBirth ||
      !mother.nationality
    ) {
      return false;
    }
  }

  if (type === "Family") {
    const { father, mother, child1, child2 } = formData;
    if (
      !father?.name ||
      !hasAtLeastThreeWords(father.name) ||
      !father.phone ||
      !father.email ||
      !father.address ||
      !father.gender ||
      !father.nationalID ||
      !father.dateOfBirth ||
      !father.nationality
    ) {
      return false;
    }
    if (
      !mother?.name ||
      !hasAtLeastThreeWords(mother.name) ||
      !mother.phone ||
      !mother.email ||
      !mother.address ||
      !mother.gender ||
      !mother.nationalID ||
      !mother.dateOfBirth ||
      !mother.nationality
    ) {
      return false;
    }
    if (
      !child1?.name ||
      !hasAtLeastThreeWords(child1.name) ||
      !child1.phone ||
      !child1.email ||
      !child1.address ||
      !child1.gender ||
      !child1.nationalID ||
      !child1.dateOfBirth ||
      !child1.nationality
    ) {
      return false;
    }
    if (
      !child2?.name ||
      !hasAtLeastThreeWords(child2.name) ||
      !child2.phone ||
      !child2.email ||
      !child2.address ||
      !child2.gender ||
      !child2.nationalID ||
      !child2.dateOfBirth ||
      !child2.nationality
    ) {
      return false;
    }
  }

  return true;
};

const AllCards = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allCards, setAllCards] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [generalCode, setGeneralCode] = useState("");
  const [code, setCode] = useState("");
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [filterModel, setFilterModel] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [accountData, setAccountData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    dateOfBirth: "",
    productId: "",
    type: "",
  });
  const [memberForms, setMemberForms] = useState(initialMembersData);
  const [modalStep, setModalStep] = useState(1);
  const [activeRoleStep, setActiveRoleStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const selectedMembershipProducts = useMemo(
    () => allProducts.filter((item) => item.type !== "Custom"),
    [allProducts]
  );
  const selectedRoles = requiredRolesByType[accountData.type] || ["father"];

  useEffect(() => {
    getAllCards();
    getAllProducts();
  }, [page]);

  useEffect(() => {
    if (!toast.show) return undefined;
    const timer = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [toast.show]);

  const resetMembershipForm = () => {
    setAccountData({
      name: "",
      phone: "",
      email: "",
      password: "",
      dateOfBirth: "",
      productId: "",
      type: "",
    });
    setMemberForms(initialMembersData);
    setModalStep(1);
    setActiveRoleStep(0);
    setFormErrors({});
  };

  const hasAtLeastThreeWords = (fullName = "") =>
    fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean).length >= 3;

  const normalizeMembershipType = (type) => {
    if (type === "Two-Year") return "Two-Year";
    return type;
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
  };

  const handleFilter = () => {
    setFilterModel(false);
    if (selectedFilters.length === 0) {
      setTypeFilter("");
      AllCardsApi(page, "", setLoading, setError, setAllCards, setTotalPages);
    } else {
      const type = selectedFilters.join(",");
      setTypeFilter(type);
      AllCardsApi(page, type, setLoading, setError, setAllCards, setTotalPages);
    }
  };

  const validatePerson = (person) => {
    if (
      !person.name ||
      !hasAtLeastThreeWords(person.name) ||
      !person.phone ||
      !person.email ||
      !person.address ||
      !person.gender ||
      !person.nationalID ||
      !person.dateOfBirth ||
      !person.nationality
    ) {
      return false;
    }
    return true;
  };

  const validateAccountStep = () => {
    const nextErrors = {};
    if (!accountData.phone) nextErrors.accountPhone = "رقم الهاتف مطلوب";
    if (!accountData.name) nextErrors.accountName = "الاسم مطلوب";
    if (!accountData.email) nextErrors.accountEmail = "الإيميل مطلوب";
    if (!accountData.password) nextErrors.accountPassword = "كلمة المرور مطلوبة";
    if (!accountData.productId) nextErrors.accountProduct = "اختر العضوية";
    if (!accountData.type) nextErrors.accountType = "نوع العضوية غير صالح";
    setFormErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const handleOpenMembershipModal = () => {
    resetMembershipForm();
    setShowModal(true);
  };

  const handleCloseMembershipModal = () => {
    setShowModal(false);
    resetMembershipForm();
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    if (name === "productId") {
      const selectedProduct = selectedMembershipProducts.find(
        (item) => item._id === value
      );
      setAccountData((prev) => ({
        ...prev,
        productId: value,
        type: selectedProduct?.type || "",
      }));
      return;
    }
    setAccountData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (role, e) => {
    const { name, value } = e.target;
    setMemberForms((prev) => ({
      ...prev,
      [role]: { ...prev[role], [name]: value },
    }));
  };

  const handleMoveToMembers = () => {
    if (!validateAccountStep()) return;
    setFormErrors({});
    setModalStep(2);
    setActiveRoleStep(0);
  };

  const handleRoleNext = () => {
    const currentRole = selectedRoles[activeRoleStep];
    if (!validatePerson(memberForms[currentRole])) {
      setFormErrors((prev) => ({
        ...prev,
        [currentRole]: "برجاء استكمال كل البيانات والاسم ثلاثي",
      }));
      return;
    }
    setFormErrors((prev) => ({ ...prev, [currentRole]: "" }));
    if (activeRoleStep < selectedRoles.length - 1) {
      setActiveRoleStep((prev) => prev + 1);
    }
  };

  const handleRoleBack = () => {
    if (activeRoleStep > 0) setActiveRoleStep((prev) => prev - 1);
  };

  const validateAllByType = () => {
    const roleOrder = requiredRolesByType[accountData.type] || ["father"];
    const invalidRole = roleOrder.find((role) => !validatePerson(memberForms[role]));
    if (invalidRole) {
      setActiveRoleStep(roleOrder.indexOf(invalidRole));
      setFormErrors((prev) => ({
        ...prev,
        [invalidRole]: "برجاء استكمال كل البيانات والاسم ثلاثي",
      }));
      return false;
    }
    return true;
  };

  const buildPayloadByType = () => {
    const selectedProduct = selectedMembershipProducts.find(
      (item) => item._id === accountData.productId
    );
    const type = normalizeMembershipType(accountData.type || selectedProduct?.type || "");
    let data = {};
    if (type === "Annual" || type === "Two-Year") {
      data = { ...memberForms.father };
      data.spouse = {};
      data.members = [];
      data.dateOfBirth = memberForms?.father?.dateOfBirth || "";
    } else if (type === "Newlywed") {
      data = { ...memberForms.father };
      data.spouse = { ...memberForms.mother, relationship: "wife" };
      data.members = [];
      data.dateOfBirth = [
        memberForms?.father?.dateOfBirth || "",
        memberForms?.mother?.dateOfBirth || "",
      ];
    } else {
      data = { ...memberForms.father };
      data.members = [
        { ...memberForms.mother, relationship: "wife" },
        { ...memberForms.child1, relationship: "son" },
        { ...memberForms.child2, relationship: "son" },
      ];
      data.spouse = {};
      data.dateOfBirth = [
        memberForms?.father?.dateOfBirth || "",
        memberForms?.mother?.dateOfBirth || "",
        memberForms?.child1?.dateOfBirth || "",
        memberForms?.child2?.dateOfBirth || "",
      ];
    }
    data.phone = accountData.phone;
    data.name = accountData.name;
    data.email = accountData.email;
    data.password = accountData.password;
    data.productId = accountData.productId;
    data.type = type;
    data.userData = {
      phone: accountData.phone,
      name: accountData.name,
      email: accountData.email,
      password: accountData.password,
    };
    data.cardData = {
      productId: accountData.productId,
      type,
      dateOfBirth: data.dateOfBirth,
    };
    return data;
  };

  const handleMembershipSubmit = async (e) => {
    e.preventDefault();
    const selectedProduct = selectedMembershipProducts.find(
      (item) => item._id === accountData.productId
    );
    const normalizedType = normalizeMembershipType(
      accountData.type || selectedProduct?.type || ""
    );
    const isValidator = Validator(memberForms, normalizedType);
    if (!isValidator) {
      const roleOrder = requiredRolesByType[normalizedType] || ["father"];
      const invalidRole = roleOrder.find(
        (role) => !validatePerson(memberForms?.[role] || {})
      );
      if (invalidRole) {
        setActiveRoleStep(roleOrder.indexOf(invalidRole));
        setFormErrors((prev) => ({
          ...prev,
          [invalidRole]: "برجاء استكمال كل البيانات والاسم ثلاثي",
        }));
      }
      return;
    }
    if (!validateAllByType()) return;
    const payload = buildPayloadByType();
    const submitResult = await AddCustomCard(
      setLoading,
      setError,
      payload,
      setShowModal,
      getAllCards
    );
    if (submitResult?.success) {
      setToast({
        show: true,
        type: "success",
        message: "تم إضافة العضوية بنجاح",
      });
      resetMembershipForm();
    } else {
      setToast({
        show: true,
        type: "error",
        message: submitResult?.message || "فشل إنشاء العضوية",
      });
    }
  };

  const renderMemberForm = (role) => {
    const person = memberForms[role];
    if (!person) return null;
    return (
      <div className="wizard-animate" key={role}>
        <h3>{roleLabels[role]}</h3>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="الاسم ثلاثي"
            value={person.name}
            onChange={(e) => handleMemberChange(role, e)}
          />
          <input
            type="text"
            name="phone"
            placeholder="رقم الهاتف"
            value={person.phone}
            onChange={(e) => handleMemberChange(role, e)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            value={person.email}
            onChange={(e) => handleMemberChange(role, e)}
          />
          <input
            type="text"
            name="address"
            placeholder="العنوان"
            value={person.address}
            onChange={(e) => handleMemberChange(role, e)}
          />
        </div>
        <div className="form-group">
          <select
            name="gender"
            value={person.gender}
            onChange={(e) => handleMemberChange(role, e)}
          >
            <option value="">اختر النوع</option>
            <option value="Male">ذكر</option>
            <option value="Female">أنثى</option>
          </select>
          <input
            type="text"
            name="nationalID"
            placeholder="الرقم القومي"
            value={person.nationalID}
            onChange={(e) => handleMemberChange(role, e)}
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            name="dateOfBirth"
            value={person.dateOfBirth}
            onChange={(e) => handleMemberChange(role, e)}
          />
          <input
            type="text"
            name="nationality"
            placeholder="الجنسية"
            value={person.nationality}
            onChange={(e) => handleMemberChange(role, e)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="cards-page">
      <div className="card_header">
        <button className="add-card-btn" onClick={handleOpenMembershipModal}>
          إضافة عضوية جديدة
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
      {toast.show && (
        <div className={`cards-toast ${toast.type}`}>
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
          >
            ✕
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal wizard-modal">
            <h2>إضافة عضوية جديدة</h2>
            <p className="wizard-subtitle">
              المرحلة {modalStep} من 2
              {modalStep === 2 && accountData.type
                ? ` - ${accountData.type}`
                : ""}
            </p>
            <form onSubmit={handleMembershipSubmit} className="form two-columns-form">
              {modalStep === 1 && (
                <div className="wizard-animate">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="الاسم"
                      value={accountData.name}
                      onChange={handleAccountChange}
                    />
                    <input
                      type="text"
                      name="phone"
                      placeholder="رقم الهاتف"
                      value={accountData.phone}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="البريد الإلكتروني"
                      value={accountData.email}
                      onChange={handleAccountChange}
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="كلمة المرور"
                      value={accountData.password}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={accountData.dateOfBirth}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div className="form-group">
                    <select
                      name="productId"
                      value={accountData.productId}
                      onChange={handleAccountChange}
                    >
                      <option value="">اختر العضوية / البطاقة</option>
                      {selectedMembershipProducts.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name?.ar || item.name?.en || item.type} - {item.type}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={accountData.type || "يتم تحديد النوع تلقائيًا"}
                      readOnly
                    />
                  </div>
                  {(formErrors.accountPhone ||
                    formErrors.accountName ||
                    formErrors.accountEmail ||
                    formErrors.accountPassword ||
                    formErrors.accountDateOfBirth ||
                    formErrors.accountType ||
                    formErrors.accountProduct) && (
                    <p className="wizard-error">
                      {formErrors.accountPhone ||
                        formErrors.accountName ||
                        formErrors.accountEmail ||
                        formErrors.accountPassword ||
                        formErrors.accountDateOfBirth ||
                        formErrors.accountType ||
                        formErrors.accountProduct}
                    </p>
                  )}
                </div>
              )}

              {modalStep === 2 && (
                <>
                  <div className="role-steps">
                    {selectedRoles.map((role, idx) => (
                      <button
                        type="button"
                        key={role}
                        className={`role-step-btn ${
                          idx === activeRoleStep ? "active" : ""
                        }`}
                        onClick={() => setActiveRoleStep(idx)}
                      >
                        {idx + 1}. {roleLabels[role]}
                      </button>
                    ))}
                  </div>
                  {renderMemberForm(selectedRoles[activeRoleStep])}
                  {formErrors[selectedRoles[activeRoleStep]] && (
                    <p className="wizard-error">
                      {formErrors[selectedRoles[activeRoleStep]]}
                    </p>
                  )}
                </>
              )}

              <div className="modal-buttons">
                {modalStep === 1 ? (
                  <button
                    type="button"
                    className="save-btn"
                    onClick={handleMoveToMembers}
                  >
                    التالي
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="back-btn"
                      onClick={handleRoleBack}
                      disabled={activeRoleStep === 0}
                    >
                      السابق
                    </button>
                    {activeRoleStep < selectedRoles.length - 1 ? (
                      <button
                        type="button"
                        className="save-btn"
                        onClick={handleRoleNext}
                      >
                        حفظ والانتقال
                      </button>
                    ) : (
                      <button type="submit" className="save-btn">
                        {loading ? "جاري الحفظ..." : "إنشاء العضوية"}
                      </button>
                    )}
                  </>
                )}
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseMembershipModal}
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
                        checked={selectedFilters.includes("Newlywed")}
                        onChange={() => handleFilterSelect("Newlywed")}
                      />
                      Newlywed
                    </label>
                  </div>
                </div>
                <div className="filter_flex">
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes("Two-Year")}
                        onChange={() => handleFilterSelect("Two-Year")}
                      />
                      Two-Year
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
