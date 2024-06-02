import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    background-color: #022140;
    color: #fff;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`;

const AppContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const AppContent = styled.div`
  flex: 1;
  overflow-y: auto;
  background: linear-gradient(135deg, #022140, #10101f);
  color: #000;
  padding: 1rem;
`;

const App = () => (
  <>
    <GlobalStyle />
    <MainContainer>
      <Header />
      <AppContainer>
        <Sidebar />
        <AppContent>
          <Dashboard />
        </AppContent>
      </AppContainer>
    </MainContainer>
  </>
);

export default App;
