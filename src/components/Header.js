import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  
  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
  }
`;

const LogoIcon = styled.img`
  height: 40px;
  margin-right: 10px;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  
  .highlight {
    color: #e63946;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserAvatar = styled.div`
  width: 35px;
  height: 35px;
  background-color: #e63946;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <NavContainer>
        <Logo>
          <Link to="/">
            <LogoIcon src="/images/SwineCareFinal.png" alt="Pig Icon" />
            <LogoText>ASF <span className="highlight">Tracker</span></LogoText>
          </Link>
        </Logo>
        <UserProfile>
          <UserAvatar>A</UserAvatar>
          <span>Admin</span>
        </UserProfile>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header; 