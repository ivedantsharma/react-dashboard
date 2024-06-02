import React, { useState } from "react";
import styled from "styled-components";

const Sidebar = () => {
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <SidebarContainer>
      <Tab
        selected={selectedTab === "Dashboard"}
        onClick={() => handleTabClick("Dashboard")}
      >
        Dashboard
      </Tab>
      <Tab
        selected={selectedTab === "Alerts"}
        onClick={() => handleTabClick("Alerts")}
      >
        Alerts
      </Tab>
      <Tab
        selected={selectedTab === "Places"}
        onClick={() => handleTabClick("Places")}
      >
        Places
      </Tab>
      <Tab
        selected={selectedTab === "Explore"}
        onClick={() => handleTabClick("Explore")}
      >
        Explore
      </Tab>
      <Tab
        selected={selectedTab === "Helpers"}
        onClick={() => handleTabClick("Helpers")}
      >
        Helpers
      </Tab>
      <Tab
        selected={selectedTab === "Contact Us"}
        onClick={() => handleTabClick("Contact Us")}
      >
        Contact Us
      </Tab>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  background: linear-gradient(135deg, #265077, #10101f);
  color: #fff;
  width: 15rem;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Tab = styled.div`
  padding: 1rem;
  margin: 2rem;
  font-size: 1.3rem;
  cursor: pointer;
  border-bottom: 1px solid #022140;
  transition: background-color 0.3s;
  background-color: ${({ selected }) => (selected ? "#1e4258" : "transparent")};
  &:hover {
    background-color: #022140;
  }
`;

export default Sidebar;
