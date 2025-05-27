import React, { useEffect, useState } from "react";
import "./Home.css";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import GetAllStat from "../../API/Stat/GetAllStat.api";

const Home = () => {
  useEffect(() => {
    getAllStat();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState("");
  const [month, setMonth] = useState();
  const [stats, setStats] = useState({
    totalUsers: 21,
    monthlyCards: 8,
    totalCards: 9,
    totalProfits: 584,
  });

  const pieData = [
    { name: "Monthly Cards", value: allData.monthlyCards },
    { name: "Total Cards", value: allData.totalCards },
    { name: "Total Users", value: allData.totalUsers },
  ];

  const lineData = [
    { name: "Users", value: allData.totalUsers },
    { name: "Cards", value: allData.totalCards },
    { name: "Profits", value: allData.totalProfits },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
  const getAllStat = () => {
    GetAllStat(setLoading, setError, setAllData, data, month);
  };
  return (
    <div className="home-container">
      <h1>Dashboard Statistics</h1>

      <div className="filter_statistics">
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">تفعيل الشهر</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button onClick={getAllStat}>تفعيل الاحصائية</button>
      </div>
      <div className="stats-cards">
        <div className="card">
          <h3>عدد المستخدمين</h3>
          <p>{loading ? <div class="loader"></div> : allData.totalUsers}</p>
        </div>
        <div className="card">
          <h3>عدد البطاقات الشهرية</h3>
          <p>{loading ? <div class="loader"></div> : allData.monthlyCards}</p>
        </div>
        <div className="card">
          <h3>اجمالي عدد البطاقات</h3>
          <p>{loading ? <div class="loader"></div> : allData.totalCards}</p>
        </div>
        <div className="card">
          <h3>اجمالي الارباح</h3>
          <p>
            {loading ? <div class="loader"></div> : allData.totalProfits} ريال
          </p>
        </div>
      </div>

      <div className="charts">
        <div className="chart">
          <h2>Pie Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h2>Line Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Home;
