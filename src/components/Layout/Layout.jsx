// src/components/Layout/Layout.jsx
import React, { useState } from "react";
import "./Layout.css"; // سننشئه بعد قليل
import Navbar from "../Navbar/Navbar";
export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false); // حالة الطي

  return (
    <>
      {/* السايدبار يبدّل حالته عبر الـ props */}
      <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* كل الصفحات */}
      <main className={collapsed ? "content collapsed" : "content"}>
        {children}
      </main>
    </>
  );
}
