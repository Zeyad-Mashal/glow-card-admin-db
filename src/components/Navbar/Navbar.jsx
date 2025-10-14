// src/components/Navbar/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPlus,
  faCity,
  faBuilding,
  faBullhorn,
  faCreditCard,
  faPaperPlane,
  faTags,
  faTicket,
  faUsers,
  faSignInAlt,
  faFileSignature,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

const Navbar = ({ collapsed, setCollapsed }) => {
  const open = !collapsed; // للوضوح

  return (
    <aside className={`sidebar ${open ? "" : "collapsed"}`}>
      {/* الرأس */}
      <div className="sidebar__top">
        <span className="logo">Glow&nbsp;Card</span>

        <button
          className={`toggle-btn ${open ? "opened" : "closed"}`}
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          <span className={`line ${open ? "" : "rotated"}`} />
        </button>
      </div>

      {/* الروابط */}
      <ul className="nav">
        <li>
          <Link to="/">
            <FontAwesomeIcon icon={faHome} /> <span>الرئيسية</span>
          </Link>
        </li>
        <li>
          <Link to="/product">
            <FontAwesomeIcon icon={faPlus} /> <span>إضافة منتج</span>
          </Link>
        </li>
        <li>
          <Link to="/city">
            <FontAwesomeIcon icon={faCity} /> <span>إضافة مدينة</span>
          </Link>
        </li>
        <li>
          <Link to="/foundation">
            <FontAwesomeIcon icon={faBuilding} /> <span>إضافة مؤسسة</span>
          </Link>
        </li>
        <li>
          <Link to="/ads">
            <FontAwesomeIcon icon={faBullhorn} /> <span>إضافة إعلان</span>
          </Link>
        </li>
        <li>
          <Link to="/cards">
            <FontAwesomeIcon icon={faCreditCard} /> <span>جميع البطاقات</span>
          </Link>
        </li>
        <li>
          <Link to="/send-Ads">
            <FontAwesomeIcon icon={faPaperPlane} /> <span>إرسال إعلانات</span>
          </Link>
        </li>
        <li>
          <Link to="/category">
            <FontAwesomeIcon icon={faTags} /> <span>التصنيفات</span>
          </Link>
        </li>
        <li>
          <Link to="/getRequest">
            <FontAwesomeIcon icon={faFileSignature} />
            <span>طلبات بطاقه الشركات</span>
          </Link>
        </li>
        <li>
          <Link to="/coupon">
            <FontAwesomeIcon icon={faTicket} /> <span>الكوبونات</span>
          </Link>
        </li>
        <li>
          <Link to="/contacts">
            <FontAwesomeIcon icon={faFileSignature} />
            <span>طلبات انضمام الشركات</span>
          </Link>
        </li>

        <li>
          <Link to="/users">
            <FontAwesomeIcon icon={faUsers} /> <span>المستخدمون</span>
          </Link>
        </li>
        <li>
          <Link to="/login">
            <FontAwesomeIcon icon={faSignInAlt} /> <span>تسجيل الدخول</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Navbar;
