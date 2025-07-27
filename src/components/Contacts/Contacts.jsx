import React, { useState, useEffect } from "react";
import "./Contacts.css";
import GetContact from "../../API/Contacts/GetContact";
const Contacts = () => {
  useEffect(() => {
    getAllContacts();
  }, []);
  const [allContacts, setAllContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const getAllContacts = () => {
    GetContact(setLoading, setError, setAllContacts);
  };
  return (
    <div className="contacts">
      <div className="contacts_container">
        <h1>Contacts</h1>
        <div className="contact_list">
          {loading
            ? "Loading ..."
            : allContacts.length <= 0
            ? "No Contacts Found"
            : allContacts.map((contact) => {
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
                    <p>
                      <strong>Phone:</strong> {contact.phone}
                    </p>
                    <p>
                      <strong>City:</strong> {contact.city}
                    </p>
                    <textarea readOnly value={`Message: ${contact.message}`} />
                    <div className="categories">
                      {contact.categories.map((category) => (
                        <span className="category1" key={category}>
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default Contacts;
