import React from "react";
import styled from "styled-components";
import image from "./download.png";

const Header = () => (
  <HeaderContainer>
    <Icon />
    <MenuButton>Dashboard</MenuButton>
    <Nav>
      <NavItem>Home</NavItem>
      <NavItem>About Us</NavItem>
      <NavItem>Contact Us</NavItem>
    </Nav>
  </HeaderContainer>
);

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #022140, #10101f);
  height: 3.5rem;
  color: #fff;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Icon = styled.div`
  background: url(${image}) no-repeat center center;
  margin-left: 1rem;
  width: 40px;
  height: 40px;
  background-size: cover;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  &:hover {
    color: #ddd;
  }
  color: #fff;
  @media (min-width: 768px) {
    display: none;
  }
`;

const Nav = styled.div`
  display: flex;
  gap: 2rem;
  @media (max-width: 767px) {
    display: none;
  }
`;

const NavItem = styled.h1`
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #ddd;
  }
`;

export default Header;
