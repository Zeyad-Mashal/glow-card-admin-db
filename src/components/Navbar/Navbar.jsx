import React, { useRef } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const offcanvasRef = useRef(null);

  const handleLinkClick = () => {
    if (offcanvasRef.current) {
      const offcanvas = new window.bootstrap.Offcanvas(offcanvasRef.current);
      offcanvas.hide();
    }
  };

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Glow Card
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasDarkNavbar"
          aria-controls="offcanvasDarkNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end text-bg-dark"
          tabindex="-1"
          id="offcanvasDarkNavbar"
          aria-labelledby="offcanvasDarkNavbarLabel"
          ref={offcanvasRef}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
              Glow Card
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/"
                  onClick={handleLinkClick}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/product"
                  onClick={handleLinkClick}
                >
                  اضافة منتج
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/city" onClick={handleLinkClick}>
                  اضافة مدينة
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/foundation"
                  onClick={handleLinkClick}
                >
                  اضافة المؤسسة
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/ads" onClick={handleLinkClick}>
                  اضافة اعلان
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/cards"
                  onClick={handleLinkClick}
                >
                  جميع البطاقات
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/send-Ads"
                  onClick={handleLinkClick}
                >
                  ارسال اعلانات
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/users"
                  onClick={handleLinkClick}
                >
                  المستخدمين
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/login"
                  onClick={handleLinkClick}
                >
                  login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
