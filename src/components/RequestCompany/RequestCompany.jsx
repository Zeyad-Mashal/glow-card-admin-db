import React, { useState, useEffect } from "react";
import "./Request.css";
import RequestApi from "../../API/RequestApi/RequestApi";

const RequestCompany = () => {
  const [allContacts, setAllContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllRequest();
  }, []);

  const getAllRequest = () => {
    RequestApi(setLoading, setError, setAllContacts);
  };

  return (
    <div className="request">
      <div className="request_container">
        <h1>طلبات بطاقه الشركات</h1>

        {loading && <p className="loading">جار التحميل...</p>}
        {error && <p className="error">حدث خطأ أثناء جلب البيانات</p>}
        {!loading && allContacts.length === 0 && (
          <p className="empty">لا توجد طلبات حالياً</p>
        )}

        <div className="request_list">
          {allContacts.map((contact) => {
            const initials = contact?.fullName
              ?.split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase();

            return (
              <div className="contact_item" key={contact._id}>
                <div className="contact_header">
                  <div className="avatar">{initials}</div>
                  <div>
                    <h2>{contact.fullName}</h2>
                    <p className="subtitle">{contact.email}</p>
                  </div>
                </div>

                <div className="contact_details">
                  <p>
                    <strong>اسم الشركة:</strong> {contact.companyName}
                  </p>
                  <p>
                    <strong>عدد الموظفين:</strong> {contact.employeesNumber}
                  </p>
                  <p>
                    <strong>النوع:</strong> {contact.type}
                  </p>
                  <p>
                    <strong>المدينة:</strong> {contact.city}
                  </p>
                  <p>
                    <strong>رقم الهاتف:</strong> {contact.phone}
                  </p>

                  {contact.message && (
                    <p className="message">
                      <strong>الرسالة:</strong> {contact.message}
                    </p>
                  )}
                </div>

                {contact.categories && contact.categories.length > 0 && (
                  <div className="categories">
                    <strong>الفئات:</strong>
                    {contact.categories.map((category) => (
                      <span className="category1" key={category}>
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RequestCompany;
