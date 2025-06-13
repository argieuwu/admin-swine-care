import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: #ffffff;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
`;

const SidebarContent = styled.div`
  padding: 2rem 1rem;
  flex: 1;
`;

const SidebarTitle = styled.h3`
  margin-bottom: 1rem;
  color: #333;
`;

const MenuTitle = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin-bottom: 0.5rem;
`;

const StyledNavLink = styled(NavLink)`
  display: block;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  &.active {
    background-color: #e63946;
    color: white;
  }
`;

const SidebarFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #eee;
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #e63946;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c1121f;
  }
`;

const Sidebar = () => {
  const handleLogout = () => {
    // Implement logout functionality
    console.log('Logout clicked');
  };

  return (
    <SidebarContainer>
      <SidebarContent>
        <SidebarTitle>Admin Navigation</SidebarTitle>
        <MenuTitle>Monitoring</MenuTitle>
        <SidebarMenu>
          <MenuItem>
            <StyledNavLink to="/" end>
              Overview
            </StyledNavLink>
          </MenuItem>
          <MenuItem>
            <StyledNavLink to="/map">
              ASF Map
            </StyledNavLink>
          </MenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton onClick={handleLogout}>
          Logout
        </LogoutButton>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar; 