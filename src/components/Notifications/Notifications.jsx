import React, { useState, useEffect } from "react";
import "./Notifications.css";
import GetAllFoundations from "../../API/Foundation/GetAllFoundations.api";
import SendNotification from "../../API/Notifications/SendNotification.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faPaperPlane, faSearch, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const Notifications = () => {
  const [allFoundations, setAllFoundations] = useState([]);
  const [filteredFoundations, setFilteredFoundations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFoundationId, setSelectedFoundationId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [page] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allData, setAllData] = useState([]);

  // جلب كل المؤسسات عند تحميل الصفحة
  useEffect(() => {
    fetchAllFoundations();
  }, []);

  const fetchAllFoundations = async () => {
    setFetchLoading(true);
    // جلب الصفحة الأولى للحصول على totalPages
    await GetAllFoundations(setFetchLoading, setError, setAllData, 1, setTotalPages);
  };

  useEffect(() => {
    if (totalPages > 1) {
      loadAllPages();
    } else {
      setAllFoundations(allData);
      setFilteredFoundations(allData);
    }
  }, [allData, totalPages]);

  const loadAllPages = async () => {
    if (allData.length === 0) return;
    const results = [...allData];
    for (let p = 2; p <= totalPages; p++) {
      let pageData = [];
      await GetAllFoundations(
        () => {},
        setError,
        (data) => { pageData = data; },
        p,
        () => {}
      );
      results.push(...pageData);
    }
    setAllFoundations(results);
    setFilteredFoundations(results);
    setFetchLoading(false);
  };

  // فلترة المؤسسات بالسيرش
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredFoundations(allFoundations);
    } else {
      const filtered = allFoundations.filter((f) => {
        const arName = f.name?.ar?.toLowerCase() || "";
        const enName = f.name?.en?.toLowerCase() || "";
        return arName.includes(query) || enName.includes(query);
      });
      setFilteredFoundations(filtered);
    }
    setSelectedFoundationId("");
  }, [searchQuery, allFoundations]);

  const handleSend = () => {
    if (!title.trim()) {
      setError("يرجى إدخال عنوان الإشعار");
      return;
    }
    if (!body.trim()) {
      setError("يرجى إدخال نص الإشعار");
      return;
    }
    setError("");
    SendNotification(title, body, selectedFoundationId, setLoading, setError, setSuccess);
  };

  const handleReset = () => {
    setTitle("");
    setBody("");
    setSelectedFoundationId("");
    setSearchQuery("");
    setError("");
    setSuccess(false);
  };

  const selectedFoundation = allFoundations.find(f => f._id === selectedFoundationId);

  return (
    <div className="notifications-page">
      {/* Header */}
      <div className="notifications-header">
        <div className="notifications-title">
          <FontAwesomeIcon icon={faBell} className="header-icon" />
          <h1>الإشعارات</h1>
        </div>
        <p className="notifications-subtitle">
          أرسل إشعارات؛ اختيار المؤسسة اختياري لتوجيه الإشعار لمؤسسة محددة
        </p>
      </div>

      <div className="notifications-content">
        {/* Form Card */}
        <div className="notification-form-card">
          <h2 className="form-title">إرسال إشعار جديد</h2>

          {/* Success Message */}
          {success && (
            <div className="success-alert">
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>تم إرسال الإشعار بنجاح!</span>
              <button className="reset-btn" onClick={handleReset}>
                إرسال إشعار آخر
              </button>
            </div>
          )}

          {!success && (
            <>
              {/* Error */}
              {error && <div className="error-alert">{error}</div>}

              {/* Title */}
              <div className="form-group">
                <label className="form-label">عنوان الإشعار</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="أدخل عنوان الإشعار..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Body */}
              <div className="form-group">
                <label className="form-label">نص الإشعار</label>
                <textarea
                  className="form-textarea"
                  placeholder="اكتب محتوى الإشعار هنا..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                />
              </div>

              {/* Foundation Selector */}
              <div className="form-group">
                <label className="form-label">المؤسسة (اختياري)</label>

                {/* Search above select */}
                <div className="search-wrapper">
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="ابحث عن مؤسسة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Select */}
                <div className="select-wrapper">
                  {fetchLoading ? (
                    <div className="select-loading">جاري تحميل المؤسسات...</div>
                  ) : (
                    <select
                      className="form-select"
                      value={selectedFoundationId}
                      onChange={(e) => setSelectedFoundationId(e.target.value)}
                      size={6}
                    >
                      <option value="">
                        {filteredFoundations.length === 0
                          ? "بدون تحديد — لا توجد مؤسسات مطابقة للبحث"
                          : "بدون تحديد — إشعار عام (كل المستخدمين أو حسب إعدادات السيرفر)"}
                      </option>
                      {filteredFoundations.map((f) => (
                        <option key={f._id} value={f._id}>
                          {f.name?.ar || f.name?.en || "مؤسسة بدون اسم"}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Selected foundation badge */}
                {selectedFoundation && (
                  <div className="selected-badge">
                    <span>✅ المؤسسة المختارة:</span>
                    <strong>{selectedFoundation.name?.ar || selectedFoundation.name?.en}</strong>
                  </div>
                )}

                <div className="foundations-count">
                  {filteredFoundations.length} مؤسسة
                  {searchQuery && ` من أصل ${allFoundations.length}`}
                </div>
              </div>

              {/* Send Button */}
              <button
                className="send-btn"
                onClick={handleSend}
                disabled={loading || fetchLoading}
              >
                {loading ? (
                  <span className="btn-loading">جاري الإرسال...</span>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} />
                    <span>إرسال الإشعار</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Info Card */}
        <div className="info-card">
          <h3>📋 تعليمات</h3>
          <ul>
            <li>أدخل عنواناً واضحاً للإشعار</li>
            <li>اكتب محتوى الإشعار في خانة النص</li>
            <li>المؤسسة اختيارية: إن لم تخترها يُرسل الإشعار حسب ما يدعمه السيرفر (عام)</li>
            <li>إن اخترت مؤسسة، يُرسل السيرفر مع الطلب معرّف المؤسسة لتوجيه الإشعار</li>
            <li>استخدم خانة البحث للعثور على مؤسسة عند الحاجة</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
