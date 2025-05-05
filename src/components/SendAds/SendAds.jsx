import React, { useState, useEffect } from "react";
import "./SendAds.css";
import GetEmails from "../../API/SendAds/GetEmails.api";
import GetAllEmails from "../../API/SendAds/GetAllEmails.api";

const SendAds = () => {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filterModel, setFilterModel] = useState(false);
  const [allEmails, setAllEmails] = useState(false);
  const [stringEmails, setStringEmails] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allData, setAllData] = useState([]);
  const [copied, setCopied] = useState(false);
  const [type, setType] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(stringEmails).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // يرجع تاني بعد ثانيتين
    });
  };
  const handleSelectAll = () => {
    if (!selectAll) {
      const allEmails = allData.map((item) => item.email);
      setSelectedEmails(allEmails);
      GetAllEmails(type, setLoading, setError, setSelectedEmails, setShowModal);
    } else {
      setSelectedEmails([]);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectOne = (email) => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter((e) => e !== email));
    } else {
      setSelectedEmails([...selectedEmails, email]);
    }
  };

  const handleSend = () => {
    if (description === "" || link === "") {
      alert("You Must Add description and Link First...");
      return;
    }
    setShowModal(false);
    setAllEmails(true);
    const emails = selectedEmails.join(",");
    setStringEmails(emails);
  };

  const openEmailModel = () => {
    if (selectedEmails == "") {
      alert("You Must Select An Email First..");
    } else {
      setShowModal(true);
    }
  };

  const closeSendEmails = () => {
    setShowModal(false);
    setDescription("");
    setLink("");
    setSelectedEmails([]);
    setStringEmails("");
    setSelectAll(false);
  };

  const handleFilterSelect = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((item) => item !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  useEffect(() => {
    getAllEmails();
  }, []);
  const getAllEmails = () => {
    GetEmails(page, setLoading, setError, setAllData);
  };

  const closeEmailMode = () => {
    setAllEmails(false);
    setDescription("");
    setLink("");
    setSelectedEmails([]);
    setStringEmails("");
  };

  const EmailsByFilter = () => {
    setFilterModel(false);
    if (selectedFilters.length == 0) {
      setType("");
      alert("No Email Selected.!");
      setSelectedEmails([]);
    } else {
      const type = selectedFilters.join(",");
      setType(type);
      GetAllEmails(type, setLoading, setError, setSelectedEmails, setShowModal);
    }
  };
  return (
    <div className="send_ads">
      <div className="ads_container">
        <button onClick={openEmailModel}>ارسال اعلان</button>
        <span onClick={() => setFilterModel(true)}>Get Emails By Type</span>

        <div className="ads_list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Type</th>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {allData.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.type}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(item.email)}
                      onChange={() => handleSelectOne(item.email)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal_overlay">
            <div className="modal">
              <h2>إرسال إعلان</h2>
              <textarea
                placeholder="الوصف"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <input
                type="text"
                placeholder="الرابط"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <div className="modal_buttons">
                <button onClick={handleSend}>إرسال</button>
                <button onClick={closeSendEmails}>إلغاء</button>
              </div>
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
                  <div>
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
                    <button onClick={EmailsByFilter}>
                      Get Selected Emails
                    </button>
                    <button onClick={() => setFilterModel(false)}>إغلاق</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {allEmails && (
          <div className="modal_overlay">
            <div className="modal">
              <h2>جميع الايميلات</h2>
              <div className="emails_container">
                <p className="emails_container_p">{stringEmails}</p>
                <div onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</div>
              </div>
              <h2 className="mailForm">قم بنسخ هذا النموذج</h2>`
              <div
                style={{
                  direction: "rtl",
                  padding: "30px",
                  backgroundColor: "#f0f4f8",
                  fontFamily: "Arial, sans-serif",
                  maxWidth: "600px",
                  margin: "auto",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              >
                <h2
                  style={{
                    fontSize: "24px",
                    color: "#333",
                    marginBottom: "20px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  مرحباً بك! استمتع بأحدث العروض والخصومات
                </h2>
                <p
                  style={{
                    fontSize: "18px",
                    color: "#555",
                    marginBottom: "30px",
                    textAlign: "center",
                  }}
                >
                  {description}
                </p>
                <div style={{ textAlign: "center" }}>
                  <a
                    href={link}
                    style={{
                      display: "inline-block",
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#fff",
                      textAlign: "center",
                      textDecoration: "none",
                      padding: "15px 40px",
                      backgroundColor: "#0069d9",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    اكتشف العروض الآن
                  </a>
                </div>
              </div>
              <div className="modal_buttons">
                <button onClick={handleSend}>إرسال</button>
                <button onClick={closeEmailMode}>إلغاء</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendAds;
