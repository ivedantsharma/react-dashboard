import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import Select from "react-select";
import jsonData from "./data.json";

const DashboardContainer = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto auto;
  gap: 1rem;
  height: 49rem;
  background: linear-gradient(135deg, #1e4258, #10101f);
  color: #fff;
  overflow: hidden;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    overflow: scroll;
  }
`;

const GraphContainer = styled.div`
  background: linear-gradient(135deg, #022140, #10101f);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SelectContainer = styled.div`
  color: black;
  z-index: 1000;
  grid-column: span 2;
`;

const customStyles = {
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    background: "#022140",
    color: "#fff",
  }),
  control: (provided) => ({
    ...provided,
    background: "#022140",
    color: "#fff",
    borderColor: "#333",
    "&:hover": {
      borderColor: "#022140",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#fff",
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected ? "#265077" : "#022140",
    color: state.isSelected ? "#fff" : "#fff",
    "&:hover": {
      background: "#1E4258",
    },
  }),
};

const timeOptions = [
  { value: "last_hour", label: "Last Hour" },
  { value: "last_day", label: "Last Day" },
  { value: "last_week", label: "Last Week" },
  { value: "all_time", label: "All Time" },
];

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeRange, setTimeRange] = useState("all_time");

  useEffect(() => {
    setData(jsonData);
  }, []);

  useEffect(() => {
    const filtered = filterDataByTimeRange(data, timeRange);
    setFilteredData(filtered);
  }, [data, timeRange]);

  const handleTimeRangeChange = (selectedOption) => {
    setTimeRange(selectedOption.value);
  };

  const filterDataByTimeRange = (data, range) => {
    // Dummy timestamps
    const dummyNow = new Date("2019-01-02T23:59:45");
    const dummyLastHour = new Date("2019-01-02T00:00:00");
    const dummyLastDay = new Date("2019-01-01T00:00:00");
    const dummyLastWeek = new Date("2018-12-26T00:00:35");

    return data.filter((d) => {
      const timestamp = new Date(d.timestamp);
      switch (range) {
        case "last_hour":
          return timestamp >= dummyLastHour && timestamp <= dummyNow;
        case "last_day":
          return timestamp >= dummyLastDay && timestamp <= dummyNow;
        case "last_week":
          return timestamp >= dummyLastWeek && timestamp <= dummyNow;
        default:
          return true;
      }
    });
  };

  const aggregateData = (data) => {
    const alertsOverTime = {};
    const actions = { allowed: 0, blocked: 0 };
    const signatures = {};
    const heatmapData = {};
    const categories = {};
    const severities = {};

    data.forEach((alert) => {
      const date = new Date(alert.timestamp).toLocaleString();
      alertsOverTime[date] = (alertsOverTime[date] || 0) + 1;
      actions[alert.alert.action] = (actions[alert.alert.action] || 0) + 1;
      signatures[alert.alert.signature] =
        (signatures[alert.alert.signature] || 0) + 1;
      const heatmapKey = `${alert.src_ip}-${alert.dest_ip}`;
      heatmapData[heatmapKey] = (heatmapData[heatmapKey] || 0) + 1;

      const category = alert.alert.category;
      const severity = alert.alert.severity;
      categories[category] = categories[category] || {};
      categories[category][severity] =
        (categories[category][severity] || 0) + 1;

      severities[severity] = (severities[severity] || 0) + 1;
    });

    return {
      alertsOverTime: Object.entries(alertsOverTime).map(([key, value]) => ({
        timestamp: key,
        count: value,
      })),
      actions: Object.entries(actions).map(([key, value]) => ({
        action: key,
        count: value,
      })),
      signatures: Object.entries(signatures).map(([key, value]) => ({
        signature: key,
        count: value,
      })),
      heatmap: Object.entries(heatmapData).map(([key, value]) => {
        const [src_ip, dest_ip] = key.split("-");
        return { src_ip, dest_ip, count: value };
      }),
      categories: Object.entries(categories).map(([category, severityObj]) => ({
        category,
        ...severityObj,
      })),
      severities: Object.entries(severities).map(([severity, count]) => ({
        severity,
        count,
      })),
    };
  };

  const { alertsOverTime, actions, categories, severities } =
    aggregateData(filteredData);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <DashboardContainer>
      <SelectContainer>
        <Select
          styles={customStyles}
          options={timeOptions}
          onChange={handleTimeRangeChange}
          defaultValue={timeOptions[3]}
        />
      </SelectContainer>
      <GraphContainer>
        <h3>Number of Alerts Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={alertsOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </GraphContainer>

      <GraphContainer>
        <h3>Distribution of Alert Actions</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={actions}
              dataKey="count"
              nameKey="action"
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
              label
            >
              {actions.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </GraphContainer>

      <GraphContainer>
        <h3>Number of Alerts by Category and Severity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={categories}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            {Object.keys(categories[0] || {}).map((severity, index) => {
              if (severity !== "category") {
                return (
                  <Bar
                    dataKey={severity}
                    stackId="a"
                    fill={COLORS[index % COLORS.length]}
                  />
                );
              }
              return null;
            })}
          </BarChart>
        </ResponsiveContainer>
      </GraphContainer>

      <GraphContainer>
        <h3>Distribution of Alerts by Severity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={severities}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="severity" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </GraphContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
