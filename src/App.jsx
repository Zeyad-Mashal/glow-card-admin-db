import "./App.css";
import City from "./components/City/City";
import Login from "./components/Login/Loing";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Region from "./components/Region/Region";
import Foundation from "./components/Foundation/Foundation";
import Product from "./components/Product/Product";
import Ads from "./components/Ads/Ads";
import AllCards from "./components/AllCards/AllCards";
import SendAds from "./components/SendAds/SendAds";
import DashboardUsers from "./components/DashboardUsers/DashboardUsers";
function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/city" element={<City />} />
          <Route path="/region/:id" element={<Region />} />
          <Route path="/foundation" element={<Foundation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product" element={<Product />} />
          <Route path="/ads" element={<Ads />} />
          <Route path="/cards" element={<AllCards />} />
          <Route path="/send-Ads" element={<SendAds />} />
          <Route path="/users" element={<DashboardUsers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
