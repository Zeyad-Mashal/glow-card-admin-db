import React, { useState, useEffect } from "react";
import "./DashboardUsers.css";
import AddUser from "../../API/Users/AddUser.api";
import GetUsers from "../../API/Users/GetUsers.api";
import UpdateUser from "../../API/Users/UpdateUser.api";
const DashboardUsers = () => {
  useEffect(() => {
    getAllUsers();
  }, []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([
    {
      name: "أحمد علي",
      email: "ahmed@example.com",
      password: "123456",
    },
    {
      name: "سارة محمد",
      email: "sara@example.com",
      password: "abcdef",
    },
    {
      name: "خالد سمير",
      email: "khaled@example.com",
      password: "khaled2024",
    },
  ]);

  const [editIndex, setEditIndex] = useState(null);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const data = {
      name,
      password,
      email,
    };
    AddUser(setLoading, setError, data, setShowAddModal, getAllUsers);
  };

  const handleEditClick = (user) => {
    setEmail(user.email);
    setName(user.name);
    setPassword(user.password);
    setShowEditModal(true);
    setUserId(user._id);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    const data = {
      name,
      password,
      email,
    };
    UpdateUser(
      setLoading,
      setError,
      userId,
      setShowEditModal,
      data,
      getAllUsers
    );
  };

  const getAllUsers = () => {
    GetUsers(setLoading, setError, setAllUsers);
  };

  return (
    <div className="dashboard-container">
      <h1>المستخدمين</h1>

      <button className="add-user-btn" onClick={() => setShowAddModal(true)}>
        إضافة مستخدم
      </button>

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>كلمة المرور</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(user)}
                  >
                    تعديل
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال إضافة مستخدم */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>إضافة مستخدم جديد</h2>
            <form onSubmit={handleAddUser}>
              <input
                type="text"
                placeholder="الاسم"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error}
              <div className="modal-buttons">
                <button type="submit" className="submit-btn">
                  {loading ? "جاري اضافة المستخدم" : "إضافة"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال تعديل مستخدم */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>تعديل بيانات المستخدم</h2>
            <form onSubmit={handleEditSave}>
              <input
                type="text"
                placeholder="الاسم"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error}
              <div className="modal-buttons">
                <button type="submit" className="submit-btn">
                  {loading ? "جاري تعديل المستخدم" : "تعديل"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUsers;
