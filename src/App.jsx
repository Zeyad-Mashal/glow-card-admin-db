import "./App.css";
import City from "./components/City/City";
import Login from "./components/Login/Loing";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Region from "./components/Region/Region";
import Foundation from "./components/Foundation/Foundation";
import Product from "./components/Product/Product";
import Ads from "./components/Ads/Ads";
import AllCards from "./components/AllCards/AllCards";
import SendAds from "./components/SendAds/SendAds";
import DashboardUsers from "./components/DashboardUsers/DashboardUsers";
import Home from "./components/Home/Home";
import Category from "./components/Category/Category";
import Coupon from "./components/Copoun/Coupon";
import Layout from "./components/Layout/Layout";
import Contacts from "./components/Contacts/Contacts";
import RequestCompany from "./components/RequestCompany/RequestCompany";
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/city" element={<City />} />
          <Route path="/region/:id" element={<Region />} />
          <Route path="/foundation" element={<Foundation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product" element={<Product />} />
          <Route path="/ads" element={<Ads />} />
          <Route path="/cards" element={<AllCards />} />
          <Route path="/send-Ads" element={<SendAds />} />
          <Route path="/users" element={<DashboardUsers />} />
          <Route path="/category" element={<Category />} />
          <Route path="/coupon" element={<Coupon />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/getRequest" element={<RequestCompany />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
